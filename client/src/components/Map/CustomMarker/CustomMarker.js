import { Marker, Popup } from 'react-leaflet';
import { Typography, IconButton, Button } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import L from 'leaflet';

import './CustomMarker.css';
import { CONSUMPTION, PRICE, AREA} from '../../../constants/chart';

function getIconMarker(icon) {
    return new L.icon({
        iconUrl: icon,
        iconSize: [45, 45]
    });
}

function CustomMarker({ publicFacility, ids, icons, router }) {
    const { _id, name, typology, coordinates, area } = publicFacility;
    const isHomePage = !ids.length;
    const { dataType } = useParams();

    const handleChartClick = (type) => {
        const idsString = ids.concat([_id]).join(',');
        router.push(`/chart/${type}/${idsString}`);
    }

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
                { isHomePage ? 
                <>
                    <IconButton className='popup-icon-button' onClick={() => { handleChartClick(CONSUMPTION) }}>
                        <img className='popup-icon' src={icons.consum} alt='icon_btn' />
                    </IconButton>
                    <IconButton className='popup-icon-button' onClick={() => { handleChartClick(PRICE) }}>
                        <img className='popup-icon' src={icons.cost} alt='icon_btn' />
                    </IconButton>
                    {area > 0 && <IconButton className='popup-icon-button' onClick={() => { handleChartClick(AREA) }}>
                        <img className='popup-icon' src={icons.indicadors} alt='icon_btn' />
                    </IconButton>}
                </>
                : <div className='popup-button-div'>
                    <Button className='popup-button' variant='outlined' onClick={() => { handleChartClick(dataType) }}>
                        Afegir
                    </Button>
                </div> }
            </Popup>
        </Marker>
    )
}

export default CustomMarker
