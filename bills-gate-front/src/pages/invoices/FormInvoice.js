import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import FieldsFormInvoice from './config/FieldsFormInvoice';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MuiAlert from '@mui/material/Alert';
import MyField from '../../components/MyField';
import api from '../../utils/api';
import ValidateFormInvoice from './config/ValidateFormInvoice';

export default function FormInvoice(props) {
  const { invoiceToModified, userInvoicesToModified, handleClose } = props
  const today = dayjs().format('YYYY-MM-DD');
  const [invoice, setInvoice] = React.useState({
    name: '',
    amount: 0,
    dueDate: today,
    companyId: 0,
    paymentDate: today
  })
  const [userInvoices, setUserInvoices] = React.useState([
      {
        userId: 0,
        weight: 1,
        isPayer: 1
      }
  ])
  const [fields] = React.useState(FieldsFormInvoice);
  const [errorFields, setErrorFields] = React.useState(null);

  React.useEffect(() => {
    if (invoiceToModified) {
      userInvoicesToModified.forEach(userInvoice => {
        delete userInvoice.createdAt;
        delete userInvoice.updatedAt;
        userInvoice.isPayer = userInvoice.isPayer ? 1 : 0;
      })
      setUserInvoices(userInvoicesToModified);
      delete invoiceToModified.createdAt;
      delete invoiceToModified.updatedAt;
      invoiceToModified.paymentDate = invoiceToModified.paymentDate ? invoiceToModified.paymentDate : today;
      invoiceToModified.companyId = invoiceToModified.companyId ? invoiceToModified.companyId : 0;
      invoiceToModified.dueDate = invoiceToModified.dueDate.substring(0, 10);
      setInvoice(invoiceToModified);
    }
  }, []);

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
    setInvoice({...invoice, [fieldId]: e.target.value});
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
    const testValideInvoice = ValidateFormInvoice(invoice, userInvoices);
    if (testValideInvoice.error) {
      setErrorFields(testValideInvoice);
    } else {
      const method = invoiceToModified ? 'put' : 'post';
      const path = invoiceToModified ? '/invoice/' + invoice.id : '/invoice';
      if (!invoice.companyId) {
        delete invoice.companyId;
      }
      if (invoice.paymentDate === today) {
        delete invoice.paymentDate;
      }
      const body = {
        invoice: invoice,
        listLinkUserInvoice: userInvoices,
      }
      api(method, path, [], null, body).then(result => {
        console.log(result);
        handleClose();
      }).catch(err => {
        console.error(err);
      })
    }
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
        <Accordion key={section.id} defaultExpanded={section.id !== 'more'}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id={section.id}
          >
            <Typography>{section.label}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {section.id !== 'userInvoice' ? (
              <span key={section.id}>
                {section.fields.map(field => {
                  const value = invoice[field.id];
                  return (
                    <MyField 
                      key={field.id} 
                      field={field} 
                      value={value} 
                      index={-1} 
                      error={section.id !== 'more' && errorFields && errorFields.invoice[field.id]} 
                      handleChange={handleInvoiceChange} 
                    />
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
                        <MyField 
                          key={field.id} 
                          field={field} 
                          value={value} 
                          index={index} 
                          error={errorFields && errorFields.userInvoices[index][field.id]} 
                          handleChange={handleUserInvoiceChange} 
                        />
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
                    <Button sx={{marginRight: "8px"}} onClick={addNewUserInvoice}>
                      Add an User
                    </Button>
                    {userInvoices.length > 1 ? (
                      <Button sx={{marginLeft: "8px"}} color="error" onClick={removeUserInvoice}>
                        Remove an User
                      </Button>
                    ) : (
                      null
                    )}
                </Grid>
                { errorFields && errorFields.totalWeight ? (
                  <MuiAlert elevation={6} severity="error">The total weight is different of 1</MuiAlert>
                ) : (
                  null
                )}
              </span>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
