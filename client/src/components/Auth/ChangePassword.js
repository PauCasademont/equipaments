import { useState } from 'react'
import { Button, Grid, Paper, TextField, InputAdornment, Typography, IconButton, Divider } from '@material-ui/core';
import { ArrowBack, Visibility, VisibilityOff } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
 
import './ChangePassword.css';
import { USER_STORAGE } from '../../constants'
import { changePassword } from '../../actions/user';

function ChangePassword() {
    const [showPassword, setShowPassword] = useState({
            currentPassword: false,
            newPassword: false,
            confirmNewPassword: false      
    });
    const [form, setForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    })
    const user = JSON.parse(localStorage.getItem(USER_STORAGE));
    const router = useHistory();

    const getInputProps = (formName) => ({
        endAdornment: 
            <InputAdornment position='end'>
                <IconButton onClick={() => setShowPassword({ ...showPassword, [formName]: !showPassword[formName] })}>
                    { showPassword[formName] ? <VisibilityOff fontSize='large'/>  
                    : <Visibility fontSize='large'/> }
                </IconButton>
            </InputAdornment>,
        style: {fontSize: 20}  
    });

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value})
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        changePassword(form, router);
    }

    return (
        user ?
        <Grid 
            container
            className='auth-container' 
            justify='center' 
            direction='column' 
            alignItems='center' 
        >
            <Grid item xs={12} sm={8} md={6} lg={4}>
                <Paper className='password-paper' elevation={3}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3} justify='center'>
                            <div className='password-header'>
                                <Typography className='password-title' variant='h4'>
                                    Canvia la teva contrasenya
                                </Typography>
                            </div>                            
                            <Grid item xs={12}>
                                <TextField  
                                    className='password-textfield'
                                    InputProps={getInputProps('currentPassword')}  
                                    onChange={handleChange}                           
                                    name='currentPassword'
                                    required
                                    fullWidth
                                    label='Contrasenya actual'                                    
                                    type={ showPassword.currentPassword ? 'text' : 'password' }
                                />
                            </Grid>
                            <Divider/>
                            <Grid item xs={12}>
                                <TextField  
                                    className='password-textfield'
                                    InputProps={getInputProps('newPassword')}  
                                    onChange={handleChange}                           
                                    name='newPassword'
                                    required
                                    fullWidth
                                    label='Nova contrasenya'                                    
                                    type={ showPassword.newPassword ? 'text' : 'password' }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField  
                                    className='password-textfield'
                                    InputProps={getInputProps('confirmNewPassword')}  
                                    onChange={handleChange}                           
                                    name='confirmNewPassword'
                                    required
                                    fullWidth
                                    label='Confirmar contrasenya'                                    
                                    type={ showPassword.confirmNewPassword ? 'text' : 'password' }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <div className='password-buttons'>
                                <Button 
                                    className='chart-legend-return-btn' 
                                    variant='outlined' 
                                    color='primary' 
                                    onClick={() => router.push('/')}
                                >
                                    <ArrowBack/>
                                    &nbsp; Torna al mapa
                                </Button> 
                                    <Button className='password-button' type='submit' variant='contained' color='primary'>
                                        Guardar
                                    </Button>
                                </div>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Grid>
        </Grid>
        : <div>Error: usuari no registrat</div>
    )
}

export default ChangePassword
