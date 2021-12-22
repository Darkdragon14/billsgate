import * as React from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

export default function AddRemoveSubElement(props){
  const { label, displayRemove, addSubElement, removeSubElement } = props;

    return (
      <Grid 
        direction="row"
        justifyContent="center"
        sx={{marginTop: "8px"}} 
        container 
        spacing={2}
      >
          <Button sx={{marginRight: "8px"}} onClick={addSubElement}>
            Add a {label}
          </Button>
          {displayRemove ? (
            <Button sx={{marginLeft: "8px"}} color="error" onClick={removeSubElement}>
              Remove a {label}
            </Button>
          ) : (
            null
          )}
      </Grid>
    )
}