import swal from 'sweetalert';

export const createAlert = (title, text='', icon='error', button='ok') => {
    swal({ title, text, icon, button });
}