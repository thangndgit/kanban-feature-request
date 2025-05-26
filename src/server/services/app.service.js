// src/server/services/app.service.js
import crypto from 'crypto';
import BaseService from './base.service.js';
import { AppModel } from '../models/_index.js';
import { VALIDATION } from '../constants/feature-request.js';

class AppService extends BaseService {
  constructor() {
    super(AppModel);
  }

  async createApp(data, createdBy) {
    const apiKey = this.generateApiKey();

    const appData = {
      ...data,
      apiKey,
      createdBy,
    };

    return await this.create(appData);
  }

  async findByApiKey(apiKey) {
    return await this.findOne({ apiKey, isActive: true });
  }

  async validateApiKey(apiKey) {
    const app = await this.findByApiKey(apiKey);
    return !!app;
  }

  async getAppsByCreator(createdBy) {
    return await this.getAll({ createdBy, isActive: true });
  }

  async toggleAppStatus(id, isActive) {
    return await this.updateById(id, { isActive });
  }

  generateApiKey() {
    return crypto.randomBytes(VALIDATION.API_KEY_LENGTH / 2).toString('hex');
  }

  async regenerateApiKey(id) {
    const newApiKey = this.generateApiKey();
    return await this.updateById(id, { apiKey: newApiKey });
  }
}

export default new AppService();
