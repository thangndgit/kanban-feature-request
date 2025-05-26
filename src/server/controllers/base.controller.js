import HttpError from '../utils/HttpError.js';

class BaseController {
  constructor(service) {
    this.service = service;
  }

  create = async (req, res, next) => {
    try {
      const data = await this.service.create(req.body);
      res.status(201).json({
        status: 'OK',
        message: 'Created successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const { page, limit, sort, ...filter } = req.query;
      const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        sort: sort ? JSON.parse(sort) : { createdAt: -1 },
      };

      const result = await this.service.getAll(filter, options);
      res.status(200).json({
        status: 'OK',
        message: 'Retrieved successfully',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await this.service.getById(id);

      if (!data) {
        return next(new HttpError(404, 'Resource not found'));
      }

      res.status(200).json({
        status: 'OK',
        message: 'Retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  updateById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await this.service.updateById(id, req.body);

      if (!data) {
        return next(new HttpError(404, 'Resource not found'));
      }

      res.status(200).json({
        status: 'OK',
        message: 'Updated successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await this.service.deleteById(id);

      if (!data) {
        return next(new HttpError(404, 'Resource not found'));
      }

      res.status(200).json({
        status: 'OK',
        message: 'Deleted successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default BaseController;
