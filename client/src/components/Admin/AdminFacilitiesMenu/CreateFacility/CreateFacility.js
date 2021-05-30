import { useState } from 'react';
import { Grid, Typography, Divider, Select, MenuItem, TextField, InputAdornment, Button } from '@material-ui/core';

import './CreateFacility.css';
import { createPublicFacility } from '../../../../actions/publicFacility';
import { TYPOLOGIES, SUPERSCRIPT_TWO } from '../../../../constants';

function CreateFacility({setFacilitiesNames }) {

    const formInitialState = {
        name: '',
        typology: TYPOLOGIES[0].icon,
        latitude: '',
        longitude: '',
        area: ''
    };

    const [form, setForm] = useState(formInitialState);

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value});
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        createPublicFacility(form)
        .then(result => {
            if(result){
                setForm(formInitialState);
                const newFacility = { id: result._id, name: result.name };
                setFacilitiesNames(prevState => [...prevState, newFacility]);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={3} justify='center'>
                <Grid item xs={8}>
                    <Typography variant='body1' color='primary'>
                        Entra les dades del nou equipament
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        className='create-facility-input'
                        onChange={handleChange}
                        name='name'
                        required
                        fullWidth
                        label="Nom de l'equipament"
                        type='text'
                        value={form.name}
                    />
                </Grid>
                <Grid item xs={8}>
                    <Divider/>
                </Grid>
                <Grid item xs={8}>
                    <div className='create-facility-div'>
                        <Typography variant='body1' color='primary'>
                            Tipologia
                        </Typography>
                        <Select
                            className='create-facility-input create-facility-input-typology'
                            value={form.typology}
                            onChange={(event) => {setForm({ ...form, typology: event.target.value })}}
                        >
                            { TYPOLOGIES.map((typology, index) => (
                                <MenuItem key={index} value={typology.icon}>
                                    {typology.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                </Grid>
                <Grid item xs={8}>
                    <Divider/>
                </Grid>
                <Grid item xs={8}>
                    <div className='create-facility-div'>
                        <Typography variant='body1' color='primary'>
                            Coordenades
                        </Typography>
                        <TextField
                            className='create-facility-input create-facility-input-coords'
                            name='latitude'
                            label='Latitud'
                            type='number'
                            required
                            value={form.latitude}                            
                            onChange={handleChange}
                        />
                         <TextField
                            className='create-facility-input create-facility-input-coords'
                            name='longitude'
                            label='Longitud'
                            type='number'
                            required
                            value={form.longitude}                           
                            onChange={handleChange}
                            />
                    </div>
                </Grid>
                <Grid item xs={8}>
                    <Divider/>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        onChange={handleChange}
                        name='area'
                        label='Superfície (opcional)'
                        type='number'  
                        value={form.area}                          
                        InputProps={{
                            endAdornment: <InputAdornment position='end'>{'m' + SUPERSCRIPT_TWO}</InputAdornment>
                        }}
                    />
                </Grid>
                <Grid item xs={8}>
                    <Button color='primary' type='submit' variant='contained'>
                        Crear Equipament
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default CreateFacility
