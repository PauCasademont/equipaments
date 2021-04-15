import { useState } from 'react';
import { IconButton, Avatar, Menu, Typography, MenuItem  } from '@material-ui/core';
import ReactFileReader from 'react-file-reader';

import './UserMenu.css';
import { importDataFromCSV } from '../../../actions/publicFacility';
import { USER_STORAGE } from '../../../constants';

function UserMenu({ user }) {
    const [anchorUserMenu, setAnchorUserMenu] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem(USER_STORAGE);
        window.location.reload(false);
    };

    const handleFile = (files) => {
        const reader = new FileReader();
        reader.onload = () => {
            const strFile = reader.result.replaceAll('\"', '');
            importDataFromCSV(strFile, files[0].name);
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
                <MenuItem onClick={handleLogout}>Tancar Sessió</MenuItem> 
                { user.isAdmin && 
                    <ReactFileReader handleFiles={handleFile} fileTypes={'.csv'}>
                        <MenuItem>Importar Dades CSV</MenuItem>
                    </ReactFileReader>
                }
            </Menu>
        </div>  
    )
}

export default UserMenu
