import express from 'express';
import { AdminController } from '../controllers/_index.js';

const router = express.Router();

router.post('/login', AdminController.login);

export default router;

