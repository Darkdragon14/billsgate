import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import Modal from '../../components/Modal/Modal';
import TableCustom from '../../components/Table/TableCustom'
import api from '../../utils/api';
import FieldsTableInvoice from './config/FieldsTableInvoice';
import FieldsFilterInvoice from './config/FieldsFilterInvoice';
import FieldsFormInvoice from './config/FieldsFormInvoice';
import ValidateFormInvoice from './config/ValidateFormInvoice';

export default function Invoices(props) {
  const { user } = props;
  const [rows, setRows] = React.useState([]);
  // Management Filter
  const [fieldsFilter, setFieldsFilter] = React.useState([]);
  //For the modal create invoice
  const [open, setOpen] = React.useState(false);
  const [invoiceToModified, setInvoiceToModified] = React.useState(null);

  const getInvoices = React.useCallback((filter = null) => {
    if (user) {
      let path = '/invoice/all';
      let method = 'get';
      if (filter) {
        path = 'invoice/filter'
        method = 'post'
      }
      api(method, path, [], {userId: user.id}, filter).then(invoices => {
        invoices.data.forEach(invoice => {
          invoice.totalAmount = invoice.amount.toFixed(2);
          invoice.dueAmount = (invoice.amount * invoice.weight).toFixed(2);
        });
        setRows(invoices.data);
      }).catch(err => {
        console.error(err);
      });
    }
  }, [user]);

  React.useEffect(() => {
    getInvoices();
    setFieldsFilter(FieldsFilterInvoice);
  }, [getInvoices]);

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
    getInvoices(newFieldsFilter);
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
    getInvoices();
  }
  
  // For the Modal Create invoice
  const handleEditInvoice = (e, row) => {
    if (row && row.id) {
      api('get', `/invoice/${row.id}`).then(response => {
        response.data.userInvoices.forEach(userInvoice => {
          userInvoice.isPayer =  userInvoice.isPayer ? 1 : 0;
        })
        if (!response.data.invoice.companyId) {
          response.data.invoice.companyId = 0;
        }
        if (response.data.invoice.dueDate) {
          response.data.invoice.dueDate = dayjs(response.data.invoice.dueDate).format('YYYY-MM-DD')
        }
        setInvoiceToModified({...response.data.invoice, userInvoices: response.data.userInvoices});
        setOpen(true);
      });
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setInvoiceToModified(null);
    getInvoices();
  };

  const handleValidateInvoice = (e, row) => {
    e.preventDefault();
    api('patch', '/invoice/' + row.id + '/' + user.id, null, null, {amount: row.dueAmount}).then(result => {
      getInvoices();
    }).catch(err => {
      console.error(err);
    })
  }

  const handleInvalidateInvoice = (e, row) => {
    e.preventDefault();
    api('patch', '/invoice/' + row.id + '/' + user.id, null, null, {amount: row.dueAmount, invalidate: true}).then(result => {
      getInvoices();
    }).catch(err => {
      console.error(err);
    })
  }

  const handleDeleteInvoice = (e, row) => {
    e.preventDefault();
    api('delete', '/invoice/' + row.id).then(() => {
      getInvoices();
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
        <Button onClick={handleEditInvoice}>
          Add invoice
        </Button>
      </Grid>
      <Modal 
        title="Invoice"
        open={open} 
        fieldsFrom={FieldsFormInvoice}
        elementToModified={invoiceToModified}
        userId={user ? user.id : 0} 
        validateForm={ValidateFormInvoice}
        handleClose={handleClose} 
      />
      <TableCustom
        title="Invoices" 
        rows={rows}
        columns={FieldsTableInvoice}
        FieldToValidate="paymentDateUser"
        fieldsFilter={fieldsFilter}
        handleSetFieldsFilter={handleSetFieldsFilter}
        handleResetFieldsFilter={handleResetFieldsFilter}
        handleInvalidate={handleInvalidateInvoice}
        handleValidate={handleValidateInvoice}
        handleEdit={handleEditInvoice}
        handleDelete={handleDeleteInvoice}
      />
    </Box>
  );
}
