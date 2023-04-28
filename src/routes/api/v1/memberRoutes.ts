import express from 'express';
const router = express.Router();

import create from "../../../controllers/memberController/create-controller";
import remove from "../../../controllers/memberController/remove-controller";

router.post('/', create);
router.delete('/:id', remove);

export default router
