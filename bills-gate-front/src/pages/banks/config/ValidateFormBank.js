import { oneVariableAtTrueInObject } from '../../../utils/objectFunction';
import { isValidIBAN, isValidBIC } from 'ibantools';

/**
 * 
 * @param {object} bank
 * @return {object}
 */
export default function ValidateFormBank(bank) {
    const errorFields =  {
        error: false,
        bank: {
            name: !(bank.name && bank.name !== ''),
            amount: isNaN(bank.amount),
            iban: (bank.iban && bank.iban !== '') ? !isValidIBAN(bank.iban) :  false,
            bic: (bank.bic && bank.bic !== '') ? !isValidBIC(bank.bic) :  false,
        }
    };

    errorFields.error = oneVariableAtTrueInObject(errorFields.bank);

    return(errorFields);
}