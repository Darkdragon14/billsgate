const { Op, literal } = require('sequelize');
const { now } = require('sequelize/lib/utils');
const model = require('../models');
const { bank, invoice, userInvoice, recurringBill } = model;
const myFilter = require('./utils/filter');
const { mergeInvoicesAndUser } = require('./utils/mergeInvoicesAndUser');
const createInvoiceFromRecurringBill = require('./utils/createInvoiceFromRecurringBill');

const router = require('express').Router();
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const ensureLoggedIn = ensureLogIn();

/**
 * All information about an invoice
 * @typedef {object} invoiceAnswer
 * @property {integer} id
 * @property {string} name
 * @property {string} amount
 * @property {string} paymentDate
 * @property {string} dueDate
 * @property {string} pathToAttachedFile
 * @property {integer} companyId
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {float} weight
 * @property {integer} userId
 * @property {string} paymentDateUser
 */

/**
 * An invoice
 * @typedef {object} invoice
 * @property {string} name
 * @property {string} amount
 * @property {string} paymentDate
 * @property {string} dueDate
 * @property {string} pathToAttachedFile
 * @property {integer} companyId
 */

/**
 * The link between an user and an invoice
 * @typedef {object} userInvoice
 * @property {integer} userId
 * @property {integer} invoiceId
 * @property {integer} weight
 * @property {boolean} isPayer
 */

/**
 * An new invoice
 * @typedef {object} newInvoice
 * @property {invoice} invoice
 * @property {array<userInvoice>} LinkUserInvoice
 */

/**
 * A success response to a creating user 
 * @typedef {object} createInvoice
 * @property {integer} id - The user's id
 * @property {string} message 
 */

/**
 * An error response
 * @typedef {object} error
 * @property {string} message
 */

/**
 * GET /invoice/all
 * @summary Return all invoice for an user
 * @tags invoice
 * @param {integer} userId.query.required - The user's id 
 * @return {array<invoiceAnswer>} 200 - success response - application/json
 * @return {error} 500 - The server failed - application/json
 */
router.get('/all', ensureLoggedIn, async (req, res) => {
  try {
    const invoices = await invoice.findAll({
      include: [{
        model: userInvoice,
        where: {
          userId: req.session.passport.user.id
        }
      }] 
    });
    const rows = mergeInvoicesAndUser(invoices);
    res.status(200).send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
})

/**
 * GET /invoice/{invoiceId}
 * @summary Return a specific invoice
 * @tags invoice
 * @param {integer} invoiceId.path.required - The invoice's id
 * @return {invoiceAnswer} 200 - success response - application/json
 * @return {error} 404 - User not found - application/json
 * @return {error} 500 - The server failed - application/json
 */
router.get('/:id', ensureLoggedIn, async (req, res) => {
  try {
    const invoiceFind = await invoice.findByPk(req.params.id);
    if(invoiceFind){
      const userInvoices = await userInvoice.findAll({where: {invoiceId: req.params.id}});
      const response = {
        invoice: invoiceFind,
        userInvoices: userInvoices,
      };
      res.status(200).send(response);
    } else {
      res.status(404).send({message: 'Invoice not found'});
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
})

/**
 * POST /invoice
 * @summary Create a new invoice 
 * @tags invoice
 * @param {newInvoice} request.body.require
 * @return {createInvoice} 201 - success response - application/json
 * @return {error} 500 - The server failed - application/json
 */
router.post('/', ensureLoggedIn, async (req, res) => {
  try {
    await model.sequelize.transaction(async (t) => {
      const newUserInvoices = req.body.userInvoices;
      delete req.body.userInvoices;
      if (req.body.companyId === 0) {
        delete req.body.companyId;
      }
      const newInvoice = await invoice.create({...req.body}, { transaction: t });
      for (const newUserInvoice of newUserInvoices) {
        newUserInvoice.invoiceId = newInvoice.dataValues.id;
        await userInvoice.create({...newUserInvoice}, { transaction: t });
      }
      res.status(201).send({id: newInvoice.dataValues.id, message: 'Invoice created successfully'});
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
});

/**
 * POST /invoice/filter
 * @summary Filter invoices
 * @tags invoice
 * @param {fieldsFilterInvoice} request.body.require
 * @return {array<invoiceAnswer} 200 - success response - application/json
 * @return {error} 500 - The server failed - application/json
 */
 router.post('/filter', ensureLoggedIn, async (req, res) => {
  try {
    const fieldsFilter = req.body;
    const invoices = await invoice.findAll({
      include: [{
        model: userInvoice,
        where: {
          userId: req.session.passport.user.id
        }
      }] 
    });
    const rows = mergeInvoicesAndUser(invoices);
    const rowsFilter = myFilter(rows, fieldsFilter);
    res.status(200).send(rowsFilter);
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
});

/**
 * PUT /invoice/{invoiceId}
 * @summary Update a specific invoice
 * @tags invoice
 * @param {integer} invoiceId.path.required - The invoice's id 
 * @param {invoice} request.body.required
 * @return 204 - success response
 * @return {error} 500 - The server failed - application/json
 */
router.put('/:id', ensureLoggedIn, async (req, res) => {
  try {
    await model.sequelize.transaction(async (t) => {
      const listLinkUserInvoices = req.body.listLinkUserInvoices;
      delete req.body.listLinkUserInvoices;
      if (req.body.companyId === 0) {
        delete req.body.companyId;
      }
      if (req.body) {
        await invoice.update(req.body, {where: {id: req.params.id}, transaction: t});
      }
      if (listLinkUserInvoices && listLinkUserInvoices.length > 0) {
        for (const linkUserInvoice of listLinkUserInvoices) {
          await userInvoice.update(linkUserInvoice, {where: {[Op.and]: {id: linkUserInvoice.id, invoiceId: req.params.id}}, transaction: t});
        }
      }
      res.sendStatus(204);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
});

// @todo call create next invoice if link with recurring bill
/**
 * PATCH /invoice/{invoiceId}/{userId}
 * @summary The user paid it's part
 * @tags invoice
 * @param {integer} invoiceId.path.required - The invoice's id 
 * @param {integer} userId.path.required - The user's'invoice's id 
 * @param {invoice} request.body.required
 * @return 204 - success response
 * @return {error} 500 - The server failed - application/json
 */
 router.patch('/:invoiceId/:userId', async (req, res) => {
  try {
    await model.sequelize.transaction(async (t) => {
      let paymentDate = now();
      let operation = req.body.amount <= 0 ? 'amount + ' + req.body.amount.substring(1) : 'amount - ' + req.body.amount;
      if (req.body.invalidate) {
        paymentDate = null;
        operation = req.body.amount <= 0 ? 'amount - ' + req.body.amount.substring(1) : 'amount + ' + req.body.amount;
      }
      await bank.update(
        {
          amount: literal(operation)
        }, 
        {
          where: {
            userId: req.params.userId
          },
          limit : 1,
          transaction: t 
        }
      )
      await userInvoice.update(
        {
          paymentDate: paymentDate
        }, 
        {
          where: {
            [Op.and]: {
              invoiceId: req.params.invoiceId,
              userId: req.params.userId
            }
          }, 
          transaction: t 
        }
      );
      const isPayer = await userInvoice.findOne({
        where: {
          [Op.and]: {
            invoiceId: req.params.invoiceId,
            userId: req.params.userId,
            isPayer: true
          }
        }
      })
      if (isPayer) {
        await invoice.update(
          {
            paymentDate: paymentDate
          }, 
          {
            where: {
              id: req.params.invoiceId
            }, 
            transaction: t
          }
        );
        const currentInvoice = await invoice.findByPk(req.params.invoiceId, {
          attributes: ['recurringBillId']
        })
        const recurringBillId = currentInvoice.dataValues.recurringBillId;
        if (recurringBillId) {
          const currentRecurringBill = await recurringBill.findByPk(recurringBillId);
          createInvoiceFromRecurringBill(currentRecurringBill, t);
        }
      }
      res.sendStatus(204);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
});

/**
* DELETE /invoice/{invoiceId}
* @summary Delete a specific invoice
* @tags invoice
* @param {integer} invoiceId.path.required - The invoice's id
* @return 204 - success response - application/json
* @return {error} 500 - The server failed - application/json
*/
router.delete('/:id', ensureLoggedIn, async (req, res) => {
  try {
    await invoice.destroy({where: {id: req.params.id}});
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
})

module.exports = router;
