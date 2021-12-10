import axios from 'axios';

const protocol = window.location.protocol;
const host = window.location.hostname;
const baseUrl = protocol + '//' + host + ':8000';

/**
 * 
 * @param {'get'|'post'|'put'|'patch'|'delete'} method 
 * @param {'user'|'bank'|'invoice|'company'|'transaction'} path 
 * @param {array<string>} varPath 
 * @param {object} parameters 
 * @param {object} body 
 * @return {axios.Response}
 */
export default function request(method, path, varPath, parameters, body){
  return new Promise((resolve, reject) => {
    const configAxios = {
      method: method,
      baseURL: baseUrl,
      url: path,
      params: parameters,
      data: body
    }
    if(varPath && varPath.length > 0){
      configAxios.path += varPath.join('/');
    }
    axios(configAxios).then(response => {
      resolve(response);
    }).catch(err => {
      reject(err);
    })
  });
}
