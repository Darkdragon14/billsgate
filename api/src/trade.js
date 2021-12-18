const model = require('../models');
const { Op } = require('sequelize');
const { user, invoice, userInvoice } = model;
const dayjs = require('dayjs');

const router = require('express').Router();

/**
 * GET /trade/all
 * @summary Return all transactions by user or bank
 * @tags transaction
 * @return {array<transactionAnswer>} 200 - success response - application/json
 * @return {error} 500 - The server failed - application/json
 */
 router.get('/all', async (req, res) => {
    try {
        const trades = await userInvoice.findAll({
            include: [{
                model: invoice,
                include: [{
                    model: userInvoice,
                    where: {
                        [Op.and]: {
                            userId: {
                                    [Op.ne]: req.query.userId
                            },
                            paymentDate: null
                        }
                    },
                    include: [{
                        model: user
                    }]
                }],
                required: true
            }],
            where: {
                [Op.and]: {
                    userId: req.query.userId,
                    paymentDate: null
                }
            }
        });
        const rows = [];
        trades.forEach(trade => {
            if (trade.isPayer) {
                const userInvoices = trade.invoice.userInvoices;
                userInvoices.forEach(userInvoice => {
                    const rowId = rows.findIndex(row => row.id === userInvoice.userId);
                    if (rowId > -1) {
                        let dueAmount = rows[rowId].dueAmount > 0 ? rows[rowId].dueAmount - trade.invoice.amount * userInvoice.weight : 0;
                        let waitingAmount = rows[rowId].waitingAmount > 0 ? rows[rowId].waitingAmount + trade.invoice.amount * userInvoice.weight : 0;
                        if (dueAmount < 0){
                            waitingAmount = dueAmount * -1;
                            dueAmount = 0;
                        }
                        const nextPayment = dayjs(rows[rowId].nextPayment).diff(dayjs(trade.invoice.dueDate), 'day') > 0 ?rows[rowId].nextPayment : trade.invoice.dueDate;
                        rows[rowId].dueAmount = dueAmount;
                        rows[rowId].waitingAmount = waitingAmount;
                        rows[rowId].nextPayment = nextPayment;
                    } else {
                        rows.push({
                            id: userInvoice.userId,
                            username: userInvoice.user.username,
                            dueAmount: 0,
                            waitingAmount: trade.invoice.amount * userInvoice.weight,
                            nextPayment: trade.invoice.dueDate
                        })
                    }
                });
            } else {
                const userInvoices = trade.invoice.userInvoices;
                userInvoices.forEach(userInvoice => {
                    if (userInvoice.isPayer){
                        const rowId = rows.findIndex(row => row.id === userInvoice.userId);
                        if (rowId > -1) {
                            let dueAmount = rows[rowId].dueAmount > 0 ? rows[rowId].dueAmount + trade.invoice.amount * trade.weight : 0;
                            let waitingAmount = rows[rowId].waitingAmount > 0 ? rows[rowId].waitingAmount - trade.invoice.amount * trade.weight : 0;
                            if (waitingAmount < 0){
                                dueAmount = waitingAmount * -1;
                                waitingAmount = 0;
                            }
                            const nextPayment = dayjs(rows[rowId].nextPayment).diff(dayjs(trade.invoice.dueDate), 'day') > 0 ?rows[rowId].nextPayment : trade.invoice.dueDate;
                            rows[rowId].dueAmount = dueAmount;
                            rows[rowId].waitingAmount = waitingAmount;
                            rows[rowId].nextPayment = nextPayment;
                        } else {
                            rows.push({
                                id: userInvoice.userId,
                                username: userInvoice.user.username,
                                dueAmount: trade.invoice.amount * trade.weight,
                                waitingAmount: 0,
                                nextPayment: trade.invoice.dueDate
                            })
                        }
                    }
                })
            }
        })
        res.status(200).send(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
    }
})

module.exports = router;