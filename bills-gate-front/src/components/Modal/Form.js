import * as React from 'react';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MuiAlert from '@mui/material/Alert';
import dayjs from 'dayjs';
import AddRemoveSubElement from './AddRemoveSubElement';
import MyField from './MyField';
import api from '../../utils/api';

export default function Form(props) {
  const { title, elementToModified, fieldsFrom, userId, handleClose, validateForm } = props
  const today = dayjs().format('YYYY-MM-DD');
  const [element, setElement] = React.useState({})
  const [fields, setFields] = React.useState([]);
  const [errorFields, setErrorFields] = React.useState(null);
  const [warnFields, setWarnFields] = React.useState([]);

  React.useEffect(() => {
    const setterSelect = [];
    const selectFields = [];
    const fieldsId = [];
    const categoriesId = [];
    fieldsFrom.forEach((category, categoryId) => {
      category.fields.forEach((field, fieldId) => {
        if(field.pathRequest && field.type === 'select' && fieldsFrom[categoryId].fields[fieldId].selectField.length === 1){
          selectFields.push(field);
          categoriesId.push(categoryId);
          fieldsId.push(fieldId);
          setterSelect.push(api('get', field.pathRequest));      
        }
      });
    });
    if (setterSelect.length > 0) {
      Promise.allSettled(setterSelect).then(results => {
        const warnings = [];
        results.forEach((request, id) => {
          if (request.status === 'fulfilled') {
            const listItem = fieldsFrom[categoriesId[id]].fields[fieldsId[id]].selectField;
            request.value.data.forEach(result => {
              if (selectFields[id].id === 'userId' && result.id === userId) {
                result.username = 'Me';
              }
              listItem.push({
                value: result.id,
                label: result.username ? result.username : result.name
              });
            });
            fieldsFrom[categoriesId[id]].fields[fieldsId[id]].selectField = listItem;
          } else if (selectFields[id].required) {
            // @Todo a better alert 
            handleClose();
          } else {
            warnings[categoriesId[id]] = selectFields[id].warningMessage;
          }
        });
        setFields(fieldsFrom);
        setWarnFields(warnings);
      })
    } else {
      setFields(fieldsFrom);
    }
    if (elementToModified) {
      delete elementToModified.createdAt;
      delete elementToModified.updatedAt;
      setElement(elementToModified);
    } else if (Object.keys(element).length === 0) {
      const initElement = element;
      fieldsFrom.forEach(section => {
        if (section.isMultiple) {
          initElement[section.id] = [{}];
          section.fields.forEach(field => {
            if (typeof field.defaultValue !== 'undefined') {
              initElement[section.id][0][field.id] = field.defaultValue;
            }
          })
        } else {
          section.fields.forEach(field => {
            if (typeof field.defaultValue !== 'undefined') {
              initElement[field.id] = field.defaultValue;
            }
          })
        }
      })
      setElement(initElement);
    }
  }, [today, userId, elementToModified, fieldsFrom, handleClose, element]);

  const handleChange = (e, fieldId, index, sectionId) => {
    e.preventDefault();
    console.log(e.target.value)
    if(sectionId){
      const newSubElement = element;
      newSubElement[sectionId][index][fieldId] = e.target.value;
      setElement({...newSubElement});
    } else {
      const newElement = element;
      newElement[fieldId] = e.target.value;
      setElement({...newElement});
    }
  }

  const addSubElement = sectionId => {
    fieldsFrom.forEach(section => {
      if (section.id === sectionId) {
        element[section.id].push({});
        section.fields.forEach(field => {
          if (typeof field.defaultValue !== 'undefined') {
            element[section.id][element[section.id].length - 1][field.id] = field.defaultValue;
          }
        });
      }
    });
    setElement({...element});
  }

  const removeSubElement = sectionId => {
    element[sectionId].pop()
    setElement({...element});
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const testValide = validateForm(element);
    if (testValide.error) {
      setErrorFields(testValide);
    } else {
      const method = elementToModified ? 'put' : 'post';
      const path = `/${title.toLowerCase()}/${elementToModified ? element.id : ''}`;
      const body = { ...element, userId: userId};
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
      {fields.map((section, id) => (
        <Accordion key={section.id} defaultExpanded={section.id !== 'more'}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id={section.id}
            >
                <Typography>{section.label}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {section.isMultiple ? (
                  <span>
                    {element[section.id].map((subElement, index) => (
                      <div key={index}>
                        {section.fields.map(field => (
                          <MyField 
                            id={field.id + index}
                            key={field.id + index}
                            field={field} 
                            value={subElement[field.id]} 
                            error={errorFields && errorFields[section.id][index] && errorFields[section.id][index][field.id]} 
                            handleChange={(e, fieldId) => handleChange(e, fieldId, index, section.id)} 
                          />
                        
                        ))}
                      </div>
                    ))}
                    <AddRemoveSubElement
                      label={section.label.substring(0, section.label.length-1)}
                      displayRemove={section.isMultiple && element[section.id].length > 1}
                      addSubElement={() => addSubElement(section.id)}
                      removeSubElement={() => removeSubElement(section.id)}
                    />
                  </span>
                ):(
                  section.fields.map(field => (
                    <MyField 
                        key={field.id} 
                        id={field.id}
                        field={field}
                        value={element[field.id]}
                        error={errorFields && errorFields[title.toLowerCase()][field.id]} 
                        handleChange={handleChange} 
                    />
                  ))
                )}
                { warnFields[id] ? (
                    <MuiAlert sx={{marginTop: "10px"}} elevation={6} severity="warning">
                      {warnFields[id]}
                    </MuiAlert>
                ) : (
                    null
                )}
            </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}