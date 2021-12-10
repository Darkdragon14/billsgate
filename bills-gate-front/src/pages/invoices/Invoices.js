import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import Button from '@mui/material/Button';
import CreateInvoice from './CreateInvoice';
import TableTitle from '../../components/TableTitle';
import MyTableHead from '../../components/MyTableHead';
import api from '../../utils/api';
import { getComparator, stableSort } from '../../utils/table';
import FieldsTableInvoice from './config/FieldsTableInvoice';

const userId = 2;

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

export default function Invoices() {
  const [rows, setRows] = React.useState([]);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  //For the modal create invoice
  const [open, setOpen] = React.useState(false);
  const [invoiceToModified, setInvoiceToModified] = React.useState(null);
  const [userInvoicesToModified, setUserInvoicesToModified] = React.useState(null)

  React.useEffect(() => {
    api('get', '/invoice/all', [], {userId}).then(invoices => {
      const newRows = invoices.data.map((invoice) => {
        const dueAmount = invoice.amount * invoice.userInvoices[0].weight;
        const dueDate = invoice.dueDate.substring(0, 10);
        let paymentDateUser = invoice.userInvoices[0].paymentDate;
        if (paymentDateUser) {
          paymentDateUser = paymentDateUser.substring(0, 10);
        }
        const paymentDate = invoice.paymentDate ? invoice.paymentDate.substring(0, 10) : null;
        const isPayer = invoice.userInvoices[0].isPayer;
        return createData(invoice.id, invoice.name, invoice.amount.toFixed(2), dueAmount.toFixed(2), dueDate, paymentDateUser, paymentDate, isPayer);
      });
      setRows(newRows);
    }).catch(err => {
      console.error(err);
    });
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  
  // For the Modal Create invoice
  const handleClickOpen = (e, invoiceId) => {
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
  };

  const handleValidateInvoice = (e, rowId) => {
    e.preventDefault();
    api('patch', '/invoice/' + rowId + '/' + userId).then(result => {
      console.log(result);
    }).catch(err => {
      console.error(err);
    })
  }

  const handleDeleteInvoice = (e, rowId) => {
    e.preventDefault();
    api('delete', '/invoice/' + rowId).then(result => {
      console.log(result);
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
        <Button onClick={handleClickOpen}>
          Add invoice
        </Button>
      </Grid>
      <CreateInvoice open={open} invoiceToModified={invoiceToModified} userInvoicesToModified={userInvoicesToModified} handleClose={handleClose} />
      <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '15px' }}>
        <TableContainer>
          <TableTitle />
          <Table
            sx={{ minWidth: 500 }}
            stickyHeader 
            aria-label="sticky table"
            size='medium'
          >
            <MyTableHead
              order={order}
              orderBy={orderBy}
              headCells={FieldsTableInvoice}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.id}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="normal"
                        align="center"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="center">{row.totalAmount}</TableCell>
                      <TableCell align="center">{row.dueAmount}</TableCell>
                      <TableCell align="center">{row.dueDate}</TableCell>
                      <TableCell align="center">{row.paymentDateUser}</TableCell>
                      <TableCell align="center">{row.paymentDate}</TableCell>
                      <TableCell align="center">
                        { row.isPayer ? (
                          <DoneIcon />
                        ):(
                          null
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton onClick={(e) => handleValidateInvoice(e, row.id)} aria-label="done" color="success">
                          <DoneIcon />
                        </IconButton>
                        <IconButton onClick={(e) => handleClickOpen(e, row.id)} aria-label="edit" color="info">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={(e) => handleDeleteInvoice(e, row.id)} aria-label="delete" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  sx={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ display: rows.length > 5 ? "block" : "none" }}
        />
      </Paper>
    </Box>
  );
}
