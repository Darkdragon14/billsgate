import dayjs from 'dayjs';

export const checkField = (value, columnId, columns, type) => {
  const column = columns.find(column => column.id === columnId);
  switch (column.type) {
    case 'date':
      return dayjs().isAfter(dayjs(value).subtract(column[type], 'day'));
    case 'number':
      return value < column[type];
    case 'string':
    case 'boolean':
    default:
      return false;
  }
}