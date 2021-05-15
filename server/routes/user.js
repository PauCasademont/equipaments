import express from 'express';

import auth from '../middleware/auth.js';
import { signin, signup, changePassword} from '../controllers/user.js';

const router = express.Router();

router.post('/signup', signup)
router.post('/signin', signin);
router.post('/password', auth, changePassword)

export default router;