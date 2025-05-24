import { PageConfig } from '../models/index.js';
import HttpError from '../utils/HttpError.js';

export default {
  get: async (req, res, next) => {
    try {
      const isDev = req.query.isDev === 'true';

      let pageConfig = await PageConfig.findOne({ isDev });

      if (!pageConfig) {
        pageConfig = await PageConfig.create({
          isDev,
          showHeader: true,
          showContent: true,
          showFooter: true,
          pageJS: '',
          pageCSS: '',
          pageHTML: '',
        });
      }

      res.status(200).json({
        status: 'OK',
        data: pageConfig,
      });

      //
    } catch (error) {
      next(new HttpError(500, 'Failed to get page configuration'));
    }
  },

  upsert: async (req, res, next) => {
    try {
      const upsertData = req.body;
      delete upsertData._id;

      const updatedPageConfig = await PageConfig.findOneAndUpdate({ isDev: upsertData.isDev }, req.body, {
        new: true,
        upsert: true,
      });

      res.status(200).json({
        status: 'OK',
        data: updatedPageConfig,
      });
    } catch (error) {
      next(new HttpError(500, 'Failed to upsert page configuration'));
    }
  },
};
