import dayjs from 'dayjs';
import { oneVariableAtTrueInObject } from '../../../utils/objectFunction';

/**
 * 
 * @param {object} recurringBill
 * @return {object}
 */
export default function ValidateFormRecurringBill(recurringBill) {
    const errorFields =  {
        error: false,
        totalWeight: false,
        recurringBill: {
            name: !(recurringBill.name && recurringBill.name !== ''),
            amount: isNaN(recurringBill.amount),
            dueDate: !(dayjs(recurringBill.dueDate).isValid()),
        },
        users: [],
    };

    let totalWeight = 0;
    recurringBill.users.forEach(users => {
        totalWeight += parseFloat(users.weight);
        errorFields.users.push({
            userId: !(users.userId > 0),
            weight: !(0 <= users.weight && users.weight <= 1),
            isPayer: !(users.isPayer === 0 || users.isPayer === 1),
        })
    });

    if (totalWeight !== 1) {
        errorFields.totalWeight = true;
        errorFields.users.forEach(users => {
            users.weight = true;
            errorFields.error = true;
        })
    }

    if (!errorFields.error) {
        errorFields.error = oneVariableAtTrueInObject(errorFields.recurringBill);
    }

    if (!errorFields.error) {
        errorFields.users.forEach(users => {
            errorFields.error = oneVariableAtTrueInObject(users);
        })
    }

    return(errorFields);
}