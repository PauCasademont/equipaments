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

export const inRangeLatitude = (num) => {
    return num >= -90 && num <= 90
}

export const inRangeLongitude = (num) => {
    return num >= -180 && num <= 180
}