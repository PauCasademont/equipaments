import express from 'express';

import auth from '../middleware/auth.js';
import { 
    createPublicFacility, 
    updatePublicFaility,
    getPublicFalcilities, 
    getPublicFacilityData,
    importData,
    updateCoordinates
} from '../controllers/publicFacility.js';

const router = express.Router();

router.post('/', createPublicFacility);
router.get('/', getPublicFalcilities);
router.patch('/coordinates/:id', auth, updateCoordinates);
router.patch('/:id', auth, updatePublicFaility);
router.get('/:id', getPublicFacilityData);
router.post('/import', auth, importData);

export default router;