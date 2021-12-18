import * as React from 'react';
import Box from '@mui/material/Box';
import TableCustom from '../../components/Table/TableCustom';
import api from '../../utils/api';
import FieldsTableTrade from './config/FieldsTableTrade';

export default function Trades(props) {
  const { user } = props;
  const [rows, setRows] = React.useState([]);

  const getTrades = (filter = null) => {
    let path = '/trade/all';
    let method = 'get';
    api(method, path, [], {userId: user.id}, filter).then(trades => {
      setRows(trades.data);
    }).catch(err => {
      console.error(err);
    });
  };

  React.useEffect(() => {
    if (user) {
      getTrades();
    }
  }, [user]);
  
  return (
    <Box sx={{ width: '90%', m: 'auto' }}>
      <TableCustom
        title="Trades" 
        rows={rows}
        columns={FieldsTableTrade}
      />
    </Box>
  );
}
