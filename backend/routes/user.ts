import { Router } from 'express';
import { registerUser, loginUser, isLoggedIn, logout, auth, profile } from '../controllers/user';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/isLoggedIn', isLoggedIn);
router.get('/logout', logout);
router.get('/profile', auth, profile);

export default router;