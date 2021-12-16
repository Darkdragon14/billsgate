import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TableCustom from '../../components/Table/TableCustom'
import Modal from '../../components/Modal/Modal';
import api from '../../utils/api';
import FieldsTableCompany from './config/FieldsTableCompany';
import FieldsFormCompany from './config/FieldsFormCompany';
import ValidateFormCompany from './config/ValidateFormCompany';
// import FieldsFilterBank from './config/FieldsFilterBank';

function createData(id, name, address, city, phone, email) {
  return {
    id,
    name,
    address,
    city,
    phone,
    email
  };
}

export default function Companies(props) {
  const { user } = props;
  const [rows, setRows] = React.useState([]);
  // Management Filter
  const [fieldsFilter, setFieldsFilter] = React.useState([]);
  //For the modal create invoice
  const [open, setOpen] = React.useState(false);
  const [companyToModified, setCompanyToModified] = React.useState(null);

  const getCompanies = (filter = null) => {
    let path = '/company/all';
    let method = 'get';
    if (filter) {
      path = 'bank/filter'
      method = 'post'
    }
    api(method, path, [], {userId: user.id}, filter).then(companies => {
      const newRows = companies.data.map(company => {
        return createData(company.id, company.name, company.address, company.city, company.phone, company.email);
      });
      setRows(newRows);
    }).catch(err => {
      console.error(err);
    });
  };

  React.useEffect(() => {
    if (user) {
      getCompanies();
    }
    // setFieldsFilter(FieldsFilterBanks);
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
    getCompanies(newFieldsFilter);
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
    getCompanies();
  }
  
  // For the Modal Create invoice
  const handleEditCompany = (e, row) => {
    if (row && row.id) {
      api('get', `/company/${row.id}`).then(response => {
        setCompanyToModified(response.data);
        setOpen(true);
      });
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCompanyToModified(null);
    getCompanies();
  };

  const handleDeleteCompany = (e, row) => {
    e.preventDefault();
    api('delete', '/company/' + row.id).then(() => {
      getCompanies();
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
        <Button onClick={handleEditCompany}>
          Add Company
        </Button>
      </Grid>
      <Modal 
        title="Company"
        open={open} 
        fieldsFrom={FieldsFormCompany}
        userId={user ? user.id : 0}
        elementToModified={companyToModified} 
        handleClose={handleClose}
        validateForm={ValidateFormCompany}
      />
      <TableCustom
        title="Companies" 
        rows={rows}
        columns={FieldsTableCompany}
        fieldsFilter={fieldsFilter}
        handleSetFieldsFilter={handleSetFieldsFilter}
        handleResetFieldsFilter={handleResetFieldsFilter}
        handleEdit={handleEditCompany}
        handleDelete={handleDeleteCompany}
      />
    </Box>
  );
}
