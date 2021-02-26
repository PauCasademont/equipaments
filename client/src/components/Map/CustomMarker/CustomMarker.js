import { Marker, Popup } from 'react-leaflet';
import { Typography, IconButton } from '@material-ui/core';
import L from 'leaflet';

import './CustomMarker.css';

function getIconMarker(icon) {
    return new L.icon({
        iconUrl: icon,
        iconSize: [45, 45]
    });
}

function CustomMarker({publicFacility, icons, handleChartClick }) {
    const { _id, name, typology, coordinates, area } = publicFacility;
    
    return (
        <Marker position={coordinates} key={_id} icon={getIconMarker(icons[typology])}>
            <Popup maxWidth='500'>
                <div className='popup-title-div'>
                    <Typography className='popup-title-text' variant='h6' gutterBottom aling='center'>
                        {name}
                    </Typography>
                </div>
                <Typography className='popup-info' variant='body1' >
                    Tipologia: {typology} <br /> {area ? <>{`Superficie: ${area} m`}<sup>2</sup></> : ''}
                </Typography>
                <IconButton className='icon-button' onClick={() => { handleChartClick(_id, name); }}>
                    <img className='icon' src={icons.consum} alt='icon_btn' />
                </IconButton>
                <IconButton className='icon-button'>
                    <img className='icon' src={icons.cost} alt='icon_btn' />
                </IconButton>
                {area > 0 && <IconButton className='icon-button'>
                    <img className='icon' src={icons.indicadors} alt='icon_btn' />
                </IconButton>}
            </Popup>
        </Marker>
    )
}

export default CustomMarker
