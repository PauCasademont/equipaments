import express from 'express';

import auth from '../middleware/auth.js';
import { 
    createPublicFacility, 
    updatePublicFaility,
    getPublicFalcilities, 
    getPublicFacilityData,
    getPublicFacilityField,
    getTypologyAverage
} from '../controllers/publicFacility.js';

const router = express.Router();

router.post('/', createPublicFacility);
router.get('/', getPublicFalcilities);
router.patch('/:id', auth, updatePublicFaility);
router.get('/:id', getPublicFacilityData);
router.get('/:id/:field', getPublicFacilityField);
router.get('/average/:type/:typology', getTypologyAverage);

export default router;