import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

import './Map.css';

const INITIAL_MAP_CONFIG = {center: [41.98311,2.82493], zoom: 14}
const POSITIONS = [[41.983149,2.824774], [41.98422256,2.82645151], [41.998070,2.803530], [41.973036,2.842113]]

function Map() {
    return (                     
        <MapContainer center={INITIAL_MAP_CONFIG.center} zoom={INITIAL_MAP_CONFIG.zoom} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {POSITIONS.map((position, index) => (
                <Marker position={position} key={index}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            ))}
        </MapContainer>  
    )
}

export default Map
