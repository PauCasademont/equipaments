import swal from 'sweetalert';

export const createAlert = (title, text='', icon='error', button='ok') => {
    swal({ title, text, icon, button });
}

export const arrayStringToFloat = (arr) => {
    return arr.map( value => {
        const float = parseFloat(value);
        return float ? float : 0;
    });
}