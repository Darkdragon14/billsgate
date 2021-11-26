const model = require('../models');
const { transaction, bank, invoice } = model;

const router = require('express').Router();

/**
 * All information for a transaction
 * @typedef {object} transactionAnswer
 * @property {integer} id
 * @property {string} bankFromId
 * @property {string} bankToId
 * @property {string} invoiceId
 * @property {string} availableDate
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * A transaction
 * @typedef {object} transaction
 * @property {string} bankFromId
 * @property {string} bankToId
 * @property {string} invoiceId
 * @property {string} availableDate
 */

/**
 * A success response to a creating transaction 
 * @typedef {object} createTransaction
 * @property {integer} id - The transaction's id
 * @property {string} message 
 */

/**
 * An error response
 * @typedef {object} error
 * @property {string} message
 */

/**
 * GET /transaction/all
 * @summary Return all transactions by user or bank
 * @tags transaction
 * @return {array<transactionAnswer>} 200 - success response - application/json
 * @return {error} 500 - The server failed - application/json
 */
router.get('/all', async (req, res) => {
  try {
    const transactions = await transaction.findAll({
      where: {
        [Op.or]: {
          userId: req.query.userId,
          bankFromId: req.query.bankId,
          bankToId: req.query.bankId
        }
      }
    });
    res.status(200).send(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
})

/**
 * @todo Need to think what we put in the response
 * GET /user/{userId}
 * @summary Return a specific user
 * @tags transaction
 * @param {integer} userId.path - The user's is 
 * @return {userAnswer} 200 - success response - application/json
 * @return {error} 404 - User not found - application/json
 * @return {error} 500 - The server failed - application/json
 */
router.get('/:id', async (req, res) => {
  try {
    const userFind = await user.findByPk(req.params.id);
    if(userFind){
      res.status(200).send(userFind);
    } else {
      res.status(404).send({message: 'User not found'});
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
})

/**
 * @todo Need to be testing
 * POST /transaction
 * @summary Create a new transaction 
 * @tags transaction
 * @param {transaction} request.body.require
 * @return {createTransaction} 201 - success response - application/json
 * @return {error} 500 - The server failed - application/json
 */
router.post('/', async (req, res) => {
  try {
    const newTransaction = await transaction.create({...req.body});
    res.status(201).send({id: newTransaction.dataValues.id, message: 'Transaction created successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
});

/**
 * PUT /transaction/{transactionId}
 * @summary Update a specific transaction
 * @tags transaction
 * @param {integer} transactionId.path - The transaction's id 
 * @param {transaction} request.body.required - The new transaction of this transaction
 * @return 204 - success response
 * @return {error} 500 - The server failed - application/json
 */
router.put('/:id', async (req, res) => {
  try {
    await transaction.update({...req.body}, {where: {id: req.params.id}});
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
})

/**
* DELETE /transaction/{transactionId}
* @summary Delete a specific transaction
* @tags transaction
* @param {integer} transactionId.path - The transaction's is 
* @return 204 - success response - application/json
* @return {error} 500 - The server failed - application/json
*/
router.delete('/:id', async (req, res) => {
  try {
    await transaction.destroy({where: {id: req.params.id}});
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
})

module.exports = router;