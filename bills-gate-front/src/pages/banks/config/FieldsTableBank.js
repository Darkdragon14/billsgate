const FieldsTableInvoice = [
    {
      id: 'name',
      label: 'Name',
      type: 'string'
    },
    {
      id: 'iban',
      label: 'Iban',
      type: 'text'
    },
    {
      id: 'amount',
      label: 'Amount',
      type: 'number',
      warning: 50,
      error: 0
    },
    {
      id: 'updatedAt',
      label: 'Last update',
      type: 'dateAndTime'
    },
];

export default FieldsTableInvoice;;