// src/server/routes/app.route.js
import express from 'express';
import { AppController } from '../controllers/index.js';
import { requireRoles } from '../middlewares/require-roles.js';

const router = express.Router();

// Public routes (for widget)
router.post('/validate-key', AppController.validateApiKey);
router.get('/info', AppController.getByApiKey); // Requires x-api-key header

// Admin routes (require authentication)
router.use(requireRoles('ADMIN')); // Apply auth middleware to all routes below

router.get('/', AppController.getAll);
router.post('/', AppController.create);
router.get('/my-apps', AppController.getMyApps);
router.get('/:id', AppController.getById);
router.put('/:id', AppController.updateById);
router.delete('/:id', AppController.deleteById);
router.patch('/:id/toggle-status', AppController.toggleStatus);
router.patch('/:id/regenerate-key', AppController.regenerateApiKey);

export default router;
