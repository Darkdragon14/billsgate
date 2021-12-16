import dayjs from 'dayjs';
import { oneVariableAtTrueInObject } from '../../../utils/objectFunction';

/**
 * 
 * @param {object} invoice
 * @param {array<object>} userInvoices
 * @return {object}
 */
export default function ValidateFormInvoice(invoice, userInvoices) {
    const errorFields =  {
        error: false,
        totalWeight: false,
        invoice: {
            name: !(invoice.name && invoice.name !== ''),
            amount: isNaN(invoice.amount),
            dueDate: !(dayjs(invoice.dueDate).isValid()),
        },
        userInvoices: [],
    };

    let totalWeight = 0;
    userInvoices.forEach(userInvoice => {
        totalWeight += parseFloat(userInvoice.weight);
        errorFields.userInvoices.push({
            userId: !(userInvoice.userId > 0),
            weight: !(0 <= userInvoice.weight && userInvoice.weight <= 1),
            isPayer: !(userInvoice.isPayer === 0 || userInvoice.isPayer === 1),
        })
    });

    if (totalWeight !== 1) {
        errorFields.totalWeight = true;
        errorFields.userInvoices.forEach(userInvoice => {
            userInvoice.weight = true;
            errorFields.error = true;
        })
    }

    if (!errorFields.error) {
        errorFields.error = oneVariableAtTrueInObject(errorFields.invoice);
    }

    if (!errorFields.error) {
        errorFields.userInvoices.forEach(userInvoice => {
            errorFields.error = oneVariableAtTrueInObject(userInvoice);
        })
    }

    return(errorFields);
}