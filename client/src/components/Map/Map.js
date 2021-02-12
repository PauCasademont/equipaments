import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Typography, IconButton } from '@material-ui/core';

import './Map.css';
import { getPublicFalcilities } from '../../actions/publicFacility';
import consumption_icon from '../../images/consumption.png';
import cost_icon from '../../images/cost.png';
import indicators_icon from '../../images/indicators.png';


const INITIAL_MAP_CONFIG = {center: [41.98311,2.82493], zoom: 14}

function Map() {
    const [publicFacilities, setPublicFacilities] = useState([]);

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
                <Marker position={coordinates} key={_id}>
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
                            <img className='icon' src={consumption_icon} alt='icon_btn' />
                        </IconButton>
                        <IconButton className='icon-button'>
                            <img className='icon' src={cost_icon} alt='icon_btn' />
                        </IconButton>
                        {area && <IconButton className='icon-button'>
                            <img className='icon' src={indicators_icon} alt='icon_btn' />
                        </IconButton>}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>  
    )
}

export default Map
