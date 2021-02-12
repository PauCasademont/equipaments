import axios from 'axios';

const url = 'http://localhost:5000';

export const req_getPublicFacilities = () => axios.get(`${url}/public_facility`);