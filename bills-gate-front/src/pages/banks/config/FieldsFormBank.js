const FieldsFormInvoice = [
  {
    id: "information",
    label: "Information",
    fields: [
      {
        id: 'name',
        label: 'Name',
        type: 'text',
        required: true
      },
      {
        id: 'amount',
        label: 'Amount',
        type: 'number',
        required: true
      }
    ]
  },
  {
    id: "more",
    label: "More informations",
    fields: [
      {
        id: 'iban',
        label: 'Iban',
        type: 'text',
        required: false
      },      
      {
        id: 'bic',
        label: 'Bic',
        type: 'text',
        required: false
      },      
      {
        id: 'accountNumber',
        label: 'Account number',
        type: 'text',
        required: false
      },
      {
        id: 'companyId',
        label: 'Company',
        type: 'select',
        required: false,
        defaultValue: 0,
        pathRequest: '/company/all',
        warningMessage: 'We can\'t show you the list of companies, you can try later to add.',
        selectField: [
          {
            value: 0,
            label: 'Select a Company'
          }
        ]
      }
    ]
  }
];

export default FieldsFormInvoice;