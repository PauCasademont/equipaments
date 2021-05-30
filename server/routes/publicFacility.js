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
    getInvisiblePublicFacilities,
    getTypologyFacilities,
    getPublicFacilitiesNames,
    deletePublicFacility
} from '../controllers/publicFacility.js';

const router = express.Router();

router.get('/', getMapPublicFalcilities);
router.get('/invisible', getInvisiblePublicFacilities);
router.get('/names', getPublicFacilitiesNames);
router.get('/:id', getPublicFacilityData);
router.get('/typology/:typology', getTypologyFacilities);
router.get('/:id/:field', getPublicFacilityField);

router.post('/', auth, createPublicFacility);
router.post('/import', auth, importData);

router.patch('/:id', auth, updatePublicFaility);
router.patch('/coordinates/:id', auth, updateCoordinates);

router.delete('/:id', auth, deletePublicFacility)


export default router;