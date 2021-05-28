import * as api from '../api/index.js';
import swal from 'sweetalert';

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

const checkPasswordsInputs = (password1, password2) => {
    if(password1.length < 8 || !hasNumber(password1)){
        createAlert('Error', 'La contrasenya és massa dèbil. Ha de contenir com a mínim 8 caracters amb 1 dígit, 0-9');
        return false;
    }

    if(password1 != password2){
        createAlert('Error', 'Les contrasenyes no coincideixen');
        return false;
    }
    return true;
}

export const signup = async (form) => {

    if(!checkPasswordsInputs(form.password, form.confirmPassword)) return;

    const body = {
        username: form.username,
        password: form.password
    };

    try {
        const { data } = await api.req_signup(body);
        createAlert('', `Usuari \'${form.username}\' guardat correctament`, 'success');
        return { 
            id: data.result._id, 
            name: data.result.username 
        };
    } catch (error) {
        console.log(error);
        const message = error.response?.data?.clientMessage || 'Error no identificat';
        createAlert('Error', message);
    }
}

export const deleteUser = async (userId, username) => {
    return await swal({
        title: 'Eliminar Usuari',
        text: `Estàs segur que desitges eliminar l\'usuari ${username}`,
        icon: 'warning',
        buttons: ['Cancelar', 'Eliminar']
    }).then(async (wantToDelete) =>  {
        if(wantToDelete){
            try {
                const { data } = await api.req_deleteUser(userId);
                createAlert('', 'Usuari eliminar correctament', 'success');
                console.log('data:', data);
                return data.result;
            } catch (error) {
                console.log(error);
                createAlert('Error', `No s\'ha pogut eliminar l\'usuari ${username}`);
            }
        }
        return null;
    })
}

export const changePassword = async (form, userId, router) => {

    if(!checkPasswordsInputs(form.newPassword, form.confirmNewPassword)) return;

    const body = {
        current_password: form.currentPassword,
        new_password: form.newPassword
    }

    try {
        await api.req_changePassword(body, userId);
        router.push('/');
        createAlert('', 'Contrasenya guardada correctament', 'success');       
    } catch (error) {
        console.log(error);
        const message = error.response?.data?.clientMessage || 'Error no identificat';
        createAlert('Error', message);
    }
}

export const adminChangePassword = async (form, userId) => {
    if(!checkPasswordsInputs(form.newPassword, form.confirmNewPassword)) return;

    const body = { new_password: form.newPassword };

    try {
        await api.req_adminChangePassword(body, userId);
        createAlert('', 'Contrasenya actualitzada correctament', 'success');
    } catch (error) {
        console.log(error);
        createAlert('Error', 'No s\'ha pogut actualitzar l\'usuari');
    }
}


export const adminChangeUsername = async (form, userId) => {

    if(!form.newUsername){
        createAlert('Error', 'Entra el nou nom de l\'usuari');
        return;
    }

    const body = { new_username: form.newUsername };

    try {
        const { data } = await api.req_adminChangeUsername(body, userId);
        createAlert('', 'Nom d\'usuari actualitzat correctament', 'success');
        return data.result;
    } catch (error) {
        console.log(error);
        createAlert('Error', 'No s\'ha pogut actualitzar l\'usuari');
    }
}


export const getUsersNames = async () => {
    const { data } = await api.req_getUsersNames();
    return data.result.map(user => ({ 
        id: user._id,
        name: user.username
    }));
}

export const getUserField = async (id, field) => {
    try {
        const { data } = await api.req_getUserField(id, field);
        return data.result[field];
    } catch (error) {
        console.log(error);
    }
}

export const addUserFacility = async (userId, facilityId) => {
    try {
        await api.req_addUserfacility({ facilityId }, userId);
        createAlert('', 'Equipamnet afegir correctament', 'success');
    } catch (error) {
        createAlert('', 'No s\'ha pogut afegir l\'equipament');
        console.log(error);
    }
}

export const removeUserFacility = async (userId, facilityId) => {
    try {
        await api.req_removeUserfacility({ facilityId }, userId);
        createAlert('', 'Equipamnet eliminat de l\'usuari correctament', 'success');
    } catch (error) {
        createAlert('', 'No s\'ha pogut eliminar l\'equipament');
        console.log(error);
    }
}