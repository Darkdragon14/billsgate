const FieldsFilterInvoice = [
    {
        id: 'paymentDateUser',
        label: 'Paid',
        type: 'checkbox',
        value: false,
        ignore: true
    },
    {
        id: 'isPayer',
        label: 'I am the payer',
        type: 'checkbox',
        value: false,
        ignore: true
    },
    {
        id: 'dueDate',
        label: 'The due date\'s month',
        type: 'month',
        value: '',
        ignore: true
    }
];

export default FieldsFilterInvoice;