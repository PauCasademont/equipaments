import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { 
    Grid, 
    Typography, 
    TextField, 
    Paper, 
    Button, 
    TableContainer, 
    TableCell,
    Table,
    TableBody,
    TableRow
    } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';

import './InvisibleFacilities.css'
import { getInvisiblePublicFacilities, updateCoordinates, deletePublicFacility } from '../../../actions/publicFacility';
import { USER_STORAGE } from '../../../constants';

function InvisibleFacilities() {
//Return invisible facilities page

    //List of facilities without coordinates
    const [publicFacilities, setPublicFacilities] = useState();

    const router = useHistory();

    useEffect(() => {
        getInvisiblePublicFacilities()
        .then(invisibleFacilities => {
            setPublicFacilities(invisibleFacilities);
        });
    },[]);

    const removeFromList = (id) => {
        const newInvisibleFacilities = Object.assign({}, publicFacilities);
        delete newInvisibleFacilities[id];
        setPublicFacilities(newInvisibleFacilities);
    }

    const handleSave = (id) => {
        updateCoordinates(id, publicFacilities[id].coordinates)
        .then(changed => {
            if(changed) removeFromList(id);
        });
    }

    const handleDelete = (id, name) => {
        deletePublicFacility({ id, name })
        .then(result => {
            if(result) removeFromList(id);
        });
    }

    const handleChange = (event, id) => {

        //If latitude index = 0, if longitude index = 1 ( [lat, lng] ).
        const coordinatesIndex = event.target.name == 'latitude' ? 0 : 1;

        //Copy the state var (publicFacilities) to update it
        let facilityCopy = publicFacilities[id];
        let coordinatesCopy = facilityCopy.coordinates;
        coordinatesCopy[coordinatesIndex] = event.target.value;
        facilityCopy.coordinates = coordinatesCopy; 
        setPublicFacilities({ ...publicFacilities, [id]: facilityCopy});
    }

    return (
        !publicFacilities ? '' : 
        <Grid 
            container 
            className='invisibleFacilities-container'
            spacing={5}       
            direction='column' 
            alignItems='center' 
        >
            <Grid item  xs={12} md={8}>
                <Typography  variant='h4'>
                    Equipaments sense coordenades
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Button color='primary' onClick={() => router.push('/')}>
                    <ArrowBack/>
                    &nbsp; Pàgina principal
                </Button>
            </Grid>
            <Grid item xs={12} md={8}>
                <TableContainer component={Paper}>
                    <Table className='invisibleFacilities-table'>
                        <TableBody>
                            {Object.keys(publicFacilities).map(id => (
                                <TableRow key={id}>
                                    <TableCell aling='right'>
                                        <Typography variant='body1'>
                                            {publicFacilities[id].name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell aling='right'>
                                        <TextField
                                            name='latitude'
                                            className='invisibleFacilities-textField'
                                            fullWidth
                                            label='Latitud'
                                            type='number'
                                            onChange={(event) => handleChange(event, id)}
                                        />
                                    </TableCell>
                                    <TableCell aling='right'>
                                        <TextField
                                            name='longitude'
                                            className='invisibleFacilities-textField'
                                            fullWidth
                                            label='Longitud'
                                            type='number'
                                            onChange={(event) => handleChange(event, id)}
                                        />
                                    </TableCell>
                                    <TableCell aling='right'>
                                        <Button className='invisibleFacilities-saveBtn' onClick={() => handleSave(id)}>
                                            Guardar
                                        </Button>
                                    </TableCell>
                                    <TableCell align='right'>
                                        <Button variant='outlined' color='secondary' onClick={() => handleDelete(id, publicFacilities[id].name)}>
                                            Eliminar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                { Object.keys(publicFacilities).length == 0 &&
                    <Typography variant='h6'>
                        Tots els equipaments tenen coordenades assignades
                    </Typography>
                }
            </Grid>
        </Grid> 
    )
}

export default InvisibleFacilities
