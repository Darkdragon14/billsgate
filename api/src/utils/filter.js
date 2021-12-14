const dayjs = require('dayjs');

/**
 * 
 * @typedef {object} filter
 * @property {string} id
 * @property {string} label
 * @property {string} type
 * @property {any} value
 * @property {boolean} ignore
 */

/**
 * 
 * @param {array<object>} rows 
 * @param {array<filter>} fieldsFilter
 * @returns {array<object>} 
 */
function myFilter(rows, fieldsFilter) {
  return rows.filter(row => {
    let filter = true;
    fieldsFilter.map(fieldFilter => {
      switch (fieldFilter.type) {
        case 'checkbox':
          if ((fieldFilter.value && !row[fieldFilter.id]) || (!fieldFilter.value && row[fieldFilter.id] && !fieldFilter.ignore)) {
            filter = false;
          }
          break;
        case 'month':
          if (fieldFilter.value !== '' && !dayjs(row[fieldFilter.id]).isSame(fieldFilter.value, fieldFilter.type)) {
            filter = false;
          }
        default:
          break;
      }
    })
    return filter;
  })
}

module.exports = myFilter;