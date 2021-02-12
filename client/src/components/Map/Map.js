import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import './Map.css';
import { getPublicFalcilities } from '../../actions/publicFacility';

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
                    <Popup>
                        {name} <br /> Tipologia: {typology} <br /> {area ? `Superficie: ${area}` : ''}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>  
    )
}

export default Map
