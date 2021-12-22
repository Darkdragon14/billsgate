import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TableCustom from '../../components/Table/TableCustom'
import Modal from '../../components/Modal/Modal';
import api from '../../utils/api';
import FieldsTableBank from './config/FieldsTableBank';
import FieldsFormBank from './config/FieldsFormBank';
import ValidateFormBank from './config/ValidateFormBank';
// import FieldsFilterBank from './config/FieldsFilterBank';

function createData(id, name, iban, amount, updatedAt) {
  return {
    id,
    name,
    iban,
    amount,
    updatedAt
  };
}

export default function Banks(props) {
  const { user } = props;
  const [rows, setRows] = React.useState([]);
  // Management Filter
  const [fieldsFilter, setFieldsFilter] = React.useState([]);
  //For the modal create invoice
  const [open, setOpen] = React.useState(false);
  const [bankToModified, setBankToModified] = React.useState(null);

  const getBanks = React.useCallback((filter = null) => {
    if (user) {
      let path = '/bank/all';
      let method = 'get';
      if (filter) {
        path = 'bank/filter'
        method = 'post'
      }
      api(method, path, [], {userId: user.id}, filter).then(banks => {
        const newRows = banks.data.map(bank => {
          return createData(bank.id, bank.name, bank.iban, bank.amount.toFixed(2), bank.updatedAt);
        });
        setRows(newRows);
      }).catch(err => {
        console.error(err);
      });
    }
  }, [user]);

  React.useEffect(() => {
    getBanks();
    // setFieldsFilter(FieldsFilterBanks);
  }, [getBanks]);

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
    getBanks(newFieldsFilter);
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
    getBanks();
  }
  
  // For the Modal Create invoice
  const handleEditBank = (e, row) => {
    if (row && row.id) {
      api('get', `/bank/${row.id}`).then(response => {
        setBankToModified(response.data);
        setOpen(true);
      });
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setBankToModified(null);
    getBanks();
  };

  const handleDeleteBank = (e, row) => {
    e.preventDefault();
    api('delete', '/bank/' + row.id, null, null, {userId: user.id}).then(() => {
      getBanks();
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
        <Button onClick={handleEditBank}>
          Add Bank
        </Button>
      </Grid>
      <Modal 
        title="Bank"
        open={open} 
        fieldsFrom={FieldsFormBank}
        userId={user ? user.id : 0}
        elementToModified={bankToModified} 
        handleClose={handleClose}
        validateForm={ValidateFormBank}
      />
      <TableCustom
        title="Banks" 
        rows={rows}
        columns={FieldsTableBank}
        fieldsFilter={fieldsFilter}
        handleSetFieldsFilter={handleSetFieldsFilter}
        handleResetFieldsFilter={handleResetFieldsFilter}
        handleEdit={handleEditBank}
        handleDelete={handleDeleteBank}
      />
    </Box>
  );
}
