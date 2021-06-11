import { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useHistory, useLocation } from 'react-router-dom';
import { CircularProgress, Typography } from '@material-ui/core';
import decode from 'jwt-decode';

import './Map.css';
import UserMenu from './UserMenu/UserMenu';
import 'leaflet/dist/leaflet.css';
import { getMapPublicFalcilities } from '../../actions/publicFacility';
import CustomMarker from './CustomMarker/CustomMarker';
import FilterControl from './FilterControl/FilterControl';
import ImportData from '../Admin/ImportData/ImportData';
import { TYPOLOGIES, USER_STORAGE, YEARS_LIST } from '../../constants';

const INITIAL_MAP_CONFIG = { center: [41.98311, 2.82493], zoom: 14 }

function getIcons() {
    //Return object. Keys are icons names and values are the icon path
    const req = require.context('../../images', false, /.*\.png$/);
    let res = {}
    req.keys().map((key) => {
        res[key.replace('./', '').replace('.png', '')] = req(key).default;
    })
    return res;
}

function Map({ ids = [], displayedDatasets = [] }) {
//Return home page

    //Facilities list
    const [publicFacilities, setPublicFacilities] = useState(null);

    //Lists of filters
    const [filters, setFilters] = useState({
        typologies: TYPOLOGIES.map(typology => typology.name),
        years: YEARS_LIST
    });
    const [satelliteView, setSatelliteView] = useState(false);
    const [openPopup, setOpenPopup] = useState(
        { importData: 
            { 
                open: false,
                fileName: '',
                strFile: ''
            }
        }
    );
    const user = JSON.parse(localStorage.getItem(USER_STORAGE));
    const icons = getIcons();
    const router = useHistory();
    const location = useLocation();

    //If is the map to add facility to the chart, ids will contain the chart facilities ids
    const isHomePage = ids.length == 0;

    useEffect(() => {
    //Get facilities data when the page is loaded
        getMapPublicFalcilities()
            .then((facilities) => {
                setPublicFacilities(facilities);
            })
            .catch((error) => { console.log(error) });
    }, []);

    useEffect(() => {
    //Logout the user when his token gets expired
        const token = user?.token;

        if (token) {
            const decodedToken = decode(token);
            if (decodedToken.exp - (Date.now() / 1000) < 0) {
                localStorage.removeItem(USER_STORAGE);
                window.location.reload(false);
            }
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
        publicFacilities ?
        <>
            <MapContainer                
                center={INITIAL_MAP_CONFIG.center}
                zoom={INITIAL_MAP_CONFIG.zoom}
                scrollWheelZoom={true}
            >
                { satelliteView && 
                    <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png"
                        attribution='&copy; <a href="Esri &mdash">Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community</a> contributors'
                    /> 
                }
                { !satelliteView &&
                    <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />                
                }
            
                { publicFacilities && publicFacilities.map(publicFacility => (
                    filters.typologies.includes(publicFacility.typology) &&
                    hasFilteredYear(publicFacility.years) &&
                    <CustomMarker
                        key={publicFacility.id}
                        publicFacility={publicFacility}
                        userFacilityIds={user?.isAdmin ? 'ALL' : user?.publicFacilityIds}
                        ids={ids}
                        displayedDatasets={displayedDatasets}
                        icons={icons}
                        router={router}
                    />
                ))}
                {/* User avatar */}
                { user && isHomePage && <UserMenu user={user} router={router} setOpenPopup={setOpenPopup}/> }
                {/* Map legend */}
                <FilterControl 
                    filters={filters} 
                    setFilters={setFilters}
                    satelliteView={satelliteView}
                    setSatelliteView={setSatelliteView}
                    icons={icons}
                />
            </MapContainer>
            {/* Import data popup */}
            { openPopup.importData?.open &&
                <ImportData fileData={openPopup.importData} setOpenPopup={setOpenPopup} />
            }
        </>
        :
        // If public Facilities are loading
        <div className='map-loading-div'>
            <Typography variant='h5' className='map-loading-text' color='primary'>
                Carregant...
            </Typography>
            <CircularProgress />
        </div>
    )
}

export default Map
