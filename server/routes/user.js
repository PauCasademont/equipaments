//Users collection routes. Use auth to check users permissons
import express from 'express';

import auth from '../middleware/auth.js';
import { addUserToFacility, removeUserFromFacility, updateUsernamesFromFacilities } from '../controllers/publicFacility.js';
import { 
    signin, 
    signup, 
    changePassword, 
    getUsersNames, 
    getUserField,
    addFacilityToUser,
    removeFacilityFromUser,
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
router.patch('/add_facility/:id', auth, addFacilityToUser, addUserToFacility);
router.patch('/remove_facility/:id', auth, removeFacilityFromUser, removeUserFromFacility);
router.patch('/admin/username/:id', auth, adminChangeUsername, updateUsernamesFromFacilities);
router.patch('/admin/password/:id', auth, adminChangePassword);

router.delete('/:id', auth, deleteUser);

export default router;