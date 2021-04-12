import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, LayersControl, LayerGroup } from 'react-leaflet';
import { useHistory, useLocation } from 'react-router-dom';
import decode from 'jwt-decode';
import { IconButton, Avatar , Typography, Menu, MenuItem } from '@material-ui/core';

import './Map.css';
import 'leaflet/dist/leaflet.css';
import { getPublicFalcilities } from '../../actions/publicFacility';
import CustomMarker from './CustomMarker/CustomMarker';
import { TYPOLOGIES } from '../../constants';

const INITIAL_MAP_CONFIG = { center: [41.98311, 2.82493], zoom: 14 }

function getIcons() {
    const req = require.context('../../images', false, /.*\.png$/);
    let res = {}
    req.keys().map((key) => {
        res[key.replace('./', '').replace('.png', '')] = req(key).default;
    })
    return res;
}

function Map({ ids = [] }) {
    const [publicFacilities, setPublicFacilities] = useState(null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const [anchorUserMenu, setAnchorUserMenu] = useState(null);
    const icons = getIcons();
    const router = useHistory();
    const location = useLocation();

    useEffect(() => {
        getPublicFalcilities()
            .then((groupedByTypology) => {
                setPublicFacilities(groupedByTypology);
            })
            .catch((error) => { console.log(error) });
    }, []);

    useEffect(() => {
        const token = user?.token;

        if (token) {
            const decodedToken = decode(token);
            if (decodedToken.exp - (Date.now() / 1000) < 0) setUser(null);
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('profile');
        window.location.reload(false);
    };

    return (
        <MapContainer
            center={INITIAL_MAP_CONFIG.center}
            zoom={INITIAL_MAP_CONFIG.zoom}
            scrollWheelZoom={true}
        >
            {/* <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png"
                attribution='&copy; <a href="Esri &mdash">Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community</a> contributors'
             /> */}
             <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            /> 
            <LayersControl position='bottomright'>
                {publicFacilities && TYPOLOGIES.map((typology, index) => (
                    <LayersControl.Overlay key={index} checked name={typology.name}>
                        <LayerGroup>
                            {publicFacilities[typology.icon]?.map((publicFacility) => (
                                <CustomMarker
                                    key={publicFacility._id}
                                    publicFacility={publicFacility}
                                    userFacilityId={user?.isAdmin ? 'ALL' : user?.publicFacilityId}
                                    ids={ids}
                                    icons={icons}
                                    router={router}
                                />
                            ))}
                        </LayerGroup>
                    </LayersControl.Overlay>
                ))}
            </LayersControl>   
            { user &&
                <div className='user-div'>
                    <IconButton 
                        className='user-btn' 
                        color='inherit' 
                        aeia-controls='userMenu' 
                        aria-haspopup='true' 
                        onClick={(event) => setAnchorUserMenu(event.currentTarget)}
                    >
                        <Avatar className='user-avatar' />
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
                    </Menu>
                </div>         
            }
        </MapContainer>
    )
}

export default Map
