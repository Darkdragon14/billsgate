const model = require('../../models');
const { userRecurringBill, invoice, userInvoice} = model;
const dayjs = require('dayjs');

/**
 * An recurringBill
 * @typedef {object} recurringBill
 * @property {integer} id
 * @property {string} name
 * @property {string} amount
 * @property {string} dueDate
 * @property {string} pathToAttachedFile
 * @property {integer} companyId
 * @property {boolean} isActive
*/

/**
 * 
 * @param {recurringBill} currentRecurringBill 
 * @param {transaction} transaction 
 */
async function createInvoiceFromRecurringBill (currentRecurringBill, t) {
  const invoiceExist = await invoice.findAll({
    attributes: ['id', 'paymentDate', 'dueDate'],
    where: {
      recurringBillId: currentRecurringBill.dataValues.id
    },
    order: [ [ 'id', 'DESC' ]]
  });

  const now = dayjs();

  if (invoiceExist.length === currentRecurringBill.dataValues.recurringCount) {
    return;
  }
  
  if (invoiceExist.length === 0 || invoiceExist[0].dataValues.paymentDate) {
    
    if (invoiceExist.length > 0  && invoiceExist[0].dataValues.paymentDate) {
      const dueDate = dayjs(invoiceExist[0].dataValues.dueDate);
      const recurringEndDate = dayjs(currentRecurringBill.dataValues.recurringEndDate);
      dueDate.add(1, 'month');
      if (dueDate.isAfter(recurringEndDate)) {
        return;
      }

      if (dueDate.isBefore(now)) {
        dueDate.month(now.month()).year(now.year());
      }

      currentRecurringBill.dataValues.dueDate = dueDate.format('YYYY-MM-DD');
    }

    if (invoiceExist.length === 0 && dayjs(currentRecurringBill.dataValues.dueDate).isAfter(now)) {
      const dueDate = dayjs(currentRecurringBill.dataValues.dueDate);
      // @Todo new to review this part
      if (dueDate.date() < now.date() && now.month() === dueDate.month && now.year() === dueDate.year()) {
        now.date(dueDate.date()).add(1, 'month');
      }
      currentRecurringBill.dataValues.dueDate = now.format('YYYY-MM-DD');
    }

    const usersRecurringBill = await userRecurringBill.findAll({
        attributes: ['userId', 'weight', 'isPayer'],
        where: {
          recurringBillId: currentRecurringBill.dataValues.id
        }
    });

    const newInvoice = currentRecurringBill.dataValues;
    newInvoice.recurringBillId = newInvoice.id;
    delete newInvoice.id;
    delete newInvoice.isActive;
    delete newInvoice.recurrenceUnit;
    delete newInvoice.recurrence;
    delete newInvoice.recurringCount;
    delete newInvoice.recurringEndDate;
    delete newInvoice.createdAt;
    delete newInvoice.updatedAt;
    const invoiceCreated = await invoice.create(newInvoice, { transaction: t });
    
    for (const newUserRecurringBill of usersRecurringBill) {
        const newUserInvoice = newUserRecurringBill.dataValues;
        newUserInvoice.invoiceId = invoiceCreated.dataValues.id;
        await userInvoice.create(newUserInvoice, { transaction: t });
    }
  }
}

module.exports = createInvoiceFromRecurringBill;