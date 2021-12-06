import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import FieldsFormInvoice from './FieldsFormInvoice';
import MyField from '../../components/MyField';

export default function FormInvoice(props) {
  const { handleClose } = props
  const today = dayjs().format('YYYY-MM-DD');
  const [newInvoice, setNewInvoice] = React.useState({
    name: '',
    totalAmount: 0,
    dueDate: today,
    companyId: 0,
    paiementDate: today
  })
  const [userInvoices, setUserInvoices] = React.useState([
      {
        userId: 0,
        weight: 1,
        isPayer: 1
      }
  ])
  const [fields] = React.useState(FieldsFormInvoice);

  const addNewUserInvoice = () => {
    const weight = 1 / (userInvoices.length + 1);
    const newUserInvoices = userInvoices.map(userInvoice => {
      userInvoice.weight = weight;
      return userInvoice;
    })
    newUserInvoices.push({
      userId: 0,
      weight: weight,
      isPayer: 0
    });
    setUserInvoices(newUserInvoices);
  }

  const removeUserInvoice = () => {
    const weight = 1 / (userInvoices.length - 1);
    const newUserInvoices = [];
    userInvoices.forEach(userInvoice => {
      userInvoice.weight = weight;
      newUserInvoices.push(userInvoice);
    })
    newUserInvoices.pop()
    setUserInvoices(newUserInvoices);
  }

  const handleInvoiceChange = (e, fieldId) => {
    setNewInvoice({...newInvoice, [fieldId]: e.target.value});
  }

  const handleUserInvoiceChange = (e, fieldId, id) => {
    const newUserInvoices = userInvoices.map((userInvoice, index) => {
      if(index === id){
        userInvoice[fieldId] = e.target.value;
      }
      return userInvoice;
    });
    setUserInvoices(newUserInvoices);
  }

  const handleSubmit = (e) => {
    e.preventDefault(); 
    console.log('submit');
    handleClose();
  }

  return (
    <Box
      component="form"
      id='createInvoice'
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
      onSubmit={(e) => handleSubmit(e)}
    >
      {fields.map((section, index) => (
        <span key={index}>
          <h4 id={section.id}>{section.label}</h4>
          {section.id !== 'userInvoice' ? (
            <span key={section.id}>
              {section.fields.map(field => {
                const value = newInvoice[field.id];
                return (
                  <MyField key={field.id} field={field} value={value} index={-1} handleChange={handleInvoiceChange} />
                )
              })}
            </span>
          ) : (
            <span key={section.id}>
              {userInvoices.map((userInvoice, index) => (
                <div key={'user' + index}>
                  {section.fields.map(field => {
                    const value = userInvoice[field.id];
                    return (
                      <MyField key={field.id} field={field} value={value} index={index} handleChange={handleUserInvoiceChange} />
                    )
                  })}
                </div>
              ))}
              <Grid 
                direction="row"
                justifyContent="center"
                sx={{marginTop: "8px"}} 
                container 
                spacing={2}
              >
                  <Button sx={{marginRight: "8px"}} variant="contained" onClick={addNewUserInvoice}>
                    Add an User
                  </Button>
                  {userInvoices.length > 1 ? (
                    <Button sx={{marginLeft: "8px"}} variant="contained" color="error" onClick={removeUserInvoice}>
                      Remove an User
                    </Button>
                  ) : (
                    null
                  )}
              </Grid>
            </span>
          )}
        </span>
      ))}
    </Box>
  );
}
