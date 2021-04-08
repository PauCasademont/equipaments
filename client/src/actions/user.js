import swal from 'sweetalert';

import * as api from '../api/index.js';

const createAlert = (title, text, icon="error", button="ok") => {
    swal({ title, text, icon, button });
}

export const signin =  async (form, router) => {
    try {
        const { data } = await api.req_signin(form); 
        localStorage.setItem('profile', JSON.stringify(data.result))       
        router.push('/');
    } catch (error){       
        console.log(error);
        const message = error.response?.data?.clientMessage || 'Error no identificat';
        createAlert('Error', message);
    }
}