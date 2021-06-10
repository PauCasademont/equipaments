import { useState, useEffect } from 'react';
import { AppBar, Grid, Paper, Tabs, Tab, Button, Typography } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';

import './AdminFacilitiesMenu.css';
import { getPublicFacilitiesNames } from '../../../actions/publicFacility';
import CreateFacility from './CreateFacility/CreateFacility';
import DeleteFacility from './DeleteFacility/DeleteFacility';

const TABS = {
    create: 0,
    remove: 1
};

function AdminFacilitiesMenu() {
//Return admin settings page

    const [openTab, setOpenTab] = useState(0);
    const [facilitiesNames, setFacilitiesNames] = useState([]);

    const router = useHistory();

    useEffect(() => {
        getPublicFacilitiesNames()
        .then(result => setFacilitiesNames(result));
    },[]);

    return (
        <Grid 
            container
            className='auth-container' 
            justify='center' 
            direction='column' 
            alignItems='center' 
        >
            <Grid item className='admin-facilities-menu-title' xs={12} sm={8} md={6}>
                <Typography variant='h4' color='primary'>
                    Equipaments
                </Typography>
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
                <Paper className='admin-facilities-menu-paper' elevation={3} square={true}>
                    <AppBar className='admin-facilities-menu-appbar' position='static'>
                        <Tabs value={openTab} onChange={(_, tabIndex) => setOpenTab(tabIndex)}>
                            <Tab label='Crear'/>
                            <Tab label='Eliminar'/>
                        </Tabs>
                    </AppBar>
                    { openTab == TABS.create && 
                        <CreateFacility/>
                    }
                    { openTab == TABS.remove && 
                        <DeleteFacility facilitiesNames={facilitiesNames} setFacilitiesNames={setFacilitiesNames} />
                    }
                </Paper>
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
                <Button 
                    className='admin-facilities-return-btn' 
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

export default AdminFacilitiesMenu;
