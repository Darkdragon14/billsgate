const { Op } = require('sequelize');
const model = require('../models');
const { bank, user } = model;

const router = require('express').Router();

/**
 * All information for a bank
 * @typedef {object} bankAnswer
 * @property {integer} id
 * @property {string} name
 * @property {integer} userId
 * @property {string} amount
 * @property {string} iban
 * @property {string} bic
 * @property {string} accountNumber
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * A bank
 * @typedef {object} bank
 * @property {string} name
 * @property {string} amount
 * @property {string} iban
 * @property {string} bic
 * @property {string} accountNumber
 */

/**
 * Body to delete a bank
 * @typedef {object} bankDeleted
 * @property {integer} userId
 */

/**
 * A success response to a creating user 
 * @typedef {object} createBank
 * @property {integer} id - The user's id
 * @property {string} message 
 */

/**
 * An error response
 * @typedef {object} error
 * @property {string} message
 */

/**
 * GET /bank/all
 * @summary Return all bank of one user
 * @tags bank
 * @param {integer} userId.query.required - The user's id 
 * @return {array<bankAnswer>} 200 - success response - application/json
 * @return {error} 404 - Any bank was find for this user - application/json
 * @return {error} 500 - The server failed - application/json
 */
 router.get('/all', async (req, res) => {
  try {
    const banks = await bank.findAll({
      where: {
        userId: req.query.userId
      }
    });
    if (banks.length !== 0) {
      res.status(200).send(banks);
    }
    res.status(404).send({message: 'No bank found for this user'});
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
});

/**
 * GET /bank/{bankId}
 * @summary Return a specific bank
 * @tags bank
 * @param {integer} bankId.path - The bank's id
 * @return {bankAnswer} 200 - success response - application/json
 * @return {error} 404 - User not found - application/json
 * @return {error} 500 - The server failed - application/json
 */
 router.get('/:id', async (req, res) => {
  try {
    const bankFind = await bank.findByPk(req.params.id);
    if(bankFind){
      res.status(200).send(bankFind);
    } else {
      res.status(404).send({message: 'bank not found'});
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
})

/**
 * POST /bank
 * @summary Create a bank 
 * @tags bank
 * @param {bank} request.body.required
 * @return {createBank} 201 - success response - application/json
 * @return {error} 500 - The server failed - application/json
 */
 router.post('/', async (req, res) => {
  try {
    const newBank = await bank.create({...req.body});
    res.status(201).send({id: newBank.dataValues.id, message: 'bank created successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
});

/**
 * PATCH /bank/{bankId}
 * @summary Update a specific bank
 * @tags bank
 * @param {integer} bankId.path - The bank's id 
 * @param {bank} request.body.required
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
* DELETE /bank/{bankId}
* @summary Delete a specific user
* @tags bank
* @param {integer} bankId.path - The bank's is 
* @param {bankDeleted} request.body.required
* @return 204 - success response - application/json
* @return {error} 400 - TMiss the userId - application/json
* @return {error} 500 - The server failed - application/json
*/
router.delete('/:id', async (req, res) => {
  try {
    if(req.body.userId){
      await bank.destroy({
        where: {
          [Op.and]: [
            {
              id: req.params.id
            },
            {
              userId: req.body.userId
            }
          ]
        }
      });
      res.sendStatus(204);
    }
    res.status(400).send({message: 'Miss the userId'});
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
})

module.exports = router;