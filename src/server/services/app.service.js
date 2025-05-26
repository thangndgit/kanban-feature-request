import crypto from 'crypto';
import BaseService from './base.service.js';
import { AppModel } from '../models/_index.js';
import { VALIDATION } from '../constants/feature-request.js';

class AppService extends BaseService {
  constructor() {
    super(AppModel);
  }

  generateApiKey = () => {
    return crypto.randomBytes(VALIDATION.API_KEY_LENGTH / 2).toString('hex');
  };

  regenerateApiKey = async (id) => {
    const newApiKey = this.generateApiKey();
    return await this.updateById(id, { apiKey: newApiKey });
  };

  createApp = async (data) => {
    const apiKey = this.generateApiKey();

    const appData = { ...data, apiKey };

    return await this.create(appData);
  };

  findByApiKey = async (apiKey) => {
    return await this.findOne({ apiKey, isActive: true });
  };

  validateApiKey = async (apiKey) => {
    const app = await this.findByApiKey(apiKey);
    return !!app;
  };

  toggleAppStatus = async (id, isActive) => {
    return await this.updateById(id, { isActive });
  };
}

export default new AppService();

