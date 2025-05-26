// src/server/services/feature-request.service.js
import BaseService from './base.service.js';
import { FeatureRequestModel } from '../models/index.js';
import { FEATURE_REQUEST_STATUS } from '../constants/feature-request.js';

class FeatureRequestService extends BaseService {
  constructor() {
    super(FeatureRequestModel);
  }

  async createRequest(data, appId, requester, isAdminCreated = false, adminCreator = null) {
    const requestData = {
      ...data,
      appId,
      requester,
      status: FEATURE_REQUEST_STATUS.PENDING,
      createdByAdmin: isAdminCreated,
      adminCreator: isAdminCreated ? adminCreator : null,
    };

    return await this.create(requestData);
  }

  async getRequestsByApp(appId, options = {}) {
    const filter = { appId };
    const queryOptions = {
      ...options,
      populate: 'appId',
      sort: { createdAt: -1 },
    };

    return await this.getAll(filter, queryOptions);
  }

  async getRequestsByStatus(appId, status, options = {}) {
    const filter = { appId, status };
    return await this.getAll(filter, options);
  }

  async upvoteRequest(id, userId, userName, email) {
    const request = await this.getById(id);
    if (!request) {
      throw new Error('Request not found');
    }

    // Check if user already upvoted
    const hasUpvoted = request.upvotedBy.some((vote) => vote.userId === userId);

    if (hasUpvoted) {
      // Remove upvote
      request.removeUpvote(userId);
    } else {
      // Add upvote
      request.addUpvote(userId, userName, email);
    }

    return await request.save();
  }

  async addComment(id, commentData) {
    const request = await this.getById(id);
    if (!request) {
      throw new Error('Request not found');
    }

    request.addComment(commentData);
    return await request.save();
  }

  async updateStatus(id, status, assignedTo = null) {
    const updateData = { status };
    if (assignedTo !== null) {
      updateData.assignedTo = assignedTo;
    }

    return await this.updateById(id, updateData);
  }

  async getRequestsByUser(userId, appId = null) {
    const filter = { 'requester.userId': userId };
    if (appId) {
      filter.appId = appId;
    }

    return await this.getAll(filter, {
      populate: 'appId',
      sort: { createdAt: -1 },
    });
  }

  async getPopularRequests(appId, limit = 10) {
    const filter = { appId };
    const options = {
      limit,
      sort: { upvotes: -1, createdAt: -1 },
    };

    return await this.getAll(filter, options);
  }

  async searchRequests(appId, searchQuery, options = {}) {
    const filter = {
      appId,
      $or: [{ title: { $regex: searchQuery, $options: 'i' } }, { description: { $regex: searchQuery, $options: 'i' } }],
    };

    return await this.getAll(filter, options);
  }

  async getRequestsGroupedByStatus(appId) {
    const requests = await FeatureRequestModel.find({ appId }).populate('appId').sort({ createdAt: -1 });

    const grouped = {
      [FEATURE_REQUEST_STATUS.PENDING]: [],
      [FEATURE_REQUEST_STATUS.APPROVED]: [],
      [FEATURE_REQUEST_STATUS.IN_PROGRESS]: [],
      [FEATURE_REQUEST_STATUS.DONE]: [],
      [FEATURE_REQUEST_STATUS.REJECTED]: [],
    };

    requests.forEach((request) => {
      if (grouped[request.status]) {
        grouped[request.status].push(request);
      }
    });

    return grouped;
  }

  // Admin creates feature request (with admin context)
  async createAdminRequest(data, appId, adminUsername) {
    // Use admin info as requester but mark as admin-created
    const adminRequester = {
      userId: `admin_${adminUsername}`,
      userName: `Admin: ${adminUsername}`,
      email: `${adminUsername}@admin.system`,
    };

    return await this.createRequest(data, appId, adminRequester, true, adminUsername);
  }

  // Assign task to developer
  async assignTask(id, assignedTo) {
    return await this.updateById(id, { assignedTo });
  }
}

export default new FeatureRequestService();
