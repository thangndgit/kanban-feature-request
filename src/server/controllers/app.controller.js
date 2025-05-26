// src/server/controllers/app.controller.js
import BaseController from './base.controller.js';
import { AppService } from '../services/_index.js';
import { HttpError } from '../utils/_index.js';

class AppController extends BaseController {
  constructor() {
    super(AppService);
  }

  // Override create to add admin context
  create = async (req, res, next) => {
    try {
      const { username } = req.admin; // From auth middleware
      const data = await this.service.createApp(req.body, username);

      res.status(201).json({
        status: 'OK',
        message: 'App created successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  // Validate API key (used by widget)
  validateApiKey = async (req, res, next) => {
    try {
      const { apiKey } = req.body;

      if (!apiKey) {
        return next(new HttpError(400, 'API key is required'));
      }

      const app = await this.service.findByApiKey(apiKey);

      if (!app) {
        return next(new HttpError(401, 'Invalid API key'));
      }

      res.status(200).json({
        status: 'OK',
        message: 'API key is valid',
        data: {
          appId: app._id,
          appName: app.name,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // Toggle app status (activate/deactivate)
  toggleStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      if (typeof isActive !== 'boolean') {
        return next(new HttpError(400, 'isActive must be a boolean'));
      }

      const data = await this.service.toggleAppStatus(id, isActive);

      if (!data) {
        return next(new HttpError(404, 'App not found'));
      }

      res.status(200).json({
        status: 'OK',
        message: `App ${isActive ? 'activated' : 'deactivated'} successfully`,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  // Regenerate API key
  regenerateApiKey = async (req, res, next) => {
    try {
      const { id } = req.params;

      console.log('regenerateApiKey', id);
      const data = await this.service.regenerateApiKey(id);

      if (!data) {
        return next(new HttpError(404, 'App not found'));
      }

      res.status(200).json({
        status: 'OK',
        message: 'API key regenerated successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get app by API key (for widget use)
  getByApiKey = async (req, res, next) => {
    try {
      const apiKey = req.headers['x-api-key'];

      if (!apiKey) {
        return next(new HttpError(400, 'API key is required in headers'));
      }

      const app = await this.service.findByApiKey(apiKey);

      if (!app) {
        return next(new HttpError(401, 'Invalid API key'));
      }

      res.status(200).json({
        status: 'OK',
        message: 'App retrieved successfully',
        data: {
          appId: app._id,
          appName: app.name,
          description: app.description,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new AppController();

