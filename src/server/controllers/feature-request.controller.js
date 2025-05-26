// src/server/controllers/feature-request.controller.js
import BaseController from './base.controller.js';
import { FeatureRequestService, AppService } from '../services/_index.js';
import HttpError from '../utils/HttpError.js';

class FeatureRequestController extends BaseController {
  constructor() {
    super(FeatureRequestService);
    this.appService = AppService;
  }

  // Create feature request from widget (with API key validation)
  createFromWidget = async (req, res, next) => {
    try {
      const apiKey = req.headers['x-api-key'];
      const { userInfo, ...requestData } = req.body;

      if (!apiKey) {
        return next(new HttpError(400, 'API key is required'));
      }

      if (!userInfo || !userInfo.userId || !userInfo.userName || !userInfo.email) {
        return next(new HttpError(400, 'User info (userId, userName, email) is required'));
      }

      // Validate API key and get app
      const app = await this.appService.findByApiKey(apiKey);
      if (!app) {
        return next(new HttpError(401, 'Invalid API key'));
      }

      const data = await this.service.createRequest(requestData, app._id, userInfo);

      res.status(201).json({
        status: 'OK',
        message: 'Feature request created successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  // Create feature request by admin
  createByAdmin = async (req, res, next) => {
    try {
      const { username } = req.admin; // From auth middleware
      const { appId, ...requestData } = req.body;

      if (!appId) {
        return next(new HttpError(400, 'App ID is required'));
      }

      const data = await this.service.createAdminRequest(requestData, appId, username);

      res.status(201).json({
        status: 'OK',
        message: 'Feature request created by admin successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get requests by app (for widget)
  getByApp = async (req, res, next) => {
    try {
      const apiKey = req.headers['x-api-key'];
      const { page, limit, status } = req.query;

      if (!apiKey) {
        return next(new HttpError(400, 'API key is required'));
      }

      // Validate API key and get app
      const app = await this.appService.findByApiKey(apiKey);
      if (!app) {
        return next(new HttpError(401, 'Invalid API key'));
      }

      const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
      };

      let result;
      if (status) {
        result = await this.service.getRequestsByStatus(app._id, status, options);
      } else {
        result = await this.service.getRequestsByApp(app._id, options);
      }

      res.status(200).json({
        status: 'OK',
        message: 'Requests retrieved successfully',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get requests grouped by status (for admin Kanban)
  getGroupedByStatus = async (req, res, next) => {
    try {
      const { appId } = req.params;

      if (!appId) {
        return next(new HttpError(400, 'App ID is required'));
      }

      const data = await this.service.getRequestsGroupedByStatus(appId);

      res.status(200).json({
        status: 'OK',
        message: 'Requests grouped by status retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  // Upvote request (from widget)
  upvote = async (req, res, next) => {
    try {
      const { id } = req.params;
      const apiKey = req.headers['x-api-key'];
      const { userInfo } = req.body;

      if (!apiKey) {
        return next(new HttpError(400, 'API key is required'));
      }

      if (!userInfo || !userInfo.userId || !userInfo.userName || !userInfo.email) {
        return next(new HttpError(400, 'User info is required'));
      }

      // Validate API key
      const isValidKey = await this.appService.validateApiKey(apiKey);
      if (!isValidKey) {
        return next(new HttpError(401, 'Invalid API key'));
      }

      const data = await this.service.upvoteRequest(id, userInfo.userId, userInfo.userName, userInfo.email);

      res.status(200).json({
        status: 'OK',
        message: 'Vote updated successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  // Add comment (from widget or admin)
  addComment = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { content, images = [], userInfo, isAdmin = false } = req.body;

      if (!content) {
        return next(new HttpError(400, 'Comment content is required'));
      }

      let commentData = {
        content,
        images,
        isAdmin: false,
      };

      if (isAdmin && req.admin) {
        const adminUsername = req.admin.username;

        // Admin comment
        commentData = {
          content,
          images,
          author: {
            userId: `admin_${adminUsername}`,
            userName: `Admin: ${adminUsername}`,
            email: `${adminUsername}@admin.system`,
          },
          isAdmin: true,
          adminUsername,
        };
      } else {
        // Regular user comment (from widget)
        const apiKey = req.headers['x-api-key'];

        if (!apiKey) {
          return next(new HttpError(400, 'API key is required'));
        }

        if (!userInfo || !userInfo.userId || !userInfo.userName || !userInfo.email) {
          return next(new HttpError(400, 'User info is required'));
        }

        // Validate API key
        const isValidKey = await this.appService.validateApiKey(apiKey);
        if (!isValidKey) {
          return next(new HttpError(401, 'Invalid API key'));
        }

        commentData.author = userInfo;
      }

      const data = await this.service.addComment(id, commentData);

      res.status(200).json({
        status: 'OK',
        message: 'Comment added successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  // Update status (admin only)
  updateStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, assignedTo, releaseDate } = req.body;

      if (!status) {
        return next(new HttpError(400, 'Status is required'));
      }

      const updateData = { status };
      if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
      if (releaseDate !== undefined) updateData.releaseDate = releaseDate;

      const data = await this.service.updateById(id, updateData);

      if (!data) {
        return next(new HttpError(404, 'Request not found'));
      }

      res.status(200).json({
        status: 'OK',
        message: 'Status updated successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  // Assign task to developer (admin only)
  assignTask = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { assignedTo } = req.body;

      if (!assignedTo) {
        return next(new HttpError(400, 'Assigned developer name is required'));
      }

      const data = await this.service.assignTask(id, assignedTo);

      if (!data) {
        return next(new HttpError(404, 'Request not found'));
      }

      res.status(200).json({
        status: 'OK',
        message: 'Task assigned successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  // Set release date (admin only)
  setReleaseDate = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { releaseDate } = req.body;

      if (!releaseDate) {
        return next(new HttpError(400, 'Release date is required'));
      }

      const data = await this.service.updateById(id, { releaseDate: new Date(releaseDate) });

      if (!data) {
        return next(new HttpError(404, 'Request not found'));
      }

      res.status(200).json({
        status: 'OK',
        message: 'Release date set successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  // Search requests (admin)
  search = async (req, res, next) => {
    try {
      const { appId, q: searchQuery, page, limit } = req.query;

      if (!appId || !searchQuery) {
        return next(new HttpError(400, 'App ID and search query are required'));
      }

      const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
      };

      const result = await this.service.searchRequests(appId, searchQuery, options);

      res.status(200).json({
        status: 'OK',
        message: 'Search completed successfully',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get popular requests (widget)
  getPopular = async (req, res, next) => {
    try {
      const apiKey = req.headers['x-api-key'];
      const { limit } = req.query;

      if (!apiKey) {
        return next(new HttpError(400, 'API key is required'));
      }

      // Validate API key and get app
      const app = await this.appService.findByApiKey(apiKey);
      if (!app) {
        return next(new HttpError(401, 'Invalid API key'));
      }

      const result = await this.service.getPopularRequests(app._id, parseInt(limit) || 10);

      res.status(200).json({
        status: 'OK',
        message: 'Popular requests retrieved successfully',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  // Bulk update requests (admin only) - for drag & drop
  bulkUpdateStatus = async (req, res, next) => {
    try {
      const { updates } = req.body; // Array of {id, status, assignedTo?, releaseDate?}

      if (!updates || !Array.isArray(updates)) {
        return next(new HttpError(400, 'Updates array is required'));
      }

      const promises = updates.map(async (update) => {
        const { id, ...updateData } = update;
        return await this.service.updateById(id, updateData);
      });

      const results = await Promise.all(promises);

      res.status(200).json({
        status: 'OK',
        message: 'Bulk update completed successfully',
        data: results,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new FeatureRequestController();
