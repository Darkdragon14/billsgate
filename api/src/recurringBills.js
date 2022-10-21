const {Op} = require('sequelize');
const model = require('../models');
const { recurringBill, userRecurringBill, invoice } = model;
const router = require('express').Router();
const {mergeRecurringBillAndUser} = require('./utils/mergeInvoicesAndUser');
const createInvoiceFromRecurringBill = require('./utils/createInvoiceFromRecurringBill');

const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const ensureLoggedIn = ensureLogIn();

/**
 * All information about an recurring bill
 * @typedef {object} recurringBilleAnswer
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
 */

/**
 * An recurringBill
 * @typedef {object} recurringBill
 * @property {string} name
 * @property {string} amount
 * @property {string} paymentDate
 * @property {string} dueDate
 * @property {string} pathToAttachedFile
 * @property {integer} companyId
 */

/**
 * The link between an user and an recurringBill
 * @typedef {object} userRecurringBill
 * @property {integer} userId
 * @property {integer} recurringBillId
 */

/**
 * An new recurringBill
 * @typedef {object} newRecurringBill
 * @property {recurringBill} recurringBill
 * @property {array<userRecurringBill>} LinkUserRecurringBill
 */

/**
 * A success response to a creating RecurringBill
 * @typedef {object} createRecurringBill
 * @property {integer} id - The RecurringBill's id
 * @property {string} message 
 */

/**
 * GET /recurringbills/all
 * @summary Return all recurring bills for an user
 * @tags recurring bill
 * @param {integer} userId.query.required - The user's id 
 * @return {array<recurringBilleAnswer>} 200 - success response - application/json
 * @return {error} 500 - The server failed - application/json
 */
 router.get('/all', ensureLoggedIn, async (req, res) => {
  try {
    const recurringBills = await recurringBill.findAll({
      include: [{
        model: userRecurringBill,
        where: {
          userId: req.session.passport.user.id
        }
      }] 
    });
    const rows = mergeRecurringBillAndUser(recurringBills, req.session.passport.user.id);
    res.status(200).send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
});

/**
 * POST /recurringbills
 * @summary Create a new reurring Bill 
 * @tags recurring bill
 * @param {newRecurringBill} request.body.require
 * @return {createRecurringBill} 201 - success response - application/json
 * @return {error} 500 - The server failed - application/json
 */
 router.post('/', ensureLoggedIn, async (req, res) => {
  try {
    await model.sequelize.transaction(async (t) => {
      const usersRecurringBill = req.body.users;
      delete req.body.users; 
      if (!req.body.companyId) {
        delete req.body.companyId
      }
      const newRecurringBill = await recurringBill.create({...req.body}, { transaction: t });
      for (const linkUserRecurringBill of usersRecurringBill) {
        linkUserRecurringBill.recurringBillId = newRecurringBill.dataValues.id;
        await userRecurringBill.create({...linkUserRecurringBill}, { transaction: t });
      }
      if(req.body.isActive) {
        await createInvoiceFromRecurringBill(currentRecurringBill, t);
      }
      res.status(201).send({id: newRecurringBill.dataValues.id, message: 'Recurring bill created successfully'});
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
});

/**
 * PUT /recurringbills/{recurringBillId}
 * @summary Update a specific reurring Bill 
 * @tags recurring bill
 * @param {integer} recurringBillId.path.required - The recurring bill's id 
 * @param {recurringBill} request.body.required
 * @return 204 - success response
 * @return {error} 500 - The server failed - application/json
 */
 router.put('/:id', ensureLoggedIn, async (req, res) => {
  try {
    await model.sequelize.transaction(async (t) => {
      const usersRecurringBill = req.body.users;
      delete req.body.users;
      delete req.body.userId;
      if (req.body.companyId === 0) {
        delete req.body.companyId;
      }
      if (req.body) {
        await recurringBill.update(req.body, {where: {id: req.params.id}, transaction: t});
      }
      if (usersRecurringBill && usersRecurringBill.length > 0) {
        for (const userRecurringBill of usersRecurringBill) {
          await userRecurringBill.update(userRecurringBill, {where: {[Op.and]: {id: userRecurringBill.id, invoiceId: req.params.id}}, transaction: t});
        }
      }
      if(req.body.isActive) {
        await createInvoiceFromRecurringBill(currentRecurringBill, t);
      }
      res.sendStatus(204);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
});

router.patch('/:id', ensureLoggedIn, async (req, res) => {
  try {
    await model.sequelize.transaction(async (t) => {
      const currentRecurringBill = await recurringBill.findByPk(req.params.id, {
        attributes: ['id', 'name', 'amount', 'dueDate', 'pathToAttachedFile', 'companyId', 'isActive'],
      });
      if (currentRecurringBill.dataValues.isActive) {
        await currentRecurringBill.update({ isActive: false }, { transaction: t });
      } else {
        await currentRecurringBill.update({ isActive: true }, { transaction: t });
        await createInvoiceFromRecurringBill(currentRecurringBill, t);
      }
      res.sendStatus(204);
    });
  } catch(error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
});

/**
* DELETE /recurringbills/{recurringBillId}
* @summary Delete a specific recurring Bill
* @tags recurring bill
* @param {integer} recurringBillId.path.required - The recurring Bill's id
* @return 204 - success response - application/json
* @return {error} 500 - The server failed - application/json
*/
router.delete('/:id', ensureLoggedIn, async (req, res) => {
  try {
    await recurringBill.destroy({where: {id: req.params.id}});
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
})

module.exports = router;