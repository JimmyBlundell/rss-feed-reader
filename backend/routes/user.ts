import { Router } from 'express';
import { registerUser, loginUser, isLoggedIn, logOut } from '../controllers/user';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/isLoggedIn', isLoggedIn);
router.get('/logOut', logOut);

export default router;