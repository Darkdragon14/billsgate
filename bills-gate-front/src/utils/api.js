import axios from 'axios';

const protocol = window.location.protocol;
const host = window.location.hostname;
const baseURL = protocol + '//' + host + ':8000';

/**
 * 
 * @param {'get'|'post'|'put'|'patch'|'delete'} method 
 * @param {'user'|'bank'|'invoice|'company'|'transaction'} path 
 * @param {array<string>} varPath 
 * @param {object} params 
 * @param {object} body 
 * @param {object} headers 
 * @return {axios.Response}
 */
export default function request(method, path, varPath, params, body, headers){
  return new Promise((resolve, reject) => {
    const configAxios = {
      method,
      baseURL,
      url: path,
      params,
      data: body,
      headers,
      withCredentials: true 
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
