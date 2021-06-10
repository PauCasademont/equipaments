import { useState } from 'react'
import { Grid, Typography, TextField, Button } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

import './DeleteUser.css';
import { deleteUser } from '../../../../actions/user';

function DeleteUser({ usernames, setNames }) {
//Return delete user page

    const [selectedUser, setSelectedUser] = useState(null);

    const handleDeleteClick = () => {
        if(selectedUser){
            deleteUser(selectedUser.id, selectedUser.name)
            .then(res => {
            //If user has been deleted, remove it from names list
                if(res) {
                    const deletedId = selectedUser.id;
                    setSelectedUser(null);
                    setNames(prevState => ({
                        ...prevState,
                        users: prevState.users.filter(user => user.id != deletedId)
                    }));
                }
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
                <Button 
                    className='delete-user-btn'
                    variant='contained' 
                    color='secondary' 
                    onClick={handleDeleteClick}
                >
                    Eliminar usuari
                </Button>
            </Grid>
        </Grid>
    )
}

export default DeleteUser
