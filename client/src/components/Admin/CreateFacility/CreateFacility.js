import { useState } from 'react';
import { Button, TextField, Paper, Typography, MenuItem, Select, Divider, InputAdornment } from '@material-ui/core';

import './CreateFacility.css';
import { SUPERSCRIPT_TWO, TYPOLOGIES } from '../../../constants';
import { createPublicFacility } from '../../../actions/publicFacility';

function CreateFacility({ setOpenPopup, setPublicFacilities }) {

    const initialStateForm = { 
        name: '',
        typology: TYPOLOGIES[0].icon,
        latitude: '',
        longitude: '',
        area: ''
    }
    const [form, setForm] = useState(initialStateForm); 

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value})
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        createPublicFacility(form)
        .then(facility => {
            if(facility){
                setForm(initialStateForm);
                const newFacility = { 
                    id: facility._id,
                    name: facility.name,
                    typology: facility.typology,
                    coordinates: facility.coordinates,
                    area: facility.area,
                    years: []
                };
                setPublicFacilities(prevState => prevState.concat([newFacility]));
            }
        })
    }

    return (
        <div className='create-facility-popup'>
            <Paper elevation={10} className='create-facility-popup-inner'>
                <div className='create-facility-title'>
                    <Typography  variant='h5'>
                        Afegir Equipament
                    </Typography>
                </div>
                <form onSubmit={handleSubmit}>
                    <TextField
                        className='create-facility-input-name'
                        name='name'
                        required
                        fullWidth
                        label='Nom Equipament'
                        autoFocus
                        type='text'
                        value={form.name}
                        onChange={handleChange}
                    />
                    <div className='create-facility-input-div'>
                        <Typography variant='body1' className='create-facility-label'>
                            Tipologia:
                        </Typography>
                        <Select
                            className='edit-select'
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
                    <Divider className='create-facility-divider'/>
                    <div className='create-facility-input-div'>
                        <Typography variant='body1' className='create-facility-label'>
                            Coordenades: 
                        </Typography>
                        <TextField
                            name='latitude'
                            className='create-facility-input-coords'
                            label='Latitud'
                            type='number'
                            required
                            value={form.latitude}                            
                            onChange={handleChange}
                        />
                        <TextField
                            name='longitude'
                            className='create-facility-input-coords'
                            label='Longitud'
                            type='number'
                            required
                            value={form.longitude}                           
                            onChange={handleChange}
                        />
                    </div>
                    <Divider className='create-facility-divider'/>
                    <div className='create-facility-input-div'>
                        <Typography variant='body1' className='create-facility-label'>
                            Superfície (opcional): 
                        </Typography>
                        <TextField
                            className='create-facility-input-area'
                            onChange={handleChange}
                            name='area'
                            label='Superfície'
                            type='number'  
                            value={form.area}                          
                            InputProps={{
                                endAdornment: <InputAdornment position='end'>{'m' + SUPERSCRIPT_TWO}</InputAdornment>
                            }}
                        />
                    </div>
                    <div className='create-facility-div-btns'>
                        <Button 
                            variant='outlined' 
                            color='primary' 
                            onClick={() => setOpenPopup(prevState => ({ ...prevState, createFacility: false }))}
                        >
                            Tancar
                        </Button> 
                        <Button className='create-facility-add-btn' variant='contained' type='submit'>
                            Afegir
                        </Button>
                    </div>
                </form>
            </Paper>
        </div>
    )
}

export default CreateFacility
