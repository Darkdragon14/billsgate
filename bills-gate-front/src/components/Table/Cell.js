import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import DoneIcon from '@mui/icons-material/Done';
import Link from '@mui/material/Link';
import dayjs from 'dayjs';

export default function Cell(props) {
    const { columnType, data, color } = props;
    const [value, setValue] = React.useState(null)

    React.useEffect(() => {
        switch (columnType) {
            case 'date':
                data ? setValue(dayjs(data).format('DD-MM-YYYY')) : setValue(null);
                break;
            case 'dateAndTime':
                data ? setValue(dayjs(data).format('DD-MM-YYYY HH:mm')) : setValue(null);
                break;
            case 'boolean':
                data ? setValue(<DoneIcon />) : setValue(null);
                break;
            case 'phone':
                data ? setValue(<Link href={'tel:' + data}>{data}</Link>) : setValue(null);
                break;
            case 'email':
                data ? setValue(<Link href={'mailto:' + data}>{data}</Link>) : setValue(null);
                break;
            case 'number':
                setValue(data.toFixed(2).replace(/[.,]00$/, ""));
                break;
            case 'string':
            default:
                setValue(data);
                break;
        };
    }, [columnType, data]);

    return (
        <TableCell 
            sx={{
                color
            }}
            align="center"
        >
            {value}
        </TableCell>
    );
}