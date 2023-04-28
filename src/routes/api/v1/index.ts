import express from 'express';
const router = express.Router();

import userRoutes from './userRoutes';
import communityRoutes from './communityRoutes';
import memberRoutes from './memberRoutes';
import roleRoutes from './roleRoutes';

router.use('/auth', userRoutes);
router.use('/community', communityRoutes);
router.use('/member', memberRoutes);
router.use('/role', roleRoutes);

export default router
