import { useState, useEffect } from 'react';
import { IconButton, Avatar, Menu, Typography, MenuItem } from '@material-ui/core';
import ReactFileReader from 'react-file-reader';

import './UserMenu.css';
import { getPublicFacilitiesNamesFromIds } from '../../../actions/publicFacility';
import { USER_STORAGE } from '../../../constants';

function UserMenu({ user, router, setOpenPopup }) {
    const [anchorUserMenu, setAnchorUserMenu] = useState(null);
    const [userFacilities, setUserFacilities] = useState([]);

    useEffect(() => {
        if(!user.isAdmin){
            getPublicFacilitiesNamesFromIds(user.publicFacilityIds)
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
            setAnchorUserMenu(null);
            setOpenPopup(prevState => ({
                 ...prevState, 
                 importData: {
                     open: true,
                     fileName: files[0].name,
                     strFile
                 }
            }));
        };
        
        reader.readAsText(files[0]);
    };

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
                    userFacilities.map((facility, index) => (
                        <MenuItem key={index} onClick={() => router.push(`/edit/${facility.id}`)}>
                            Editar {facility.name}
                        </MenuItem>
                    ))
                }
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
                    <MenuItem onClick={() => router.push('/users_settings')}>
                        Configuració Usuaris
                    </MenuItem>
                }
                { user.isAdmin &&
                    <MenuItem onClick={() => router.push('/facilities_settings')}>
                        Configuració Equipaments
                    </MenuItem>
                }
                <MenuItem onClick={() => router.push('/password')}>
                    Canviar Contrasenya
                </MenuItem> 
                <MenuItem onClick={handleLogout}>
                    Tancar Sessió
                </MenuItem> 
                
            </Menu>
        </div>  
    )
}

export default UserMenu
