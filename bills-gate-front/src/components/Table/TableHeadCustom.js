import * as React from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

export default function TableHeadCustom(props) {
    const { headCells, needColumnAction } = props;
  
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
          { needColumnAction ? (
            <TableCell align='center' padding='normal'>Actions</TableCell>
          ):(
            null
          )}
        </TableRow>
      </TableHead>
    );
  }