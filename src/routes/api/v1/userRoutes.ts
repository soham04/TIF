import express from 'express';
const router = express.Router();

import signUp from '../../../controllers/userController/signUp-controller';
import signIn from '../../../controllers/userController/signIn-controller';
import getMe from '../../../controllers/userController/getMe-controller';

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/me', getMe);

export default router;