
import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import Input from '@mui/material/Input';

export default function CellEdit(props) {
  const { row, index, cellName, onChange, onToggleEditMode } = props;

  return (
    <TableCell align="center" onDoubleClick={() => onToggleEditMode(index, row, cellName)}>
      {row.cellEditMode === cellName ? (
        <Input
          value={row[cellName]}
          name={cellName}
          onChange={e => onChange(e, index, row)}
          onBlur={() => onToggleEditMode(index, row, '')}
          type='date'
        />
      ) : (
        row[cellName]
      )}
    </TableCell>
  )
}