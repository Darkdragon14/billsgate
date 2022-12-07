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
    delete invoice.dataValues.userInvoices[0].dataValues.paymentDate;
    const row = {...invoice.dataValues, ...invoice.dataValues.userInvoices[0].dataValues}
    delete row.userInvoices;
    return row;
  });
}

/**
 * 
 * @param {array<recurringBill>} recurringBills 
 * @param {integer} currentUserId
 * @return {array<object>}
 */
 function mergeRecurringBillAndUser(recurringBills, currentUserId) {
  return recurringBills.map(recurringBill => {
    let isPayer = false;
    recurringBill.dataValues.userRecurringBills.forEach(user => {
      if(user.id === currentUserId){
        isPayer = !isPayer;
      }
    });
    recurringBill.dataValues.isPayer = isPayer;
    delete recurringBill.dataValues.userRecurringBills
    return recurringBill;
  });
}

module.exports.mergeInvoicesAndUser = mergeInvoicesAndUser;
module.exports.mergeRecurringBillAndUser = mergeRecurringBillAndUser;