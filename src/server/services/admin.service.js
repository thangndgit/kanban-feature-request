import { AdminModel } from '../models/_index.js';
import BaseService from './base.service.js';

class AdminService extends BaseService {
  constructor() {
    super(AdminModel);
  }
}

export default new AdminService();
