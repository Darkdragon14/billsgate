import dayjs from 'dayjs';

const today = dayjs().format('YYYY-MM-DD');

const FieldsFormInvoice = [
  {
    id: "information",
    label: "Information",
    fields: [
      {
        id: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        defaultValue: ''
      },
      {
        id: 'amount',
        label: 'Amount',
        type: 'number',
        required: true,
        defaultValue: 0,
        info: 'For incomming money need a -'
      },
      {
        id: 'dueDate',
        label: 'Due Date',
        type: 'date',
        required: true,
        defaultValue: today
      }
    ]
  },
  {
    id: 'userInvoices', 
    label: 'Users',
    isMultiple: true,
    RequestId: 'listLinkUserInvoices',
    fields: [
      {
        id: 'userId',
        label: 'User',
        type: 'select',
        defaultValue: 0,
        required: true ,
        pathRequest: '/user/all',
        selectField: [
          {
            value: 0,
            label: 'Select an User'
          }
        ]
      },
      {
        id: 'weight',
        label: 'weight',
        type: 'number',
        defaultValue: 1,
        required: true 
      },
      {
        id: 'isPayer',
        label: 'Payer',
        type: 'select',
        defaultValue: 1,
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
        defaultValue: 0,
        pathRequest: '/company/all',
        warningMessage: 'We can\'t show you the list of companies, you can try later to add.',
        selectField: [
          {
            value: 0,
            label: 'Select a Company'
          }
        ]
      },
      /*{
        id: 'paymentDate',
        label: 'Payment Date',
        type: 'date',
        required: false
      }*/
    ]
  }
];

export default FieldsFormInvoice;