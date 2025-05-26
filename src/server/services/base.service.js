class BaseService {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    const document = new this.model(data);
    return await document.save();
  }

  async getAll(filter = {}, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 }, populate = '' } = options;
    const skip = (page - 1) * limit;

    let query = this.model.find(filter);

    if (populate) {
      query = query.populate(populate);
    }

    const documents = await query.sort(sort).skip(skip).limit(limit);

    const total = await this.model.countDocuments(filter);

    return {
      data: documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id, populate = '') {
    let query = this.model.findById(id);

    if (populate) {
      query = query.populate(populate);
    }

    return await query;
  }

  async updateById(id, data) {
    return await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteById(id) {
    return await this.model.findByIdAndDelete(id);
  }

  async findOne(filter, populate = '') {
    let query = this.model.findOne(filter);

    if (populate) {
      query = query.populate(populate);
    }

    return await query;
  }

  async count(filter = {}) {
    return await this.model.countDocuments(filter);
  }
}

export default BaseService;
