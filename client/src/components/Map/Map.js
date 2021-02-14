import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Typography, IconButton } from '@material-ui/core';
import L from 'leaflet';

import './Map.css';
import { getPublicFalcilities } from '../../actions/publicFacility';

const INITIAL_MAP_CONFIG = {center: [41.98311,2.82493], zoom: 14}

function getIcons() {
    const req = require.context('../../images', false, /.*\.png$/);
    let res = {}
    req.keys().map((key) => { 
        res[key.replace('./', '').replace('.png', '')] = req(key).default; 
    })   
    return res;
}

function getIconMarker(icon) {
    return new L.icon({
        iconUrl: icon,
        iconSize: [45, 45]
    });
}

function Map() {
    const [publicFacilities, setPublicFacilities] = useState([]);
    const icons = getIcons();

    useEffect(() => {
        getPublicFalcilities()
            .then((res) => {setPublicFacilities(res.data.result)})
            .catch((error) => {console.log(error)});
    }, []);


    return (                     
        <MapContainer center={INITIAL_MAP_CONFIG.center} zoom={INITIAL_MAP_CONFIG.zoom} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />          
            {publicFacilities.map(({ _id, name, typology, coordinates, area }) => (
                <Marker position={coordinates} key={_id} icon={getIconMarker(icons[`${typology}`])}>
                    <Popup maxWidth='500'>
                        <div className='popup-title-div'>
                            <Typography className='popup-title-text' variant='h6' gutterBottom aling='center'>
                                {name}
                            </Typography>
                        </div>
                        <Typography className='popup-info' variant='body1' >
                            Tipologia: {typology} <br /> {area ? <>{`Superficie: ${area} m`}<sup>2</sup></> : ''}
                        </Typography>
                        <IconButton className='icon-button'>
                            <img className='icon' src={icons.consum} alt='icon_btn' />
                        </IconButton>
                        <IconButton className='icon-button'>
                            <img className='icon' src={icons.cost} alt='icon_btn' />
                        </IconButton>
                        {area && <IconButton className='icon-button'>
                            <img className='icon' src={icons.indicadors} alt='icon_btn' />
                        </IconButton>}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>  
    )
}

export default Map
