import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
    return req;
})

export const req_getPublicFacilities = () => API.get('/public_facility');
export const req_getPublicFacilityData = (id) => API.get(`/public_facility/${id}`);
export const req_updatePublicFacility = (id, body) => API.patch(`/public_facility/${id}`, body); 
export const req_getPublicFacilityField = (id, field) => API.get(`/public_facility/${id}/${field}`);
export const req_importData = (body) => API.post('/public_facility/import', body);

export const req_signin = (form) => API.post('/user/signin', form);
