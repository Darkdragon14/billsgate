/**
 * 
 * @param {object} object object to testing
 * @return {boolean}
 */
export function oneVariableAtTrueInObject(object) {
    const keys = Object.keys(object);
    for (const key of keys) {
        if(object[key]){
            return true;
        }
    }
    return false;
}