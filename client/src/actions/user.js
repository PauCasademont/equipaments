import * as api from '../api/index.js';
import { createAlert } from './utils';

const arrayStringToFloat = (arr) => {
    return arr.map( value => {
        const float = parseFloat(value);
        return float ? float : 0;
    });
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

export const importDataFromCSV = async (strFile) => {
    const startIndex = strFile.indexOf('\n');

    const nColumns = strFile.slice(0, startIndex).split(';').length;
    if (nColumns != 29){
        createAlert('Error a l\'importar dades', 'El format del fitxer no és correcte');
    }

    const rows = strFile.slice(startIndex + 1).split('\n');
    rows.forEach(row => {
        if (row != ''){
            const values = row.split(';');
            const newData = {
                name: values[1],
                typology: values[2],
                concept: values[0],
                consumption: arrayStringToFloat(values.slice(5, 17)),
                price: arrayStringToFloat(values.slice(17)),
            }
            console.log(newData);
        }
    });
}