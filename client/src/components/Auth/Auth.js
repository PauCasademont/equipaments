import { useState } from 'react'
import { Button, Grid, Paper, TextField, InputAdornment, Typography, IconButton } from '@material-ui/core';
import { PersonOutline, LockOutlined, AccountCircle, Visibility, VisibilityOff } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
 
import './Auth.css';
import { signin } from '../../actions/user';

function Auth() {
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({
        username: '',
        password: ''
    })
    const router = useHistory();

    const getInputProps = (isPassword) => ({
        startAdornment: (            
            <InputAdornment position='start'>
                { isPassword ? 
                    <LockOutlined fontSize='large' variant='outlined'/> :
                    <PersonOutline fontSize='large' variant='outlined'/>                
                }                
            </InputAdornment>
        ),
        endAdornment: ( isPassword ?
            <InputAdornment position='end'>
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                    { showPassword ? 
                        <VisibilityOff fontSize='large'/> : 
                        <Visibility fontSize='large'/> 
                    }
                </IconButton>
            </InputAdornment> :
            null
        ),
        style: {fontSize: 20}  
    });

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value})
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        signin(form, router);
    }

    return (
        <Grid 
            container
            className='auth-container' 
            justify='center' 
            direction='column' 
            alignItems='center' 
        >
            <Grid item xs={12} sm={8} md={6} lg={4}>
                <Paper className='auth-paper' elevation={3}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3} justify='center'>
                            <div className='auth-header'>
                                <AccountCircle className='auth-avatar'/>
                                <Typography className='auth-title' variant='h2'>Login</Typography>
                            </div>
                            <Grid item xs={12}>
                                <TextField  
                                    className='auth-textfield'
                                    InputProps={getInputProps(false)}
                                    onChange={handleChange}                                
                                    name='username'
                                    required
                                    fullWidth
                                    label='Usuari'
                                    autoFocus
                                    type='text'
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField  
                                    className='auth-textfield'
                                    InputProps={getInputProps(true)}  
                                    onChange={handleChange}                           
                                    name='password'
                                    required
                                    fullWidth
                                    label='Contrasenya'                                    
                                    type={ showPassword ? 'text' : 'password' }
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Button className='auth-button' type='submit' variant='contained' color='primary'>
                                    Accedir
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default Auth
