import axios from 'axios';

import { USER_STORAGE } from '../constants';

//API instance using axios
// const API = axios.create({ baseURL: 'http://localhost:5000' });
const API = axios.create({ baseURL: 'https://consum-equipaments-publics.herokuapp.com/' });

//Add JWT in API request headers if exist
API.interceptors.request.use((req) => {
    if (localStorage.getItem(USER_STORAGE)) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem(USER_STORAGE)).token}`;
    }
    return req;
})

//***************************  Public Facility requests *******************************//

export const req_getMapPublicFacilities = () => API.get('/public_facility');
export const req_getInvisiblePublicFacilities = () => API.get('/public_facility/invisible');
export const req_getPublicFacilityData = (id) => API.get(`/public_facility/${id}`);
export const req_getPublicFacilityField = (id, field) => API.get(`/public_facility/${id}/${field}`);
export const req_getTypologyAverage = (dataType, typology) => API.get(`/public_facility/average/${dataType}/${typology}`);
export const req_getTypologyFacilities = (typology) => API.get(`/public_facility/typology/${typology}`);
export const req_getPublicFacilitiesNames = () => API.get('/public_facility/names');

export const req_createPublicFacility = (body) => API.post('/public_facility', body); 
export const req_importData = (body) => API.post('/public_facility/import', body);

export const req_updatePublicFacility = (id, body) => API.patch(`/public_facility/${id}`, body); 
export const req_updateCoordinates = (id, body) =>  API.patch(`/public_facility/coordinates/${id}`, body);

export const req_deletePublicFacility = (id) => API.delete(`/public_facility/${id}`);


//***************************  User request *******************************//

export const req_getUsersNames = () => API.get('/user/names');
export const req_getUserField = (id, field) => API.get(`/user/${id}/${field}`);

export const req_signin = (body) => API.post('/user/signin', body);
export const req_signup = (body) => API.post('/user/signup', body);

export const req_changePassword = (body, id) => API.patch(`/user/password/${id}`, body);
export const req_addUserfacility = (body, id) => API.patch(`/user/add_facility/${id}`, body);
export const req_removeUserfacility = (body, id) => API.patch(`/user/remove_facility/${id}`, body);
export const req_adminChangeUsername = (body, id) => API.patch(`/user/admin/username/${id}`, body);
export const req_adminChangePassword = (body, id) => API.patch(`/user/admin/password/${id}`, body);

export const req_deleteUser = (id) => API.delete(`/user/${id}`);
