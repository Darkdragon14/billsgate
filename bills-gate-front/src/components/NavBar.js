import * as React from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DraftsIcon from '@mui/icons-material/Drafts';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Link as RouterLink, useLocation } from 'react-router-dom';

function ListItemLink(props) {
  const { icon, primary, to } = props;

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
      <ListItemButton selected={selected}	component={renderLink}>
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

export default function NavBar() {
  return (
    <List>
      <ListItemLink to="/invoices" primary="Invoices" icon={<FileCopyIcon />} />
      <ListItemLink to="/drafts" primary="Drafts" icon={<DraftsIcon />} />
      <ListItemLink to="/trash" primary="Trash" icon={<DeleteIcon />} />
      <ListItemLink to="/spam" primary="Spam" icon={<RemoveCircleIcon />} />
    </List>
  );
}
