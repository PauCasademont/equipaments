import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, LayersControl, LayerGroup } from 'react-leaflet';
import { useHistory } from 'react-router-dom';

import './Map.css';
import 'leaflet/dist/leaflet.css';
import { getPublicFalcilities } from '../../actions/publicFacility';
import CustomMarker from './CustomMarker/CustomMarker';
import { TYPOLOGIES } from '../../constants';

const INITIAL_MAP_CONFIG = {center: [41.98311,2.82493], zoom: 14}

function getIcons() {
    const req = require.context('../../images', false, /.*\.png$/);
    let res = {}
    req.keys().map((key) => { 
        res[key.replace('./', '').replace('.png', '')] = req(key).default; 
    })   
    return res;
}

function Map({ids = [] }) {
    const [publicFacilities, setPublicFacilities] = useState(null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))
    const icons = getIcons();
    const router = useHistory();

    useEffect(() => {       
        getPublicFalcilities()
            .then((groupedByTypology) => {                                 
                setPublicFacilities(groupedByTypology);
            })
            .catch((error) => {console.log(error)});        
    }, []);

    return (
        <MapContainer 
            center={INITIAL_MAP_CONFIG.center} 
            zoom={INITIAL_MAP_CONFIG.zoom} 
            scrollWheelZoom={true} 
        >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />     
            <LayersControl position='topright'>
                { publicFacilities && TYPOLOGIES.map((typology, index) => (                    
                    <LayersControl.Overlay key={index} checked name={typology.name}>
                        <LayerGroup>
                            {publicFacilities[typology.icon]?.map((publicFacility) => (                
                                <CustomMarker 
                                    key={publicFacility._id} 
                                    publicFacility={publicFacility}
                                    userFacilityId={user.publicFacilityId}
                                    ids={ids} 
                                    icons={icons} 
                                    router={router}
                                />
                            ))}  
                        </LayerGroup>
                    </LayersControl.Overlay>
                ))}
            </LayersControl>                    
        </MapContainer>  
    )
}

export default Map
