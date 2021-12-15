import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import DoneIcon from '@mui/icons-material/Done';
import dayjs from 'dayjs';

export default function Cell(props) {
    const { columnType, data } = props;
    const [value, setValue] = React.useState(null)

    React.useEffect(() => {
        switch (columnType) {
            case 'date':
                data ? setValue(dayjs(data).format('DD-MM-YYYY')) : setValue(null);
                break;
            case 'boolean':
                data ? setValue(<DoneIcon />) : setValue(null);
                break;
            case 'number':
            case 'string':
            default:
                setValue(data);
                break;
        };
    }, [columnType, data]);

    return (
        <TableCell align="center">
            {value}
        </TableCell>
    );
}