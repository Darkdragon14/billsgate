import dayjs from 'dayjs';

const today = dayjs().format('YYYY-MM-DD');

const FieldsFormRecurringBill = [
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
        label: 'Recurring Date',
        type: 'date',
        required: true,
        defaultValue: today
      },
      {
        id: 'recurrence',
        label: 'Total of recurrence',
        type: 'number',
        required: false,
        defaultValue: 0
      },
      {
        id: 'recurrenceUnit',
        label: 'Periodicity',
        type: 'select',
        defaultValue: 'month',
        required: false ,
        selectField: [
          {
            value: 'day',
            label: 'Day'
          },
          {
            value: 'week',
            label: 'Week'
          },
          {
            value: 'month',
            label: 'Month'
          },
          {
            value: 'year',
            label: 'Year'
          }
        ]
      },
      {
        id: 'isActive',
        label: 'Is Active',
        type: 'select',
        defaultValue: 0,
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
    id: 'users', 
    label: 'Users',
    isMultiple: true,
    RequestId: 'listLinkuserRecurringBills',
    fields: [
      {
        id: 'userId',
        label: 'User',
        type: 'select',
        defaultValue: 0,
        required: true ,
        pathRequest: '/user/all',
        selectField: []
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
        selectField: []
      }
    ]
  }
];

export default FieldsFormRecurringBill;