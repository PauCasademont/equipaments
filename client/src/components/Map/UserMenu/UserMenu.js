import { useState, useEffect } from 'react';
import { IconButton, Avatar, Menu, Typography, MenuItem } from '@material-ui/core';
import ReactFileReader from 'react-file-reader';

import './UserMenu.css';
import { importDataFromCSV, getPublicFacilitiesNames } from '../../../actions/publicFacility';
import { USER_STORAGE } from '../../../constants';

function UserMenu({ user, router, setOpenPopup }) {
    const [anchorUserMenu, setAnchorUserMenu] = useState(null);
    const [userFacilities, setUserFacilities] = useState([]);

    useEffect(() => {
        if(!user.isAdmin){
            getPublicFacilitiesNames(user.publicFacilityIds)
            .then(names => setUserFacilities(names));
        }
    },[]);

    const handleLogout = () => {
        localStorage.removeItem(USER_STORAGE);
        window.location.reload(false);
    };

    const handleFile = (files) => {
        const reader = new FileReader();
        reader.onload = () => {
            const strFile = reader.result.replaceAll('\"', '').replaceAll('.','');
            importDataFromCSV(strFile, files[0].name);
        };
        
        reader.readAsText(files[0]);
    };

    const handleOpenPopupCreateFaciliy = () => {
        setOpenPopup(prevState => ({ ...prevState, createFacility: true }));
        setAnchorUserMenu(null);
    }

    return (
        <div className='userMenu-div'>
            <IconButton 
                className='userMenu-btn' 
                color='inherit' 
                aeia-controls='userMenu' 
                aria-haspopup='true' 
                onClick={(event) => setAnchorUserMenu(event.currentTarget)}
            >
                <Avatar className='userMenu-avatar' />
            </IconButton>
            <Menu 
                id='userMenu' 
                keepMounted 
                anchorEl={anchorUserMenu} 
                open={Boolean(anchorUserMenu)} 
                onClose={() => setAnchorUserMenu(null)}
            >
                <div className='userMenu-username-div'>
                    <Typography className='userMenu-username' variant='body1'>{user.username}</Typography>
                </div>
                { !user.isAdmin &&
                    userFacilities.map(facility => (
                        <MenuItem onClick={() => router.push(`/edit/${facility.id}`)}>
                            Editar {facility.name}
                        </MenuItem>
                    ))
                }
                <MenuItem onClick={handleLogout}>
                    Tancar Sessió
                </MenuItem> 
                { user.isAdmin &&                                     
                    <ReactFileReader handleFiles={handleFile} fileTypes={'.csv'}>
                        <MenuItem>
                            Importar Dades CSV
                        </MenuItem>
                    </ReactFileReader> 
                }
                { user.isAdmin &&
                    <MenuItem onClick={() => router.push('/invisible_facilities')}>
                        Equipaments sense coordenades
                    </MenuItem>
                } 
                { user.isAdmin &&
                    <MenuItem onClick={() => handleOpenPopupCreateFaciliy()}>
                        Crear Equipament
                    </MenuItem>
                }
            </Menu>
        </div>  
    )
}

export default UserMenu
