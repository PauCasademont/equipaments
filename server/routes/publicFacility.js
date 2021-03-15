import express from 'express';

import { 
    createPublicFacility, 
    getPublicFalcilities, 
    getPublicFacilityData,
    getTypologyAverage
} from '../controllers/publicFacility.js';

const router = express.Router();

router.post('/', createPublicFacility);
router.get('/', getPublicFalcilities);
router.get('/:id', getPublicFacilityData);
router.get('/average/:type/:typology', getTypologyAverage);

export default router;