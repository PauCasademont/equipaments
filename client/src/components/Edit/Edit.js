import { useEffect, useState } from 'react';
import { Paper, Typography, TextField, Grid, Button, InputAdornment } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';

import './Edit.css';
import { getPublicFacilityData, updatePublicFacility } from '../../actions/publicFacility';
import { 
    CONCEPTS, 
    LABELS, 
    DATA_TYPES, 
    CONSUMPTION, 
    AREA, 
    PRICE, 
    COORDINATES,
    SUPERSCRIPT_TWO,  
    CURRENT_YEAR, 
    YEARS_LIST
} from '../../constants';
import { inRangeLatitude, inRangeLongitude, createAlert } from '../../actions/utils';
import DropDownBox from './DropDownBox/DropDownBox';

function Edit() {
    const [concept, setConcept] = useState(CONCEPTS[0]);
    const [dataType, setDataType] = useState(DATA_TYPES[CONSUMPTION]);
    const [year, setYear] = useState(CURRENT_YEAR);
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
               newFormValues = [publicFacility.area];
           }

           else if (dataType == DATA_TYPES[COORDINATES]){
               newFormValues = publicFacility.coordinates;
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
        console.log('Data Type:',dataType);
        let updatedValues = formValues.map(value => parseFloat(value));
        if (dataType == DATA_TYPES[AREA]) updatedValues = updatedValues.slice(0,1);
        else if (dataType == DATA_TYPES[COORDINATES]) {
            updatedValues = updatedValues.slice(0,2);
            if(!inRangeLatitude(updatedValues[0]) || !inRangeLongitude(updatedValues[1])){
                createAlert('Coordenades invàlides');
                return;
            }
        }

        updatePublicFacility(facilityId, dataType, concept, year, formValues)
        .then((updatedPublicFacility) => {
            if(updatedPublicFacility){
                setPublicFacility(updatedPublicFacility);
            } else router.push('/');
        });
    }

    const handleChange = (value, valueIndex) => {
        const newValue = dataType != DATA_TYPES[COORDINATES] && value < 0 ? 0 : value;
        const formValuesCopy = formValues.map((valueCopy, index) => {
            return valueIndex == index ? newValue : valueCopy;
        });
        setFormValues(formValuesCopy);
    }

    const getNumberSuffix = () => {
        return dataType == DATA_TYPES[CONSUMPTION] ? 'kWh' : '€';
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
                                values={YEARS_LIST}
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
                        { formValues && (dataType == DATA_TYPES[CONSUMPTION] || dataType == DATA_TYPES[PRICE]) &&
                            formValues.map((_, index) => (
                                <Grid 
                                    item 
                                    key={index}
                                    className='edit-div' 
                                    xs={12} 
                                    sm={6} 
                                >
                                    <TextField
                                        onChange={(event) => handleChange(event.target.value, index)}
                                        name={LABELS[index]}
                                        label={LABELS[index]}
                                        type='number'
                                        value={formValues[index]}
                                        InputProps={{
                                            endAdornment: <InputAdornment position='end'>{getNumberSuffix()}</InputAdornment>
                                        }}
                                    />
                                </Grid>
                        ))}
                        { formValues && dataType == DATA_TYPES[AREA] &&
                            <Grid 
                                item 
                                className='edit-div' 
                                xs={12} 
                            >
                                <TextField
                                    onChange={(event) => handleChange(event.target.value, 0)}
                                    name={dataType}
                                    label={dataType}
                                    type='number'
                                    value={formValues[0]}
                                    InputProps={{
                                        endAdornment: <InputAdornment position='end'>{'m' + SUPERSCRIPT_TWO}</InputAdornment>
                                    }}
                                />
                            </Grid>
                        }
                        { formValues && dataType == DATA_TYPES[COORDINATES] &&
                            <>
                                <Grid
                                    item 
                                    className='edit-div'
                                    xs={12}
                                    sm={6}
                                >
                                    <TextField
                                        onChange={(event) => handleChange(event.target.value, 0)}
                                        name='latitude'
                                        label='Latitud'
                                        type='number'
                                        value={formValues[0]}
                                    />
                                </Grid>  
                                <Grid
                                    item 
                                    className='edit-div'
                                    xs={12}
                                    sm={6}
                                >
                                    <TextField
                                         onChange={(event) => handleChange(event.target.value, 1)}
                                         name='longitude'
                                         label='Longitud'
                                         type='number'
                                         value={formValues[1]}
                                    />
                                </Grid> 
                            </>                        
                        }
                    </Grid>
                </Paper>
            </Grid>
            <Grid item className='edit-div' xs={12}>
                <Button
                    className='edit-button edit-goBack-button'
                    variant='outlined'
                    color='secondary'
                    onClick={() => router.push('/')}
                >
                    Tornar
                </Button>
                <Button 
                    className='edit-button'
                    variant='contained' 
                    color='secondary'
                    onClick={() => handleSubmit()}
                >
                    Guardar
                </Button>
            </Grid>
        </Grid>
    )
}

export default Edit
