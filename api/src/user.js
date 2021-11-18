const { Op } = require('sequelize');
const model = require('../models');
const { user } = model;

const router = require('express').Router();

router.get('/all', async (req, res) => {
  try {
    const users = await user.findAll();
    res.status(200).send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
})

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

router.post("/", async (req, res) => {
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

router.patch("/:id", async (req, res) => {
  try {
    await user.update({...req.body}, {where: {id: req.params.id}});
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
})

router.delete("/:id", async (req, res) => {
  try {
    await user.destroy({where: {id: req.params.id}});
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
  }
})

module.exports = router;
