import { Router } from 'express';
import { registerUser, loginUser, isLoggedIn, logout } from '../controllers/user';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/isLoggedIn', isLoggedIn);
router.get('/logout', logout);

export default router;