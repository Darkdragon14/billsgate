const model = require('../../models');
const { invoice, userInvoice } = model;

/**
 * 
 * @param {array<invoice>} invoices 
 * @return {array<object>}
 */
function mergeInvoicesAndUser(invoices) {
  return invoices.map(invoice => {
    invoice.dataValues.paymentDateUser = invoice.dataValues.userInvoices[0].dataValues.paymentDate;
    invoice.dataValues.dueAmount = invoice.dataValues.amount * invoice.dataValues.userInvoices[0].dataValues.weight;
    delete invoice.dataValues.userInvoices[0].dataValues.id;
    const row = {...invoice.dataValues, ...invoice.dataValues.userInvoices[0].dataValues}
    delete row.userInvoices;
    return row;
  });
}

module.exports = mergeInvoicesAndUser;