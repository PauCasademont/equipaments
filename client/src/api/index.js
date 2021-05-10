import axios from 'axios';

import { USER_STORAGE } from '../constants';

//const API = axios.create({ baseURL: 'https://consum-equipaments-publics.herokuapp.com' });
const API = axios.create({ baseURL: 'http://localhost:5000' });


API.interceptors.request.use((req) => {
    if (localStorage.getItem(USER_STORAGE)) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem(USER_STORAGE)).token}`;
    }
    return req;
})

export const req_getMapPublicFacilities = () => API.get('/public_facility');
export const req_getInvisiblePublicFacilities = () => API.get('/public_facility/invisible');
export const req_getPublicFacilityData = (id) => API.get(`/public_facility/${id}`);
export const req_getPublicFacilityField = (id, field) => API.get(`/public_facility/${id}/${field}`);
export const req_getTypologyAverage = (dataType, typology) => API.get(`/public_facility/average/${dataType}/${typology}`);
export const req_getTypologyFacilities = (typology) => API.get(`/public_facility/typology/${typology}`);

export const req_importData = (body) => API.post('/public_facility/import', body);

export const req_updatePublicFacility = (id, body) => API.patch(`/public_facility/${id}`, body); 
export const req_updateCoordinates = (id, body) =>  API.patch(`/public_facility/coordinates/${id}`, body);

export const req_signin = (form) => API.post('/user/signin', form);
