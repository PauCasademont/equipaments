import { useState } from 'react';
import { Grid, TextField, InputAdornment, IconButton, Button, Typography } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

import './CreateUser.css';
import { signup } from '../../../../actions/user';

function CreateUser({ setNames, setDefaultUser, setOpenTab, tabs }) {

    const formInitialState = {
        username: '',
        password: '',
        confirmPassword: ''
    };

    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false
    });
    const [form, setForm] = useState(formInitialState);

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

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value});
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        signup(form)
        .then(result => {
            if(result){
                setForm(formInitialState);
                setNames(prevState => ({
                    ...prevState,
                    users: [...prevState.users, result]
                }));
                setDefaultUser(true);
                setOpenTab(tabs.edit_facilities);
            }
        })
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={3} justify='center'>
                <Grid item xs={8}>
                    <Typography variant='body1' color='primary'>
                        Entra les dades del nou usuari
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        onChange={handleChange}
                        name='username'
                        required
                        fullWidth
                        label="Nom d'usuari"
                        type='text'
                    />
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        onChange={handleChange}
                        name='password'
                        required
                        fullWidth
                        label='Contrasenya'                       
                        type={showPassword.password ? 'text' : 'password'}
                        InputProps={getInputProps('password')}
                    />
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        onChange={handleChange}
                        name='confirmPassword'
                        required
                        fullWidth
                        label='Confrimar Contrasenya'                       
                        type={showPassword.confirmPassword ? 'text' : 'password'}
                        InputProps={getInputProps('confirmPassword')}
                    />
                </Grid>
                <Grid item xs={8}>
                    <Button color='primary' type='submit' variant='contained'>
                        Crear Usuari
                    </Button>
                </Grid>
            </Grid>
        </form>

    )
}

export default CreateUser
