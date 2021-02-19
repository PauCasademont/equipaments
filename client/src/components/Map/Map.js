import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, LayersControl, LayerGroup } from 'react-leaflet';
import groupBy from 'lodash.groupby';

import './Map.css';
import { getPublicFalcilities } from '../../actions/publicFacility';
import CustomMarker from './CustomMarker/CustomMarker';
import { typologies } from '../../constants/publicFacility.js';

const INITIAL_MAP_CONFIG = {center: [41.98311,2.82493], zoom: 14}

function getIcons() {
    const req = require.context('../../images', false, /.*\.png$/);
    let res = {}
    req.keys().map((key) => { 
        res[key.replace('./', '').replace('.png', '')] = req(key).default; 
    })   
    return res;
}

function Map() {
    const [map, setMap] = useState(null);
    const [publicFacilities, setPublicFacilities] = useState(null);
    const icons = getIcons();

    useEffect(() => {       
        getPublicFalcilities()
            .then((res) => {
                const groupedByTypology = groupBy(res.data.result, facility => facility.typology);                    
                setPublicFacilities(groupedByTypology);
            })
            .catch((error) => {console.log(error)});        
    }, []);
    

    return (
        <MapContainer center={INITIAL_MAP_CONFIG.center} zoom={INITIAL_MAP_CONFIG.zoom} scrollWheelZoom={true} whenCreated={setMap}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />     
            <LayersControl position='topright'>
                { publicFacilities && typologies.map((typology, index) => (                    
                    <LayersControl.Overlay key={index} checked name={typology.name}>
                        <LayerGroup>
                            {publicFacilities[typology.icon]?.map((publicFacility) => (                
                                <CustomMarker key={publicFacility._id} publicFacility={publicFacility} icons={icons} />
                            ))}  
                        </LayerGroup>
                    </LayersControl.Overlay>
                ))}
            </LayersControl>                    
        </MapContainer>  
    )
}

export default Map
