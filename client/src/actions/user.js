import * as api from '../api/index.js';
import { createAlert, hasNumber } from './utils';
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

export const changePassword = async (form, router) => {
    if(form.newPassword.length < 8 || !hasNumber(form.newPassword)){
        createAlert('Error', 'La contrasenya és massa dèbil. Ha de contenir com a mínim 8 caracters amb 1 dígit, 0-9');
        return;
    }

    if(form.newPassword != form.confirmNewPassword){
        createAlert('Error', 'Les contrasenyes no coincideixen');
        return;
    }

    const body = {
        current_password: form.currentPassword,
        new_password: form.newPassword
    }

    try {
        await api.req_changePassword(body);
        router.push('/');
        createAlert('', 'Contrasenya guardada correctament', 'success');       
    } catch (error) {
        console.log(error);
        const message = error.response?.data?.clientMessage || 'Error no identificat';
        createAlert('Error', message);
    }
}
