import express from 'express';

import auth from '../middleware/auth.js';
import { 
    createPublicFacility, 
    updatePublicFaility,
    getMapPublicFalcilities, 
    getPublicFacilityData,
    importData,
    updateCoordinates,
    getPublicFacilityField,
    getTypologyAverage,
    getInvisiblePublicFacilities,
    getTypologyFacilities
} from '../controllers/publicFacility.js';

const router = express.Router();

router.get('/', getMapPublicFalcilities);
router.get('/invisible', getInvisiblePublicFacilities);
router.get('/:id', getPublicFacilityData);
router.get('/typology/:typology', getTypologyFacilities);
router.get('/:id/:field', getPublicFacilityField);
router.get('/average/:data_type/:typology', getTypologyAverage);

router.post('/', createPublicFacility);
router.post('/import', auth, importData);

router.patch('/:id', auth, updatePublicFaility);
router.patch('/coordinates/:id', auth, updateCoordinates);

export default router;