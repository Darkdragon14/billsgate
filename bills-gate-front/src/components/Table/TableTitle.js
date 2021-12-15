import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FilterListIcon from '@mui/icons-material/FilterList';

export default function TableTitle(props) {
    const { title, fieldsFilter, handleSetFieldsFilter, handleResetFieldsFilter } = props;
    const [anchorElFilter, setAnchorElFilter] = React.useState(null);

    const handleOpenFilterMenu = (e) => {
        setAnchorElFilter(e.currentTarget);
    };

    const handleCloseFilterMenu = () => {
        setAnchorElFilter(null);
    };

    return (
        <Toolbar
        sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 }
        }}
        >
            <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                id="tableTitle"
                component="div"
            >
                {title}
            </Typography>
            <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Filter list">
                    <IconButton onClick={handleOpenFilterMenu}>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
                <Menu
                    open={Boolean(anchorElFilter)}
                    onClose={handleCloseFilterMenu}
                    anchorEl={anchorElFilter}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem>
                        <Typography textAlign="center">Filter</Typography>
                    </MenuItem>
                    <Divider />
                    {fieldsFilter.map(fieldFilter => (
                        <MenuItem key={fieldFilter.id}>
                            {fieldFilter.label} : 
                            {fieldFilter.type === 'checkbox' ? (
                                <Checkbox checked={fieldFilter.value} onChange={(e) => handleSetFieldsFilter(fieldFilter.id, e.target.checked)} />
                            ) : (
                                <TextField value={fieldFilter.value} variant="standard" type={fieldFilter.type} onChange={(e) => handleSetFieldsFilter(fieldFilter.id, e.target.value)}/> 
                            )}
                        </MenuItem>
                    ))}
                    <MenuItem>
                        <Button sx={{ margin: 'auto'}} onClick={handleResetFieldsFilter}>Reset Filter</Button>
                    </MenuItem>
                </Menu>
            </Box>    
        </Toolbar>
    );
}