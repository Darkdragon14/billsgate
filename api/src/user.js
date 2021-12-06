const model = require('../models');
const { user } = model;

const router = require('express').Router();

/**
 * All information for an user
 * @typedef {object} userAnswer
 * @property {integer} id
 * @property {string} username
 * @property {string} firstname
 * @property {string} lastname
 * @property {string} email
 * @property {string} gender
 * @property {boolean} external
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * An user
 * @typedef {object} user
 * @property {string} username
 * @property {string} firstname
 * @property {string} lastname
 * @property {string} email
 * @property {string} gender
 * @property {boolean} external
 */

/**
 * A success response to a creating user 
 * @typedef {object} createUser
 * @property {integer} id - The user's id
 * @property {string} message 
 */

/**
 * An error response
 * @typedef {object} error
 * @property {string} message
 */

/**
 * GET /user/all
 * @summary Return all users
 * @tags user
 * @return {array<userAnswer>} 200 - success response - application/json
 * @return {error} 500 - The server failed - application/json
 */
router.get('/all', async (req, res) => {
  try {
    const users = await user.findAll();
    res.status(200).send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
})

/**
 * GET /user/{userId}
 * @summary Return a specific user
 * @tags user
 * @param {integer} userId.path.required - The user's is 
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
 * POST /user
 * @summary Create a new user 
 * @tags user
 * @param {user} request.body.require
 * @return {createUser} 201 - success response - application/json
 * @return {error} 409 - The email or the username are already used - application/json
 * @return {error} 500 - The server failed - application/json
 */
router.post('/', async (req, res) => {
  try {
    const newUser = await user.create({...req.body});
    res.status(201).send({id: newUser.dataValues.id, message: 'Account created successfully'});
  } catch (error) {
    console.error(error);
    if(error.errors[0].validatorKey === 'not_unique'){
      res.status(409).send({message: 'User with that username or email already exists'})
    }
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
});

/**
 * PUT /user/{userId}
 * @summary Update a specific user
 * @tags user
 * @param {integer} userId.path.required - The user's id 
 * @param {user} request.body.required - The new username of this user
 * @return 204 - success response
 * @return {error} 500 - The server failed - application/json
 */
router.put('/:id', async (req, res) => {
  try {
    await user.update({...req.body}, {where: {id: req.params.id}});
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
})

/**
* DELETE /user/{userId}
* @summary Delete a specific user
* @tags user
* @param {integer} userId.path.required - The user's is 
* @return 204 - success response - application/json
* @return {error} 500 - The server failed - application/json
*/
router.delete('/:id', async (req, res) => {
  try {
    await user.destroy({where: {id: req.params.id}});
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
})

module.exports = router;
