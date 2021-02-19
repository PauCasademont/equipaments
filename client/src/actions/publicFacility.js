import * as api from '../api/index.js';

export const getPublicFalcilities =  async () => {
    try {
        return await api.req_getPublicFacilities();
    } catch (error){
        console.log(error);
    }
}

export const getPublicFacilityData = async (id) => {
    try {
        return await api.req_getPublicFacilityData(id)
    } catch (error) {
        console.log(error)
    }
}