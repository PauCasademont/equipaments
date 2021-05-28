import express from 'express';

import auth from '../middleware/auth.js';
import { 
    signin, 
    signup, 
    changePassword, 
    getUsersNames, 
    getUserField,
    addUserFacility,
    removeUserFacility,
    adminChangePassword,
    adminChangeUsername,
    deleteUser
} from '../controllers/user.js';

const router = express.Router();

router.get('/names', getUsersNames);
router.get('/:id/:field', getUserField);

router.post('/signup', auth, signup);
router.post('/signin', signin);

router.patch('/password/:id', auth, changePassword);
router.patch('/add_facility/:id', auth, addUserFacility);
router.patch('/remove_facility/:id', auth, removeUserFacility);
router.patch('/admin/username/:id', auth, adminChangeUsername);
router.patch('/admin/password/:id', auth, adminChangePassword);

router.delete('/:id', auth, deleteUser);

export default router;