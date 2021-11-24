const { Op } = require('sequelize');
const model = require('../models');
const { user, bank, invoice, userInvoice } = model;

const router = require('express').Router();

/**
 * All information about an invoice
 * @typedef {object} invoiceAnswer
 * @property {integer} id
 * @property {string} name
 * @property {string} amount
 * @property {string} payementDate
 * @property {string} dueDate
 * @property {string} pathToAttachedFile
 * @property {integer} compagnieId
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * An invoice
 * @typedef {object} invoice
 * @property {string} name
 * @property {string} amount
 * @property {string} payementDate
 * @property {string} dueDate
 * @property {string} pathToAttachedFile
 * @property {integer} compagnieId
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
router.get('/all', async (req, res) => {
  try {
    const users = await user.findAll({
      include: userInvoice,
      where: {
        userId: req.params.userId
      }
    });
    res.status(200).send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
})

/**
 * GET /invoice/{invoiceId}
 * @summary Return a specific invoice
 * @tags invoice
 * @param {integer} invoiceId.path - The invoice's id
 * @return {invoiceAnswer} 200 - success response - application/json
 * @return {error} 404 - User not found - application/json
 * @return {error} 500 - The server failed - application/json
 */
router.get('/:id', async (req, res) => {
  try {
    const invoiceFind = await invoice.findByPk(req.params.id, {
      include: userInvoice
    });
    if(invoiceFind){
      res.status(200).send(invoiceFind);
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
router.post('/', async (req, res) => {
  try {
    const newInvoice = await invoice.create({...req.body.invoice});
    for (const linkInvoiceUser of req.body.listLinkUserInvoice) {
      linkInvoiceUser.invoiceId = newInvoice.dataValues.id;
      await userInvoice.create({...linkInvoiceUser});
    }
    res.status(201).send({id: newUser.dataValues.id, message: 'Invoice created successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
});

/**
 * PATCH /invoice/{invoiceId}
 * @summary Update a specific invoice
 * @tags invoice
 * @param {integer} invoiceId.path - The invoice's id 
 * @param {invoice} request.body.required
 * @return 204 - success response
 * @return {error} 500 - The server failed - application/json
 */
router.patch('/:id', async (req, res) => {
  try {
    await user.update({...req.body}, {where: {id: req.params.id}});
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
})

/**
* DELETE /invoice/{invoiceId}
* @summary Delete a specific invoice
* @tags invoice
* @param {integer} invoiceId.path - The invoice's id
* @return 204 - success response - application/json
* @return {error} 500 - The server failed - application/json
*/
router.delete('/:id', async (req, res) => {
  try {
    await invoice.destroy({where: {id: req.params.id}});
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
})

module.exports = router;