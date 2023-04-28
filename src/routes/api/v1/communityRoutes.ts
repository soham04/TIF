import express from 'express';
const router = express.Router();

import create from '../../../controllers/communityController/create-controller'
import getAll from '../../../controllers/communityController/get-all-controller'
import getAllMember from '../../../controllers/communityController/get-all-members-controller'
import getMyOwned from '../../../controllers/communityController/get-my-owned-controller'
import getMyJoined from '../../../controllers/communityController/get-my-joined-controller'

router.post('/', create);
router.get('/', getAll);
router.get('/:id/members', getAllMember);
router.get('/me/owner', getMyOwned);
router.get('/me/member', getMyJoined);

export default router