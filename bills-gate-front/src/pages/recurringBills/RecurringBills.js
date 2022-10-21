import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import Modal from '../../components/Modal/Modal';
import TableCustom from '../../components/Table/TableCustom'
import api from '../../utils/api';
import FieldsTableRecurringBill from './config/FieldsTableRecurringBill';
import FieldsFilterRecurringBill from './config/FieldsFilterRecurringBill';
import FFieldsFormRecurringBill from './config/FieldsFormRecurringBill';
import ValidateFormInvoice from './config/ValidateFormInvoice';

export default function RecurringBills(props) {
  const { user } = props;
  const [rows, setRows] = React.useState([]);
  // Management Filter
  const [fieldsFilter, setFieldsFilter] = React.useState([]);
  //For the modal create invoice
  const [open, setOpen] = React.useState(false);
  const [invoiceToModified, setInvoiceToModified] = React.useState(null);

  const getRecurringBills = React.useCallback((filter = null) => {
    if (user) {
      let path = '/recurringbills/all';
      let method = 'get';
      if (filter) {
        path = 'recurringbills/filter'
        method = 'post'
      }
      api(method, path, [], filter).then(recurringBills => {
        setRows(recurringBills.data);
      }).catch(err => {
        console.error(err);
      });
    }
  }, [user]);

  React.useEffect(() => {
    getRecurringBills();
    setFieldsFilter(FieldsFilterRecurringBill);
  }, [getRecurringBills]);

  // For the filter
  const handleSetFieldsFilter = async (fieldFilterId, value) => {
    const newFieldsFilter = fieldsFilter.map(fieldFilter => {
      if (fieldFilter.id === fieldFilterId){
        fieldFilter.value = value;
        fieldFilter.ignore = false;
        return fieldFilter;
      }
      return fieldFilter;
    });
    setFieldsFilter(newFieldsFilter);
    getRecurringBills(newFieldsFilter);
  }

  const handleResetFieldsFilter = () => {
    const newFieldsFilter = fieldsFilter.map(fieldFilter => {
      fieldFilter.ignore = true;
      if (typeof fieldFilter.value === 'boolean') {
        fieldFilter.value = false;
      } else {
        fieldFilter.value = '';
      }
      return fieldFilter;
    });
    setFieldsFilter(newFieldsFilter);
    getRecurringBills();
  }
  
  // For the Modal Create invoice
  const handleEditRecurringBills = (e, row) => {
    if (row && row.id) {
      api('get', `/recurringbills/${row.id}`).then(response => {
        response.data.userRecurringBill.forEach(userRecurringBill => {
          userRecurringBill.isPayer =  userRecurringBill.isPayer ? 1 : 0;
        })
        if (!response.data.invoice.companyId) {
          response.data.invoice.companyId = 0;
        }
        if (response.data.invoice.dueDate) {
          response.data.invoice.dueDate = dayjs(response.data.invoice.dueDate).format('YYYY-MM-DD')
        }
        setInvoiceToModified({...response.data.invoice, userRecurringBill: response.data.userRecurringBill});
        setOpen(true);
      });
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setInvoiceToModified(null);
    getRecurringBills();
  };

  const handleValidateRecurringBill = (e, row) => {
    e.preventDefault();
    api('patch', '/recurringbills/' + row.id + '/' + user.id, null, null, {amount: row.dueAmount}).then(result => {
      getRecurringBills();
    }).catch(err => {
      console.error(err);
    })
  }

  const handleInvalidateRecurringBill = (e, row) => {
    e.preventDefault();
    api('patch', '/recurringbills/' + row.id + '/' + user.id, null, null, {amount: row.dueAmount, invalidate: true}).then(result => {
      getRecurringBills();
    }).catch(err => {
      console.error(err);
    })
  }

  const handleDeleteRecurringBill = (e, row) => {
    e.preventDefault();
    api('delete', '/recurringbills/' + row.id).then(() => {
      getRecurringBills();
    }).catch(err => {
      console.error(err);
    })
  }

  return (
    <Box sx={{ width: '90%', m: 'auto' }}>
      <Grid
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
      >
        <Button onClick={handleEditRecurringBills}>
          Add recurring bill
        </Button>
      </Grid>
      <Modal 
        title="Recurring Bills"
        open={open} 
        fieldsFrom={FFieldsFormRecurringBill}
        elementToModified={invoiceToModified}
        userId={user ? user.id : 0} 
        validateForm={ValidateFormInvoice}
        handleClose={handleClose} 
      />
      <TableCustom
        title="Recurring Bills" 
        rows={rows}
        columns={FieldsTableRecurringBill}
        FieldToValidate="paymentDateUser"
        FieldToWarning='dueDate'
        FieldToError='dueDate'
        fieldsFilter={fieldsFilter}
        handleSetFieldsFilter={handleSetFieldsFilter}
        handleResetFieldsFilter={handleResetFieldsFilter}
        handleInvalidate={handleInvalidateRecurringBill}
        handleValidate={handleValidateRecurringBill}
        handleEdit={handleEditRecurringBills}
        handleDelete={handleDeleteRecurringBill}
      />
    </Box>
  );
}
