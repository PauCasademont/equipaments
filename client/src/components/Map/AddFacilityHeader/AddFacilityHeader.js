import { Typography, Button } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';

import './AddFacilityHeader.css';

function AddFacilityHeader() {
//Return the header for add facility to existing chart page

    const router = useHistory();

    return (
        <div className='addFacilityHeader'>
            <Typography variant='h6' color='primary'>
                Selecciona l'equipament que vulguis afegir
            </Typography>
            <Button 
                className='addFacilityHeader-button'
                variant='outlined' 
                color='primary' 
                onClick={() => router.goBack()}
            >
                <ArrowBack className='addFacilityHeader-icon'/>
                &nbsp; Tornar
            </Button>
        </div>
    )
}

export default AddFacilityHeader
