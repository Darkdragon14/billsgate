import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

export default function CellAction(props) {
  const {
    isValidate,
    row,
    handleValidate,
    handleInvalidate,
    handleEdit,
    handleDelete
  } = props;

  return(
    <TableCell align="center">
        { isValidate && handleInvalidate ? (
            <IconButton onClick={(e) => handleInvalidate(e, row)} aria-label="remove done" color="error">
                <CloseIcon />
            </IconButton>
        ):(
          null
        )}
        { !isValidate && handleValidate ? (
            <IconButton onClick={(e) => handleValidate(e, row)} aria-label="done" color="success">
                <DoneIcon />
            </IconButton>
        ):(
          null
        )}
        { handleEdit ? (
            <IconButton onClick={(e) => handleEdit(e, row)} aria-label="edit" color="info">
                <EditIcon />
            </IconButton>
        ):(
            null
        )}
        { handleDelete && !isValidate ? (
            <IconButton onClick={(e) => handleDelete(e, row)} aria-label="delete" color="error">
                <DeleteIcon />
            </IconButton>
        ):(
            null
        )}
    </TableCell>
  );
}