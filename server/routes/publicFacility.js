import express from 'express';

import { 
    createPublicFacility, 
    getPublicFalcilities, 
    getPublicFacilityData 
} from '../controllers/publicFacility.js';

const router = express.Router();

router.post('/', createPublicFacility);
router.get('/', getPublicFalcilities);
router.get('/:id', getPublicFacilityData);

export default router;