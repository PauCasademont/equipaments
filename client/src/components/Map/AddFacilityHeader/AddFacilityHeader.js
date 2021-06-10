import { Typography, Button } from '@material-ui/core';
import { ShowChart } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';

import './AddFacilityHeader.css';

function AddFacilityHeader() {
//Return the header for add facility to existing chart page

    const router = useHistory();

    return (
        <div className='addFacilityHeader'>
            <Typography variant='h5'>
                Selecciona l'equipament que vulguis afegir
            </Typography>
            <Button 
                className='addFacilityHeader-button'
                variant='outlined' 
                color='secondary' 
                onClick={() => router.goBack()}
            >
                Tornar
                <ShowChart className='addFacilityHeader-icon'/>
            </Button>
        </div>
    )
}

export default AddFacilityHeader
