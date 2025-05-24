class QueryGenerator {
  constructor(mongoQuery, query) {
    this.mongoQuery = mongoQuery
    this.query = query
  }

  sort() {
    if (this.query.sort) {
      const sortBy = this.query.sort.split(',').join(' ')
      this.mongoQuery = this.mongoQuery.sort(sortBy)
    }
    return this
  }

  find() {
    const search = JSON.parse(this.query.search || '{}')
    this.mongoQuery = this.mongoQuery.find(search)
    return this
  }

  count() {
    const search = JSON.parse(this.query.search || '{}')
    this.mongoQuery = this.mongoQuery.countDocuments(search)
    return this
  }

  paginate() {
    const page = this.query.pageNumber * 1 || 1
    const limit = this.query.pageSize * 1 || 10
    const skip = (page - 1) * limit

    this.mongoQuery = this.mongoQuery.skip(skip).limit(limit)
    return this
  }

  limitFields() {
    if (this.query.fields) {
      const fields = this.query.fields.split(',').join(' ')
      this.mongoQuery = this.mongoQuery.select(fields)
    }
    return this
  }
}

export default QueryGenerator
