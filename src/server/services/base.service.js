class BaseService {
  constructor(model) {
    this.model = model;
  }

  create = async (data) => {
    const document = new this.model(data);
    return await document.save();
  };

  getAll = async (filter = {}, options = {}) => {
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
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  };

  getById = async (id, populate = '') => {
    let query = this.model.findById(id);

    if (populate) {
      query = query.populate(populate);
    }

    return await query;
  };

  updateById = async (id, data) => {
    return await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  };

  deleteById = async (id) => {
    return await this.model.findByIdAndDelete(id);
  };

  findOne = async (filter, populate = '') => {
    let query = this.model.findOne(filter);

    if (populate) {
      query = query.populate(populate);
    }

    return await query;
  };

  count = async (filter = {}) => {
    return await this.model.countDocuments(filter);
  };
}

export default BaseService;

