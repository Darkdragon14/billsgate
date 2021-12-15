import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import ModalInvoice from './ModalInvoice';
import TableCustom from '../../components/Table/TableCustom'
import api from '../../utils/api';
import FieldsTableInvoice from './config/FieldsTableInvoice';
import FieldsFilterInvoice from './config/FieldsFilterInvoice';

function createData(id, name, totalAmount, dueAmount, dueDate, paymentDateUser, paymentDate, isPayer) {
  return {
    id,
    name,
    totalAmount,
    dueAmount,
    dueDate,
    paymentDateUser,
    paymentDate,
    isPayer,
    cellEditMode: ''
  };
}

export default function Invoices(props) {
  const { user } = props;
  const [rows, setRows] = React.useState([]);
  // Management Filter
  const [fieldsFilter, setFieldsFilter] = React.useState([]);
  //For the modal create invoice
  const [open, setOpen] = React.useState(false);
  const [invoiceToModified, setInvoiceToModified] = React.useState(null);
  const [userInvoicesToModified, setUserInvoicesToModified] = React.useState(null)

  const getInvoices = (filter = null) => {
    let path = '/invoice/all';
    let method = 'get';
    if (filter) {
      path = 'invoice/filter'
      method = 'post'
    }
    api(method, path, [], {userId: user.id}, filter).then(invoices => {
      const newRows = invoices.data.map((invoice) => {
        const dueAmount = invoice.amount * invoice.weight;
        const dueDate = invoice.dueDate.substring(0, 10);
        let paymentDateUser = invoice.paymentDate;
        if (paymentDateUser) {
          paymentDateUser = paymentDateUser.substring(0, 10);
        }
        const paymentDate = invoice.paymentDate ? invoice.paymentDate.substring(0, 10) : null;
        return createData(invoice.id, invoice.name, invoice.amount.toFixed(2), dueAmount.toFixed(2), dueDate, paymentDateUser, paymentDate, invoice.isPayer);
      });
      setRows(newRows);
    }).catch(err => {
      console.error(err);
    });
  };

  React.useEffect(() => {
    if (user) {
      getInvoices();
    }
    setFieldsFilter(FieldsFilterInvoice);
  }, [user]);

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
  const handleEditInvoice = (e, invoiceId) => {
    if (invoiceId) {
      api('get', `/invoice/${invoiceId}`).then(response => {
        setInvoiceToModified(response.data.invoice);
        setUserInvoicesToModified(response.data.userInvoices);
        setOpen(true);
      });
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setInvoiceToModified(null);
    setUserInvoicesToModified(null);
    getInvoices();
  };

  const handleValidateInvoice = (e, rowId) => {
    e.preventDefault();
    api('patch', '/invoice/' + rowId + '/' + user.id).then(result => {
      getInvoices();
    }).catch(err => {
      console.error(err);
    })
  }

  const handleInvalidateInvoice = (e, rowId) => {
    e.preventDefault();
    api('patch', '/invoice/' + rowId + '/' + user.id, null, null, {invalidate: true}).then(result => {
      getInvoices();
    }).catch(err => {
      console.error(err);
    })
  }

  const handleDeleteInvoice = (e, rowId) => {
    e.preventDefault();
    api('delete', '/invoice/' + rowId).then(result => {
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
      <ModalInvoice open={open} invoiceToModified={invoiceToModified} userInvoicesToModified={userInvoicesToModified} userId={user ? user.id : 0} handleClose={handleClose} />
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
