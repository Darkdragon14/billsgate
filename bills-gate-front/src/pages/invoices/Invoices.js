import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import Button from '@mui/material/Button';
import { visuallyHidden } from '@mui/utils';
import CreateInvoice from './CreateInvoice';
import CellEdit from '../../components/CellEdit'
import api from '../../utils/api';

function createData(name, totalAmount, dueAmount, dueDate, paiementDateUser, paiementDate) {
  return {
    name,
    totalAmount,
    dueAmount,
    dueDate,
    paiementDateUser,
    paiementDate,
    cellEditMode: ''
  };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'name',
    label: 'Name',
  },
  {
    id: 'totalAmount',
    label: 'Total amount',
  },
  {
    id: 'dueAmount',
    label: 'Due amount',
  },
  {
    id: 'dueDate',
    label: 'Due Date',
  },
  {
    id: 'paiementDateUser',
    label: 'My paiement date',
  },
  {
    id: 'paiementDate',
    label: 'Paiement date',
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align='center'
            padding='normal'
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align='center' padding='normal'>Actions</TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const TableToolbar = () => {

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 }
      }}
    >
      <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Invoices
      </Typography>
    </Toolbar>
  );
};

export default function Invoices() {
  const [rows, setRows] = React.useState([]);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  //For the modal create invoice
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    api('get', '/invoice/all', [], {userId: 2}).then((invoices) => {
      console.log(invoices.data);
      const newRows = invoices.data.map((invoice) => {
        const dueAmount = invoice.amount * invoice.userInvoices[0].weight;
        const dueDate = invoice.dueDate.substring(0, 10);
        let paiementDate = invoice.userInvoices[0].paiementDate;
        if (paiementDate) {
          paiementDate = paiementDate.substring(0, 10);
        }
        return createData(invoice.name, invoice.amount.toFixed(2), dueAmount.toFixed(2), dueDate, paiementDate);
      });
      setRows(newRows);
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

  const onChange = (e, id, row) => {
    const value = e.target.value;
    const name = e.target.name;
    const newRows = rows.map((oldRow, index) => {
      if (index === id) {
        return { ...row, [name]: value };
      }
      return oldRow;
    });
    setRows(newRows);
  };

  const onToggleEditMode = (id, row, nameCell) => {
    row.cellEditMode = nameCell;
    const newRows = rows.map((oldRow, index) => {
      if (index === id) {
        return row;
      }
      return oldRow;
    });
    setRows(newRows);
  };
  
  // For the Modal Create invoice
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ width: '90%', m: 'auto' }}>
      <Grid
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
      >
        <Button variant="contained" onClick={handleClickOpen}>
          Add invoice
        </Button>
      </Grid>
      <CreateInvoice open={open} handleClose={handleClose} />
      <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '15px' }}>
        <TableContainer sx={{ minHeight: '325px', maxHeight: '325px' }}>
          <TableToolbar />
          <Table
            sx={{ minWidth: 500 }}
            stickyHeader 
            aria-label="sticky table"
            size='medium'
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
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
                      key={row.name}
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
                      <CellEdit row={row} index={index} cellName='paiementDateUser' onChange={onChange} onToggleEditMode={onToggleEditMode} />
                      <CellEdit row={row} index={index} cellName='paiementDate' onChange={onChange} onToggleEditMode={onToggleEditMode} />
                      <TableCell align="center">
                        <IconButton aria-label="done" color="success">
                          <DoneIcon />
                        </IconButton>
                        <IconButton aria-label="edit" color="info">
                          <EditIcon />
                        </IconButton>
                        <IconButton aria-label="delete" color="error">
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
