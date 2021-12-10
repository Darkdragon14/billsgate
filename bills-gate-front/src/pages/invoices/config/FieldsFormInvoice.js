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
      },
      {
        id: 'dueDate',
        label: 'Due Date',
        type: 'date',
        required: true 
      }
    ]
  },
  {
    id: 'userInvoice', 
    label: 'User(s)',
    fields: [
      {
        id: 'userId',
        label: 'User',
        type: 'select',
        required: true ,
        selectField: [
          {
            value: 0,
            label: 'Select an User'
          },
          {
            value: 1,
            label: 'John'
          },
          {
            value: 2,
            label: 'Alice'
          }
        ]
      },
      {
        id: 'weight',
        label: 'weight',
        type: 'number',
        required: true 
      },
      {
        id: 'isPayer',
        label: 'Payer',
        type: 'select',
        required: true,
        selectField: [
          {
            value: 1,
            label: 'Yes'
          },
          {
            value: 0,
            label: 'No'
          }
        ]
      }
    ]
  },
  {
    id: "more",
    label: "More informations",
    fields: [
      {
        id: 'companyId',
        label: 'Company',
        type: 'select',
        required: false,
        selectField: [
          {
            value: 0,
            label: 'Select a Company'
          },
          {
            value: 1,
            label: 'Home Rent'
          },
          {
            value: 2,
            label: 'Acces Electricity'
          }
        ]
      },
      {
        id: 'paymentDate',
        label: 'Payment Date',
        type: 'date',
        required: false
      }
    ]
  }
];

export default FieldsFormInvoice;