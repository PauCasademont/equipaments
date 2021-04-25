import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, LayersControl, LayerGroup } from 'react-leaflet';
import { useHistory, useLocation } from 'react-router-dom';
import decode from 'jwt-decode';

import './Map.css';
import UserMenu from './UserMenu/UserMenu';
import 'leaflet/dist/leaflet.css';
import { getMapPublicFalcilities, getPublicFacilityYears } from '../../actions/publicFacility';
import CustomMarker from './CustomMarker/CustomMarker';
import FilterControl from './FilterControl/FilterControl';
import { TYPOLOGIES, USER_STORAGE, YEARS_LIST } from '../../constants';

const INITIAL_MAP_CONFIG = { center: [41.98311, 2.82493], zoom: 14 }

function getIcons() {
    const req = require.context('../../images', false, /.*\.png$/);
    let res = {}
    req.keys().map((key) => {
        res[key.replace('./', '').replace('.png', '')] = req(key).default;
    })
    return res;
}

function Map({ ids = [] }) {
    const [publicFacilities, setPublicFacilities] = useState(null);
    const [filters, setFilters] = useState({
        typologies: TYPOLOGIES.map(typology => typology.icon),
        years: YEARS_LIST
    })
    const [user, setUser] = useState(JSON.parse(localStorage.getItem(USER_STORAGE)));
    const icons = getIcons();
    const router = useHistory();
    const location = useLocation();

    useEffect(() => {
        getMapPublicFalcilities()
            .then((facilities) => {
                setPublicFacilities(facilities);
            })
            .catch((error) => { console.log(error) });
    }, []);

    useEffect(() => {
        const token = user?.token;

        if (token) {
            const decodedToken = decode(token);
            if (decodedToken.exp - (Date.now() / 1000) < 0) setUser(null);
        }
    }, [location]);

    const hasFilteredYear = (years) => {
        for (const year of years) {            
            if(filters.years.includes(year)) {
                return true;
            }
        };
        return false;
    }

    return (
        <MapContainer
            center={INITIAL_MAP_CONFIG.center}
            zoom={INITIAL_MAP_CONFIG.zoom}
            scrollWheelZoom={true}
        >
            {/* <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png"
                attribution='&copy; <a href="Esri &mdash">Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community</a> contributors'
             /> */}
             <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            /> 
           
            { publicFacilities && publicFacilities.map(publicFacility => (
                filters.typologies.includes(publicFacility.typology) &&
                hasFilteredYear(publicFacility.years) &&
                <CustomMarker
                    key={publicFacility.id}
                    publicFacility={publicFacility}
                    userFacilityId={user?.isAdmin ? 'ALL' : user?.publicFacilityId}
                    ids={ids}
                    icons={icons}
                    router={router}
                />
            ))}
            { user && <UserMenu user={user} router={router}/> }
            <FilterControl filters={filters} setFilters={setFilters}/>
        </MapContainer>
    )
}

export default Map
