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
    getInvisiblePublicFacilities
} from '../controllers/publicFacility.js';

const router = express.Router();

router.get('/', getMapPublicFalcilities);
router.get('/invisible', getInvisiblePublicFacilities);
router.get('/:id', getPublicFacilityData);
router.get('/:id/:fields', getPublicFacilityField);
router.get('/average/:data_type/:typology', getTypologyAverage);

router.post('/', createPublicFacility);
router.post('/import', auth, importData);

router.patch('/:id', auth, updatePublicFaility);
router.patch('/coordinates/:id', auth, updateCoordinates);

export default router;