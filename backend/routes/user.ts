import { Router } from 'express';
import { registerUser, loginUser, isLoggedIn } from '../controllers/user';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/isLoggedIn', isLoggedIn)

export default router;