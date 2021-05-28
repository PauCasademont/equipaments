import { useState } from 'react'
import { Grid, Typography, TextField, Button, Divider, InputAdornment, IconButton } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { VisibilityOff, Visibility } from '@material-ui/icons';

import './EditUsersCredentials.css';
import { adminChangeUsername, adminChangePassword } from '../../../../actions/user';

function EditUsersCredentials({ usernames, setNames }) {
    const [selectedUser, setSelectedUser] = useState(null);
    const [form, setForm] = useState({
        newUsername: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [showPassword, setShowPassword] = useState({
        newPassword: false,
        confirmNewPassword: false
    });

    const getInputProps = (formName) => ({
        endAdornment: 
            <InputAdornment position='end'>
                <IconButton onClick={() => setShowPassword({ ...showPassword, [formName]: !showPassword[formName] })}>
                    { showPassword[formName] ? <VisibilityOff />  
                    : <Visibility /> }
                </IconButton>
            </InputAdornment>,
        style: {fontSize: 20}  
    });

    const handleChangeUsernameClick = () => {
        adminChangeUsername(form, selectedUser.id)
        .then(result => {
            if(result){
                const newUser = { name: result.username, id: result._id}
                setSelectedUser(null);
                setNames(prevState => ({
                    ...prevState,
                    users: prevState.users.map(user => {
                        if(user.id == selectedUser.id) {
                            return newUser;
                        }
                        return user;
                    })
                }));
                setSelectedUser(newUser);
            }
        })
    }

    const handleChangePasswordClick = () => {
        adminChangePassword(form, selectedUser.id);
    }

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value});
    };

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
            { selectedUser &&
                <>
                    <Grid item xs={8}>
                        <Divider/>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant='body1' color='primary'>
                            Entra el nou nom de l'usuari
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            className='edit-users-credentials-text-input'
                            onChange={handleChange}
                            name='newUsername'
                            fullWidth
                            label="Nou nom d'usuari"
                            type='text'
                        />
                        <Button color='primary' variant='contained' onClick={handleChangeUsernameClick}>
                            Guardar nom d'usuari
                        </Button>
                    </Grid>
                    <Grid item xs={8}>
                        <Divider/>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant='body1' color='primary'>
                            Entra la nova contrasenya de l'usuari
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            className='edit-users-credentials-text-input'
                            onChange={handleChange}
                            name='newPassword'
                            fullWidth
                            label='Nova contrasenya'
                            type={showPassword.newPassword ? 'text' : 'password'}
                            InputProps={getInputProps('newPassword')}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            className='edit-users-credentials-text-input'
                            onChange={handleChange}
                            name='confirmNewPassword'
                            fullWidth
                            label='Confirmar nova contrasenya'
                            type={showPassword.newPassword ? 'text' : 'password'}
                            InputProps={getInputProps('confirmNewPassword')}
                        />
                        <Button color='primary' variant='contained' onClick={handleChangePasswordClick}>
                            Guardar contrasenya
                        </Button>
                    </Grid>
                </>
            }
        </Grid>
    )
}

export default EditUsersCredentials
