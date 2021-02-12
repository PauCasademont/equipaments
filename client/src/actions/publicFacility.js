import * as api from '../api/index.js';

export const getPublicFalcilities =  async () => {
    try {
        return await api.req_getPublicFacilities();
    } catch (error){
        console.log(error);
    }
}