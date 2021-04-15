import * as api from '../api/index.js';
import { createAlert } from './utils';
import { USER_STORAGE } from '../constants';

export const signin =  async (form, router) => {
    try {
        const { data } = await api.req_signin(form); 
        localStorage.setItem(USER_STORAGE, JSON.stringify(data.result))       
        router.push('/');
    } catch (error){       
        console.log(error);
        const message = error.response?.data?.clientMessage || 'Error no identificat';
        createAlert('Error', message);
    }
}

