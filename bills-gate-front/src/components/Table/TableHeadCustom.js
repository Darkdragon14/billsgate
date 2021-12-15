import * as React from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

export default function TableHeadCustom(props) {
    const { headCells } = props;
  
    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align='center'
              padding='normal'
            >
              {headCell.label}
            </TableCell>
          ))}
          <TableCell align='center' padding='normal'>Actions</TableCell>
        </TableRow>
      </TableHead>
    );
  }