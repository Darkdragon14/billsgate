import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import useTheme from "@mui/material/styles/useTheme";
import TableTitle from './TableTitle';
import TableHeadCustom from './TableHeadCustom';
import Cell from './Cell';
import CellAction from './CellAction';
import { checkField } from '../../utils/checkField';

export default function TableCustom(props) {
    const {
        title,
        rows, 
        columns,
        FieldToValidate,
        FieldToWarning,
        FieldToError,
        fieldsFilter,
        handleSetFieldsFilter,
        handleResetFieldsFilter,
        handleInvalidate, 
        handleValidate, 
        handleEdit, 
        handleDelete 
    } = props;
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [theme] = React.useState(useTheme());

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

    return (
        <Paper key={title} sx={{ width: '100%', overflow: 'hidden', marginTop: '15px' }}>
            <TableContainer>
                <TableTitle 
                    title={title}
                    fieldsFilter={fieldsFilter}
                    handleSetFieldsFilter={handleSetFieldsFilter}
                    handleResetFieldsFilter={handleResetFieldsFilter}
                />
                <Table
                    sx={{ minWidth: 500 }}
                    size='medium'
                >
                    <TableHeadCustom
                        headCells={columns}
                        needColumnAction={handleValidate || handleInvalidate || handleEdit || handleDelete ? true : false}
                    />
                    <TableBody>
                    {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                        let type = ''
                        if (row[FieldToValidate]) {
                            type = 'success'
                        } 
                        
                        if (row[FieldToError] && type === '') {
                            type = checkField(row[FieldToError], FieldToError, columns, 'error') ? 'error' : '';
                        } 
                        
                        if (row[FieldToWarning] && type === '') {
                            type = checkField(row[FieldToWarning], FieldToWarning, columns, 'warning') ? 'warning' : '';
                        }
                        
                        const color = type !== '' ? theme.palette[type][theme.palette.mode] : '';
                        
                        return (
                            <TableRow
                                hover
                                key={row.id}
                            >
                                {columns.map(column => (
                                    <Cell
                                        color={color}
                                        key={row.id + column.id}
                                        columnType={column.type}
                                        data={row[column.id]}
                                    />
                                ))}
                                { handleValidate || handleInvalidate || handleEdit || handleDelete ? (
                                    <CellAction
                                        isValidate={row[FieldToValidate]}
                                        row={row}
                                        handleValidate={handleValidate}
                                        handleInvalidate={handleInvalidate}
                                        handleEdit={handleEdit}
                                        handleDelete={handleDelete}
                                    />
                                ):(
                                    null
                                )}
                            </TableRow>
                        )
                        
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
    )
}