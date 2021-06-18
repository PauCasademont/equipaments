import { Marker, Popup } from 'react-leaflet';
import { Typography, IconButton, Button } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import Tippy from '@tippy.js/react';
import L from 'leaflet';

import './CustomMarker.css';
import { CONSUMPTION, PRICE, AREA, SUPERSCRIPT_TWO } from '../../../constants';


function CustomMarker({ publicFacility, userFacilityIds, ids, displayedDatasets, icons, router }) {
//Return facility marker with his pop-up

    const { id, name, typology, coordinates, area } = publicFacility;
    const isHomePage = !ids.length;
    const { dataType } = useParams();

    function getIconMarker(icon) {
    //Create leaflet icon from image
        return new L.icon({
            iconUrl: icon,
            iconSize: [29, 34]
        });
    }

    const handleChartClick = (type) => {
    //Redirect to chart page
        const idsString = ids.concat([id]).join(',');
        router.push({
            pathname: `/chart/${type}/${idsString}`,
            state: { displayedDatasets }
        });
    }

    const handleEditClick = () => {
    //Redirect to edit facility page
        router.push(`edit/${id}`);
    }

    const userCanEdit = () => {
        if(!userFacilityIds) return false;
        //Is administrator
        if(userFacilityIds == 'ALL') return true;
        return userFacilityIds.includes(id);
    }


    return (
        icons[typology] ?
        <Marker position={coordinates} icon={getIconMarker(icons[typology])}>
            <Popup maxWidth='500'>
                {/* Popup Data */}
                <div className='popup-title-div'>
                    <Typography className='popup-title-text' variant='h6' gutterBottom aling='center'>
                        {name}
                    </Typography>
                </div>
                <Typography className='popup-info' variant='body1' >
                    Tipologia: {typology} <br /> {area ? `Superficie: ${area} m${SUPERSCRIPT_TWO}` : ''}
                </Typography>
                { publicFacility.users.length == 1 &&
                    <Typography className='popup-info' variant='body1' >
                        Administrador: {publicFacility.users[0]}
                    </Typography>
                }
                { publicFacility.users.length > 1 &&
                    <Typography className='popup-info' variant='body1' >
                        Administradors: {publicFacility.users.join(', ')}
                    </Typography>
                }
                {/* Popup Buttons */}
                { isHomePage ? 
                <> 
                    { publicFacility.hasConsumptionData &&
                    <Tippy content="mostra el consum d'energia">
                        <IconButton className='popup-icon-button' onClick={() => { handleChartClick(CONSUMPTION) }}>
                            <img className='popup-icon' src={icons.consum} alt='icon_btn' />
                        </IconButton> 
                    </Tippy> }
                    { publicFacility.hasPriceData &&
                    <Tippy content="mostra el cost d'energia">
                        <IconButton className='popup-icon-button' onClick={() => { handleChartClick(PRICE) }}>
                            <img className='popup-icon' src={icons.cost} alt='icon_btn' />
                        </IconButton> 
                    </Tippy> }
                    { publicFacility.hasConsumptionData && area > 0 && 
                    <Tippy content="mostra els indicadors d'energia">
                        <IconButton className='popup-icon-button' onClick={() => { handleChartClick(AREA) }}>
                            <img className='popup-icon' src={icons.indicadors} alt='icon_btn' />
                        </IconButton> 
                    </Tippy> }
                    { userCanEdit() && 
                    <Tippy content="edita l'equipament">
                        <IconButton className='popup-icon-button' onClick={() => { handleEditClick() }}>
                            <img className='popup-icon' src={icons.editar} alt='icon_btn' />
                        </IconButton> 
                    </Tippy> }
                </>
                : <div className='popup-button-div'>
                    { !ids.includes(id) && (dataType != AREA || area > 0) && 
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
