import express from 'express';

import { createPublicFacility, getPublicFalcilities } from '../controllers/publicFacility.js';

const router = express.Router();

router.post('/', createPublicFacility);
router.get('/', getPublicFalcilities);

export default router;