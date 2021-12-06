import * as React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

export default function MyField(props) {
  const { field, value, index, handleChange } = props;

  const id = index === -1 ? field.id : field.id + index;

  return (
    <TextField
      id={id}
      key={id}
      value={value}
      select={field.type === 'select'}
      label={field.label}
      helperText={field.info}
      required={field.required}
      onChange={e => handleChange(e, field.id, index)}
      type={field.type !== 'select' ? field.type : ''}
    >
      {
        field.type === 'select' ? (
          field.selectField.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
          ))
        ) :
        (null)
      }
    </TextField>
  )
}