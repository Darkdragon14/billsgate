import * as React from 'react';
import { Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Collapse from '@mui/material/Collapse';
import MuiAlert from '@mui/material/Alert';
import api from '../utils/api';
import qs from 'qs';

export default function SignIn(props) {
  const [values, setValues] = React.useState({
    password: '',
    username: '',
    showPassword: false,
  });
  const [error, setError] = React.useState(null);

  const { user, setUser } = props;


  const center = {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  };

  const inputStyle = { 
    m: 1, 
    width: '100%'
  }

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChangeUsername = (event) => {
    setValues({
      ...values,
      username: event.target.value,
    });
  };

  const handleChangePassword = (event) => {
    setValues({
      ...values,
      password: event.target.value,
    });
  }

  const submit = (event) => {
    const path = '/auth/login';
    const method = 'post';
    const body = values;
    delete body.showPassword;
    const headers = { 
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    api(method, path, [], null, qs.stringify(body), headers).then(response => {
      setError('');
      setUser({
        username: values.username,
        id: response.data.id
      });
    }).catch(err => {
      setError(err.response.data);
    });
  }

  if (user) {
    return <Navigate to="/invoices" />;
  }

  return (
    <Box
      component="form"
      sx={{ ...center, 
        '& .MuiTextField-root': { m: 1 }
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <div
          style={center}
        >
          Welcome to Bills Gate !
        </div>
        <TextField
          sx={inputStyle}
          required
          label="Username"
          id="outlined-required"
          value={values.username}
          onChange={handleChangeUsername}
        />
        <br/>
        <FormControl sx={inputStyle} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            required
            id="outlined-password-input"
            label="Password"
            value={values.password}
            onChange={handleChangePassword}
            type={values.showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <br/>
        <Collapse in={error ? true : false}>
          <MuiAlert elevation={6} variant="filled" style={{...center, margin: '8px', width: '100%'}} severity="error">{error}</MuiAlert>
        </Collapse>
        <div
          style={{...center, margin: '8px'}}
        >
          <Button disabled={!values.username && !values.password} onClick={submit} variant="contained">
            Login
          </Button>
        </div>
      </div>
    </Box>
  );
}