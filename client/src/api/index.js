import axios from 'axios';

const url = 'http://localhost:5000';

export const req_getPublicFacilities = () => axios.get(`${url}/public_facility`);
export const req_getPublicFacilityData = (id) => axios.get(`${url}/public_facility/${id}`);
export const req_getPublicFacilityField = (id, field) => axios.get(`${url}/public_facility/${id}/${field}`);
