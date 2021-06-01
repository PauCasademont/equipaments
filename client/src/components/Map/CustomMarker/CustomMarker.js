import { Marker, Popup } from 'react-leaflet';
import { Typography, IconButton, Button } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import L from 'leaflet';

import './CustomMarker.css';
import { CONSUMPTION, PRICE, AREA, SUPERSCRIPT_TWO} from '../../../constants';

function getIconMarker(icon) {
    return new L.icon({
        iconUrl: icon,
        iconSize: [35, 35]
    });
}

function CustomMarker({ publicFacility, userFacilityIds, ids, displayedDatasets, icons, router }) {
    const { id, name, typology, coordinates, area } = publicFacility;
    const isHomePage = !ids.length;
    const { dataType } = useParams();

    const handleChartClick = (type) => {
        const idsString = ids.concat([id]).join(',');
        router.push({
            pathname: `/chart/${type}/${idsString}`,
            state: {name, displayedDatasets}
        });
    }

    const handleEditClick = () => {
        router.push(`edit/${id}`);
    }

    const userCanEdit = () => {
        if(!userFacilityIds) return false;
        if(userFacilityIds == 'ALL') return true;
        return userFacilityIds.includes(id);
    }

    return (
        icons[typology] ?
        <Marker position={coordinates} icon={getIconMarker(icons[typology])}>
            <Popup maxWidth='500'>
                <div className='popup-title-div'>
                    <Typography className='popup-title-text' variant='h6' gutterBottom aling='center'>
                        {name}
                    </Typography>
                </div>
                <Typography className='popup-info' variant='body1' >
                    Tipologia: {typology} <br /> {area ? `Superficie: ${area} m${SUPERSCRIPT_TWO}` : ''}
                </Typography>
                { isHomePage ? 
                <>
                    <IconButton className='popup-icon-button' onClick={() => { handleChartClick(CONSUMPTION) }}>
                        <img className='popup-icon' src={icons.consum} alt='icon_btn' />
                    </IconButton>
                    <IconButton className='popup-icon-button' onClick={() => { handleChartClick(PRICE) }}>
                        <img className='popup-icon' src={icons.cost} alt='icon_btn' />
                    </IconButton>
                    {area > 0 && 
                    <IconButton className='popup-icon-button' onClick={() => { handleChartClick(AREA) }}>
                        <img className='popup-icon' src={icons.indicadors} alt='icon_btn' />
                    </IconButton> }
                    { userCanEdit() && 
                    <IconButton className='popup-icon-button' onClick={() => { handleEditClick() }}>
                        <img className='popup-icon' src={icons.editar} alt='icon_btn' />
                    </IconButton> }
                </>
                : <div className='popup-button-div'>
                    { !ids.includes(id) && 
                    <Button className='popup-button' variant='outlined' onClick={() => { handleChartClick(dataType) }}>
                        Afegir
                    </Button> }
                </div> } 
            </Popup>
        </Marker>
        : null
    )
}

export default CustomMarker
