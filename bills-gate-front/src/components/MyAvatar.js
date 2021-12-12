import * as React from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { createTheme } from '@mui/material/styles';
import ChangeUser from './ChangeUser';

export default function MyAvatar(props) {
  const { user, users, theme, setUser, setTheme } = props;
  const [openChangeUse, setOpenChangeUser] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenChangeUser = () => {
    setOpenChangeUser(true);
  };

  const handleCloseChangeUser = () => {
    setAnchorElUser(null);
    setOpenChangeUser(false);
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
        <MenuItem>
          <Typography onClick={handleOpenChangeUser} textAlign="center">User's switch</Typography>
          <ChangeUser 
            open={openChangeUse}
            onClose={handleCloseChangeUser}
            users={users}
            setUser={setUser}
          />
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