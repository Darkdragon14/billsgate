import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Form from './Form';
import DialogTitle from '@mui/material/DialogTitle';

export default function Modal(props) {
  const { title, open, fieldsFrom, elementToModified, userId, handleClose, validateForm } = props

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
    >
      <DialogTitle>
        {elementToModified ? 'Update a ' + title : 'Create a new ' + title}
      </DialogTitle>
      <DialogContent>
        <Form 
          title={title} 
          fieldsFrom={fieldsFrom} 
          elementToModified={elementToModified} 
          userId={userId} 
          handleClose={handleClose} 
          validateForm={validateForm} 
        />
      </DialogContent>
      <DialogActions>
        <Button type="submit" form="create" color="success">
          {elementToModified ? 'Update' : 'Create'}
        </Button>
        <Button onClick={handleClose} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}