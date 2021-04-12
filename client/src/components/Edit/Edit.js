import { useEffect, useState } from 'react';
import { Paper, Typography, TextField, Grid, Button, InputAdornment } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';

import './Edit.css';
import { getPublicFacilityData, updatePublicFacility } from '../../actions/publicFacility';
import { CONCEPTS, LABELS, DATA_TYPES, CONSUMPTION, AREA, PRICE, SUPERSCRIPT_TWO } from '../../constants';
import DropDownBox from './DropDownBox/DropDownBox';

function Edit() {
    const [concept, setConcept] = useState(CONCEPTS[0]);
    const currentYear = new Date().getFullYear();
    const [dataType, setDataType] = useState(DATA_TYPES[CONSUMPTION]);
    const [year, setYear] = useState(currentYear);
    const [formValues, setFormValues] = useState(null);
    const [publicFacility, setPublicFacility] = useState(null);
    const { facilityId } = useParams();
    const router = useHistory();
    
    useEffect(() => {
        getPublicFacilityData(facilityId)
        .then((facilityData) => {            
            setPublicFacility(facilityData);
        });
    },[]);
    
    useEffect(() => {
       if(publicFacility){
           let newFormValues = Array(12).fill(0);

           if (dataType == DATA_TYPES[AREA]){
               console.log('dins', publicFacility);
               newFormValues = [publicFacility.area];
           }

           else if (publicFacility.data[concept] && publicFacility.data[concept][year]){
               if (dataType == DATA_TYPES[CONSUMPTION]){
                   newFormValues = publicFacility.data[concept][year].consumption || newFormValues;
               }
               else{
                newFormValues = publicFacility.data[concept][year].price || newFormValues;
               }
            }  
            setFormValues(newFormValues);
       }
    },[dataType, concept, year, publicFacility]);

    const handleSubmit = () => {
        updatePublicFacility(facilityId, dataType, concept, year, formValues)
        .then((updatedPublicFacility) => {
            setPublicFacility(updatedPublicFacility);
        });
    }

    const getYearsList = () => {
        const firstYear = 2015
        return Array(currentYear - firstYear + 1).fill().map((_, index) => firstYear + index); 
    }

    const handleChange = (value, valueIndex) => {
        const formValuesCopy = formValues.map((valueCopy, index) => {
            return valueIndex == index ? value : valueCopy;
        });
        setFormValues(formValuesCopy);
    }

    const getNumberSuffix = () => {
        if (dataType == DATA_TYPES[CONSUMPTION]) return 'Kw';
        if (dataType == DATA_TYPES[PRICE]) return '€';
        return 'm' + SUPERSCRIPT_TWO;
    }

    return (
        publicFacility &&
        <Grid container spacing={2}>
            <Grid item className='edit-div edit-title' xs={12}>
                <Typography variant='h3' color='primary'>
                    Dades {publicFacility.name}
                </Typography>
            </Grid>
            <Grid item className='edit-div' xs={12}>
                <Paper elevation={3} className='edit-paper'>
                    <Grid container spacing={3}>
                        <Grid item className='edit-div' xs={12} sm={4}>
                            <DropDownBox
                                values={Object.values(DATA_TYPES)}
                                selectedValue={dataType}
                                setValue={setDataType}
                                name={'Tipus de dades'}
                            />
                        </Grid>
                        <Grid item className='edit-div' xs={12} sm={4}>
                            <DropDownBox 
                                values={CONCEPTS}
                                selectedValue={concept}
                                setValue={setConcept}
                                name={'Concepte'}
                            />
                        </Grid>
                        <Grid item className='edit-div' xs={12} sm={4}>
                            <DropDownBox 
                                values={getYearsList()}
                                selectedValue={year}
                                setValue={setYear}
                                name={'Any'}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item className='edit-div' xs={12}>
                <Paper elevation={3} className='edit-paper'>
                    <Grid container spacing={3}>
                        { formValues && 
                            formValues.map((_, index) => (
                                <Grid 
                                    item 
                                    key={index}
                                    className='edit-div' 
                                    xs={12} 
                                    sm={dataType == DATA_TYPES[AREA] ? 12 : 6} 
                                >
                                    <TextField
                                        onChange={(event) => handleChange(event.target.value, index)}
                                        name={dataType == DATA_TYPES[AREA] ? dataType : LABELS[index]}
                                        label={dataType == DATA_TYPES[AREA] ? dataType : LABELS[index]}
                                        type='number'
                                        value={formValues[index]}
                                        InputProps={{
                                            endAdornment: <InputAdornment position='end'>{getNumberSuffix()}</InputAdornment>
                                        }}
                                    />
                                </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Grid>
            <Grid item className='edit-div' xs={12}>
                <Button 
                    className='edit-button edit-save'
                    variant='contained' 
                    color='primary'
                    onClick={() => handleSubmit()}
                >
                    Guardar
                </Button>
                <Button
                    className='edit-button'
                    variant='contained'
                    color='primary'
                    onClick={() => router.push('/')}
                >
                    Tornar
                </Button>
            </Grid>
        </Grid>
    )
}

export default Edit
