const FieldsTableInvoice = [
    {
      id: 'name',
      label: 'Name',
      type: 'string'
    },
    {
      id: 'amount',
      label: 'Total amount',
      type: 'number'
    },
    {
      id: 'dueAmount',
      label: 'Due amount',
      type: 'number'
    },
    {
      id: 'dueDate',
      label: 'Due Date',
      type: 'date',
      warning: 10,
      error: 0
    },
    {
      id: 'paymentDateUser',
      label: 'My paiement date',
      type: 'date'
    },
    {
      id: 'paymentDate',
      label: 'Paiement date',
      type: 'date'
    },
    {
      id: 'isPayer',
      label: 'I am the payer',
      type: 'boolean'
    },
];

export default FieldsTableInvoice;;