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
      }
    ]
  },
  {
    id: "address",
    label: "Address",
    fields: [
      {
        id: 'address',
        label: 'Street',
        type: 'text',
        required: false
      },      
      {
        id: 'city',
        label: 'City',
        type: 'text',
        required: false
      },      
      {
        id: 'country',
        label: 'Country',
        type: 'text',
        required: false
      }
    ]
  }, {
    id: "contact",
    label: "Contact",
    fields: [
      {
        id: 'phone',
        label: 'Phone',
        type: 'text',
        required: false
      },      
      {
        id: 'email',
        label: 'Email',
        type: 'email',
        required: false
      }
    ]
  }
];

export default FieldsFormInvoice;