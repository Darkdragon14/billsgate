import * as React from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { createTheme } from '@mui/material/styles';
import { deleteCookie } from '../utils/cookieManager';
import api from '../utils/api';

export default function MyAvatar(props) {
  const { user, setUser, theme, setTheme } = props;
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    if (user) {
      setAnchorElUser(event.currentTarget);
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleChangeThemeMode = () => {
    const newTheme = createTheme({
      palette: {
        mode: theme.palette.mode === 'dark' ? 'light' : 'dark',
      },
    });
    localStorage.setItem('themeMode', theme.palette.mode === 'dark' ? 'light' : 'dark');
    setTheme(newTheme);
  }

  const logout = () => {
    deleteCookie('user');
    api('post', '/auth/logout').then(() => {
      setUser(null);
      handleCloseUserMenu();
    }).catch(err => {
      console.error(err);
    });;
  }

  return (
    <Box sx={{ marginLeft: "auto", flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt={user ? user.username : ""} src="/static/images/avatar/2.jpg" />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem>
          <Typography textAlign="center">{user ? user.username : ""}</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={logout}>
          <LogoutIcon />
          <Typography textAlign="center">Logout</Typography>
        </MenuItem>
        <MenuItem>
          Mode : 
          <Checkbox 
            label="Light or dark" 
            icon={<LightModeIcon />}
            checkedIcon={<DarkModeIcon />}
            onClick={handleChangeThemeMode}
            checked={theme.palette.mode === 'dark'}
          />
        </MenuItem>
      </Menu>
    </Box>
  )
}