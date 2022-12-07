import * as React from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import HomeIcon from '@mui/icons-material/Home';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';

function ListItemLink(props) {
  const { icon, primary, to, disabled } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef(function Link(itemProps, ref) {
        return <RouterLink to={to} ref={ref} {...itemProps} role={undefined} />;
      }),
    [to],
  );

  const selected = to === useLocation().pathname;
  
  return (
    <li>
      <ListItemButton disabled={disabled} selected={selected}	component={renderLink}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItemButton>
    </li>
  );
}

ListItemLink.propTypes = {
  icon: PropTypes.element,
  primary: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export default function NavBar(props) {
  const { user } = props;
  return (
    <List sx={{ height: '100%'}}>
      <ListItemLink disabled={!user} to="/home" primary="Home" icon={<HomeIcon />} />
      <ListItemLink disabled={!user} to="/banks" primary="Banks" icon={<AccountBalanceIcon />} />
      <ListItemLink disabled={!user} to="/invoices" primary="Invoices" icon={<FileCopyIcon />} />
      <ListItemLink disabled={!user} to="/recurringbills" primary="recurringbills" icon={<CurrencyExchangeIcon />} />
      <ListItemLink disabled={!user} to="/trades" primary="Trades" icon={<PeopleAltIcon />} />
      <ListItemLink disabled={!user} to="/companies" primary="Companies" icon={<BusinessIcon />} />
      <ListItem sx={{ position: 'absolute', bottom: '0', justifyContent: 'center', fontSize: '10px' }}>v {process.env.REACT_APP_VERSION}</ListItem>
    </List>
  );
}
