import express from 'express';

import { 
    createPublicFacility, 
    getPublicFalcilities, 
    getPublicFacilityData, 
    getPublicFacilityName 
} from '../controllers/publicFacility.js';

const router = express.Router();

router.post('/', createPublicFacility);
router.get('/', getPublicFalcilities);
router.get('/:id', getPublicFacilityData);
router.get('/:id/name', getPublicFacilityName);

export default router;