/**
 * 
 * @param {string} email 
 * @returns {boolean}
 */
export const isEmailValid = email => {
  email = email.replace(/ /g, '+').replace(/%20/g, '+');

  const regex = /[-\w.+]+@[-\w.+]+\.[-\w.+]+[\da-zA-Z]/g;
  const regexResult = regex.exec(email);

  if (regexResult === null) {
    return false;
  }

  return (regexResult.index === 0 && regexResult[0] === email);
};