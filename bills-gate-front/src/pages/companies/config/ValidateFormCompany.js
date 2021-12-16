import { oneVariableAtTrueInObject } from '../../../utils/objectFunction';
import { isEmailValid } from '../../../utils/checkEmail';

/**
 * 
 * @param {object} company
 * @return {object}
 */
export default function ValidateFormCompany(company) {
    const errorFields =  {
        error: false,
        company: {
            name: !(company.name && company.name !== ''),
            email: (company.email && company.email !== '') ? !isEmailValid(company.email) :  false
        }
    };

    errorFields.error = oneVariableAtTrueInObject(errorFields.company);

    console.log(errorFields);

    return(errorFields);
}