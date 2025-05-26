// src/server/routes/feature-request.route.js
import express from 'express';
import { FeatureRequestController } from '../controllers/index.js';
import { requireRoles } from '../middlewares/require-roles.js';

const router = express.Router();

// Public routes (for widget) - require x-api-key header
router.post('/', FeatureRequestController.createFromWidget);
router.get('/', FeatureRequestController.getByApp);
router.get('/popular', FeatureRequestController.getPopular);
router.post('/:id/upvote', FeatureRequestController.upvote);
router.post('/:id/comments', FeatureRequestController.addComment);

// Admin routes (require authentication)
router.use(requireRoles(['ADMIN'])); // Apply auth middleware to all routes below

router.post('/admin-create', FeatureRequestController.createByAdmin);
router.get('/grouped/:appId', FeatureRequestController.getGroupedByStatus);
router.get('/search', FeatureRequestController.search);
router.get('/:id', FeatureRequestController.getById);
router.put('/:id', FeatureRequestController.updateById);
router.delete('/:id', FeatureRequestController.deleteById);
router.patch('/:id/status', FeatureRequestController.updateStatus);
router.patch('/:id/assign', FeatureRequestController.assignTask);
router.patch('/:id/release-date', FeatureRequestController.setReleaseDate);
router.patch('/bulk-update', FeatureRequestController.bulkUpdateStatus);

// Admin comment (different from widget comment)
router.post('/:id/admin-comments', (req, res, next) => {
  req.body.isAdmin = true;
  FeatureRequestController.addComment(req, res, next);
});

export default router;
