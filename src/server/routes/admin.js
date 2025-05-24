import express from 'express';
import { adminController } from '../controllers/index.js';

const router = express.Router();

router.post('/login', adminController.login);

export default router;
