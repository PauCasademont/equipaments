import { useState, useEffect } from 'react';
import { AppBar, Grid, Paper, Tabs, Tab, Button, Typography } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { getPublicFacilitiesNames } from '../../../actions/publicFacility';
import { getUsersNames } from '../../../actions/user';
import CreateUser from './CreateUser/CreateUser';
import EditUsersFacilities from './EditUsersFacilities/EditUsersFacilities';
import EditUsersCredentials from './EditUsersCredentials/EditUsersCredentials';
import DeleteUser from './DeleteUser/DeleteUser';
import { useHistory } from 'react-router-dom';

import './AdminUsersMenu.css';

const TABS = {
    create: 0,
    edit_facilities: 1,
    edit_credentials: 2,
    remove: 3
}

function AdminUsersMenu() {
    const [openTab, setOpenTab] = useState(0);
    const [names, setNames] = useState({
        publicFaiclities: [],
        users: []
    });
    const [defaultUser, setDefaultUser] = useState(false);

    const router = useHistory();

    useEffect(() => {
        getPublicFacilitiesNames()
        .then(result => setNames(prevState => 
            ({...prevState, publicFaiclities: result})
        ));
        getUsersNames()
        .then(result => setNames(prevState => 
            ({...prevState, users: result})
        ));
    },[]);

    return (
        <Grid 
            container
            className='auth-container' 
            justify='center' 
            direction='column' 
            alignItems='center' 
        >
            <Grid item className='admin-users-menu-title' xs={12} sm={8} md={6}>
                <Typography variant='h4' color='primary'>
                    Usuaris
                </Typography>
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
                <Paper className='admin-users-menu-paper' elevation={3} square={true}>
                    <AppBar className='admin-users-menu-appbar' position='static'>
                        <Tabs value={openTab} onChange={(_, tabIndex) => setOpenTab(tabIndex)}>
                            <Tab label='Crear'/>
                            <Tab label='Editar Equipaments'/>
                            <Tab label='Editar Credencials'/>
                            <Tab label='Eliminar'/>
                        </Tabs>
                    </AppBar>
                    { openTab == TABS.create && 
                        <CreateUser 
                            setNames={setNames}
                            setDefaultUser={setDefaultUser}
                            setOpenTab={setOpenTab}
                            tabs={TABS}
                        /> 
                    }
                    { openTab == TABS.edit_facilities && 
                        <EditUsersFacilities 
                            usernames={names.users} 
                            facilityNames={names.publicFaiclities} 
                            defaultUser={defaultUser}
                        /> 
                    }
                    { openTab == TABS.edit_credentials && 
                        <EditUsersCredentials 
                            usernames={names.users} 
                            setNames={setNames}
                        /> 
                    }
                    { openTab == TABS.remove && 
                        <DeleteUser 
                            usernames={names.users} 
                            setNames={setNames}
                        /> 
                    }
                </Paper>
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
                <Button 
                    className='admin-users-return-btn' 
                    variant='outlined' 
                    color='primary' 
                    onClick={() => router.push('/')}
                >
                    <ArrowBack/>
                    &nbsp; Torna al mapa
                </Button>     
            </Grid>
        </Grid>
    )
}

export default AdminUsersMenu;
