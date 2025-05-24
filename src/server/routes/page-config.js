import express from 'express';
import { pageConfigController } from '../controllers/index.js';
import { requireRoles } from '../middlewares/require-roles.js';

const router = express.Router();

router.get('/', pageConfigController.get);
router.put('/', requireRoles('ADMIN'), pageConfigController.upsert);

export default router;
