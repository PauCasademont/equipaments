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

import './InvisibleFacilities.css'
import { getInvisibleFacilities, updateCoordinates } from '../../../actions/publicFacility';
import { USER_STORAGE } from '../../../constants';

function InvisibleFacilities() {
    const [publicFacilities, setPublicFacilities] = useState();
    const user = JSON.parse(localStorage.getItem(USER_STORAGE));
    const router = useHistory();

    useEffect(() => {
        getInvisibleFacilities()
        .then(invisibleFacilities => {
            setPublicFacilities(invisibleFacilities);
        });
    },[]);

    const handleSave = (id) => {
        updateCoordinates(id, publicFacilities[id].coordinates)
        .then(changed => {
            if(changed){
                const newInvisibleFacilities = Object.assign({}, publicFacilities);
                delete newInvisibleFacilities[id];
                setPublicFacilities(newInvisibleFacilities);
            }
        });
    }

    const handleChange = (event, id) => {
        const coordinatesIndex = event.target.name == 'latitude' ? 0 : 1;
        let facilityCopy = publicFacilities[id];
        let coordinatesCopy = facilityCopy.coordinates;
        coordinatesCopy[coordinatesIndex] = event.target.value;
        facilityCopy.coordinates = coordinatesCopy; 
        setPublicFacilities({ ...publicFacilities, [id]: facilityCopy});
    }

    return (
        user?.isAdmin && publicFacilities ? 
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
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid item xs={4}>
                <Button color='primary' onClick={() => router.push('/')}>
                    Pàgina principal
                </Button>
            </Grid>
        </Grid> 
        : <div>Accessible només per usuaris administradors</div>
    )
}

export default InvisibleFacilities
