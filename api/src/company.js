const model = require('../models');
const { company } = model;

const router = require('express').Router();

/**
 * All information for a company
 * @typedef {object} companyAnswer
 * @property {integer} id
 * @property {string} name
 * @property {string} address
 * @property {string} city
 * @property {string} country
 * @property {string} phone
 * @property {string} email
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * A company
 * @typedef {object} company
 * @property {string} name
 * @property {string} address
 * @property {string} city
 * @property {string} country
 * @property {string} phone
 * @property {string} email
 */

/**
 * A success response to a creating company 
 * @typedef {object} createCompany
 * @property {integer} id - The company's id
 * @property {string} message 
 */

/**
 * An error response
 * @typedef {object} error
 * @property {string} message
 */

/**
 * GET /company/all
 * @summary Return all companies
 * @tags company
 * @return {array<company>} 200 - success response - application/json
 * @return {error} 500 - The server failed - application/json
 */
router.get('/all', async (req, res) => {
  try {
    const companies = await company.findAll();
    res.status(200).send(companies);
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
})

/**
 * GET /company/{companyId}
 * @summary Return a specific company
 * @tags company
 * @param {integer} companyId.path.required - The company's is 
 * @return {companyAnswer} 200 - success response - application/json
 * @return {error} 404 - User not found - application/json
 * @return {error} 500 - The server failed - application/json
 */
router.get('/:id', async (req, res) => {
  try {
    const companyFind = await company.findByPk(req.params.id);
    if(companyFind){
      res.status(200).send(companyFind);
    } else {
      res.status(404).send({message: 'Company not found'});
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
})

/**
 * POST /company
 * @summary Create a new company 
 * @tags company
 * @param {company} request.body.require
 * @return {createCompany} 201 - success response - application/json
 * @return {error} 409 - The name is already used - application/json
 * @return {error} 500 - The server failed - application/json
 */
router.post('/', async (req, res) => {
  try {
    const newCompany = await company.create({...req.body});
    res.status(201).send({id: newCompany.dataValues.id, message: 'Company created successfully'});
  } catch (error) {
    console.error(error);
    if(error.errors[0].validatorKey === 'not_unique'){
      res.status(409).send({message: 'Company with this name already exists'})
    }
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
});

/**
 * PUT /company/{companyId}
 * @summary Update a specific company
 * @tags company
 * @param {integer} companyId.path.required - The company's id 
 * @param {company} request.body.required - The new company
 * @return 204 - success response
 * @return {error} 500 - The server failed - application/json
 */
router.put('/:id', async (req, res) => {
  try {
    await company.update({...req.body}, {where: {id: req.params.id}});
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
})

/**
* DELETE /company/{companyId}
* @summary Delete a specific company
* @tags company
* @param {integer} companyId.path.required - The company's id
* @return 204 - success response - application/json
* @return {error} 500 - The server failed - application/json
*/
router.delete('/:id', async (req, res) => {
  try {
    await company.destroy({where: {id: req.params.id}});
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
})

module.exports = router;
