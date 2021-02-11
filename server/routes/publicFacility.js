import express from 'express';

import { createPublicFacility } from '../controllers/publicFacility.js';

const router = express.Router();

router.post('/', createPublicFacility);

export default router;