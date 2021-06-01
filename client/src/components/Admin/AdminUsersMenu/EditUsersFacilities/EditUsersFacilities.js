import { useState, useEffect } from 'react'
import { Grid,  Button, TextField, Divider, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

import { getUserField, addUserFacility, removeUserFacility } from '../../../../actions/user';
import { remove, add } from '../../../../actions/utils';

function EditUsersFacilities({ usernames, facilityNames, defaultUser }) {
    
    const [selectedUser, setSelectedUser] = useState( defaultUser ? usernames[usernames.length - 1] : null);
    const [form, setForm] = useState({
        selectedFacilityToAdd: null,
        selectedFacilityToRemove: null
    });
    const [facilitiesToAdd, setFacilitiesToAdd] = useState(null);
    const [facilitiesToRemove, setFacilitiesToRemove] = useState(null);

    useEffect(() => {
        if(selectedUser){
            getUserField(selectedUser.id, 'public_facility_ids')
            .then(userFacilitiesIds => {

                if(userFacilitiesIds){
                    setFacilitiesToAdd(facilityNames.filter(facility => 
                        !userFacilitiesIds.includes(facility.id)
                    ));
                    setFacilitiesToRemove(facilityNames.filter(facility => 
                        userFacilitiesIds.includes(facility.id)
                    ));
                } 
            });
        }
        else {
            setFacilitiesToAdd(null);
            setFacilitiesToRemove(null);
        }
    },[selectedUser]);

   

    const handleAddClick = () => {
        if(form.selectedFacilityToAdd) {
            addUserFacility(selectedUser.id, form.selectedFacilityToAdd.id)
            .then(() => {
                const addedFacility = form.selectedFacilityToAdd;
                setForm(prevState => ({
                    ...prevState,
                    selectedFacilityToAdd: null
                }));
                setFacilitiesToAdd(remove(facilitiesToAdd, addedFacility));
                setFacilitiesToRemove(add(facilitiesToRemove, addedFacility));
            });
        }
    }

    const handleRemoveClick = () => {
        if(form.selectedFacilityToRemove){
            removeUserFacility(selectedUser.id, form.selectedFacilityToRemove.id)
            .then(() => {
                const removedFacility = form.selectedFacilityToRemove;
                setForm(prevState => ({
                    ...prevState,
                    selectedFacilityToRemove: null
                }));
                setFacilitiesToAdd(add(facilitiesToAdd, removedFacility));
                setFacilitiesToRemove(remove(facilitiesToRemove, removedFacility));
            });
        }
    }

    return (
        <Grid container spacing={3} justify='center'>
            <Grid item xs={8}>
                <Typography variant='body1' color='primary'>
                    Escull un usuari
                </Typography>
            </Grid>
            <Grid item xs={8}>
                <Autocomplete
                    value={selectedUser}
                    onChange={(_ , newValue) => setSelectedUser(newValue)}                        
                    options={usernames}
                    getOptionLabel={option => option.name}
                    renderInput={params => <TextField {...params} label='Usuari' variant='outlined'/>}
                />
            </Grid>
            { selectedUser && facilitiesToAdd?.length > 0 &&
                <>
                    <Grid item xs={8}>
                        <Divider/>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant='body1' color='primary'>
                            Afageix un equipament a l'usuari {selectedUser.username}
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Grid container spacing={3} justify='center'>
                            <Grid item xs={9}>
                                <Autocomplete
                                    value={form.selectedFacilityToAdd}
                                    onChange={(_ , newValue) => setForm(prevState => ({ 
                                        ...prevState, 
                                        selectedFacilityToAdd: newValue
                                    }))}                        
                                    options={facilitiesToAdd}
                                    getOptionLabel={option => option.name}
                                    renderInput={params => <TextField {...params} label='Equipament per afegir' variant='outlined'/>}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Button 
                                    className='admin-users-menu-btn' 
                                    color='primary'
                                    variant='contained'
                                    onClick={handleAddClick}
                                >
                                    Afegir
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </>
            }
            { selectedUser && facilitiesToRemove?.length > 0 &&
                <>
                    <Grid item xs={8}>
                        <Divider/>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant='body1' color='primary'>
                            Elimina un equipament a l'usuari {selectedUser.username}
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Grid container spacing={3} justify='center'>
                            <Grid item xs={9}>
                                <Autocomplete
                                    value={form.selectedFacilityToRemove}
                                    onChange={(_ , newValue) => setForm(prevState => ({ 
                                        ...prevState, 
                                        selectedFacilityToRemove: newValue
                                    }))}                        
                                    options={facilitiesToRemove}
                                    getOptionLabel={option => option.name}
                                    renderInput={params => <TextField {...params} label='Equipament per eliminar' variant='outlined'/>}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Button 
                                    className='admin-users-menu-btn' 
                                    variant='contained' 
                                    color='secondary'
                                    onClick={handleRemoveClick}
                                >
                                    Eliminar
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </>
            }
        </Grid>
    )
}

export default EditUsersFacilities
