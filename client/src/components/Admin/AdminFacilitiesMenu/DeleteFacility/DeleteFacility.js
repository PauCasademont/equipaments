import { useState } from 'react';
import { Grid, TextField, Typography, Button } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

import { deletePublicFacility } from '../../../../actions/publicFacility';

function DeleteFacility({ facilitiesNames, setFacilitiesNames }) {
    const [selectedFacility, setSelectedFacility] = useState(null);

    const handleDeleteClick = () => {
        deletePublicFacility(selectedFacility)
        .then(res => {
            if(res){
                const facilityId = selectedFacility.id;
                setSelectedFacility(null);
                setFacilitiesNames(prevState => 
                    prevState.filter(facility => facility.id != facilityId)
                );
            }
        });
    };
    
    return (
        <Grid container spacing={3} justify='center'>
            <Grid item xs={8}>
                <Typography variant='body1' color='primary'>
                    Escull un equipament
                </Typography>
            </Grid>
            <Grid item xs={8}>
                <Autocomplete
                    value={selectedFacility}
                    onChange={(_ , newValue) => setSelectedFacility(newValue)}                        
                    options={facilitiesNames}
                    getOptionLabel={option => option.name}
                    renderInput={params => <TextField {...params} label='Equipament' variant='outlined'/>}
                />
            </Grid>
            <Grid item xs={8}>
                <Button variant='contained' color='secondary' onClick={handleDeleteClick}> 
                    Eliminar
                </Button>
            </Grid>
        </Grid>
    )
}

export default DeleteFacility
