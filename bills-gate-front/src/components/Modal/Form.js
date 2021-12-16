import * as React from 'react';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MuiAlert from '@mui/material/Alert';
import MyField from '../MyField';
import api from '../../utils/api';

export default function Form(props) {
  const { title, elementToModified, fieldsFrom, userId, handleClose, validateForm } = props
  const today = dayjs().format('YYYY-MM-DD');
  const [element, setElement] = React.useState({})
  const [fields, setFields] = React.useState([]);
  const [errorFields, setErrorFields] = React.useState(null);
  const [errorCompany, setErrorCompany] = React.useState(false);

  React.useEffect(() => {
    let categoryFieldComapnyId = -1;
    let fieldCompanyId = -1;
    fieldsFrom.forEach((category, categoryId) => {
      category.fields.forEach((field, fieldId) => {
        if(field.id === 'companyId'){
          categoryFieldComapnyId = categoryId;
          fieldCompanyId = fieldId;
        }
      });
    });
    if (categoryFieldComapnyId > -1 && fieldCompanyId > -1 && fieldsFrom[categoryFieldComapnyId].fields[fieldCompanyId].selectField.length === 1) {
      api('get', '/company/all').then(result => {
        const listCompanies = fieldsFrom[categoryFieldComapnyId].fields[fieldCompanyId].selectField;
        result.data.forEach(company => {
          const addCompany = {
            value: company.id,
            label: company.name
          };
          listCompanies.push(addCompany);
        })
        fieldsFrom[categoryFieldComapnyId].fields[fieldCompanyId].selectField = listCompanies;
        setFields(fieldsFrom);
      }).catch(() => {
        setErrorCompany(true);
      });
    } else {
      setFields(fieldsFrom);
    }
    if (elementToModified) {
      delete elementToModified.createdAt;
      delete elementToModified.updatedAt;
      setElement(elementToModified);
    }
  }, [today, userId, elementToModified, fieldsFrom, handleClose]);

  const handleChange = (e, fieldId) => {
    setElement({...element, [fieldId]: e.target.value});
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(element);
    const testValide = validateForm(element);
    if (testValide.error) {
      setErrorFields(testValide);
    } else {
      const method = elementToModified ? 'put' : 'post';
      let path = '/' + title.toLowerCase();
      path = elementToModified ? path + '/' + element.id : path;
      const body = {...element, userId: userId};
      console.log(body);
      api(method, path, [], null, body).then(() => {
        handleClose();
      }).catch(err => {
        console.error(err);
      })
    }
  }

  return (
    <Box
      component="form"
      id='create'
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
      onSubmit={(e) => handleSubmit(e)}
    >
      {fields.map(section => (
        <Accordion key={section.id} defaultExpanded={section.id !== 'more'}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id={section.id}
            >
                <Typography>{section.label}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {section.fields.map(field => (
                  <MyField 
                      key={field.id} 
                      field={field} 
                      value={element[field.id] ? element[field.id] : ''} 
                      index={-1}
                      error={errorFields && errorFields[title.toLowerCase()][field.id]} 
                      handleChange={handleChange} 
                  />
                ))}
                { section.id === 'more' && errorCompany ? (
                    <MuiAlert sx={{marginTop: "10px"}} elevation={6} severity="warning">We can't show you the list of companies, you can try later to add.</MuiAlert>
                ) : (
                    null
                )}
            </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}