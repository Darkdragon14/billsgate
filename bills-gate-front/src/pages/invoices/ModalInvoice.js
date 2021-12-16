import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormInvoice from './FormInvoice';
import DialogTitle from '@mui/material/DialogTitle';

export default function ModalInvoice(props) {
  const { open, invoiceToModified, userInvoicesToModified, userId, handleClose } = props

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
    >
      <DialogTitle>
        {invoiceToModified ? 'Update an ' : 'Create a new '}
        Invoice
      </DialogTitle>
      <DialogContent>
        <FormInvoice invoiceToModified={invoiceToModified} userInvoicesToModified={userInvoicesToModified} userId={userId} handleClose={handleClose} />
      </DialogContent>
      <DialogActions>
        <Button type="submit" form="createInvoice" color="success">
          {invoiceToModified ? 'Update' : 'Create'}
        </Button>
        <Button onClick={handleClose} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}