import express from 'express';
const router = express.Router();

import createRole from '../../../controllers/roleController/create-controller';
import getAllRoles from '../../../controllers/roleController/getAll-controller';

router.post('/', createRole);
router.get('/', getAllRoles);

export default router;
