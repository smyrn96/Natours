class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filtering() {
    //Filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);

    //Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = JSON.parse(
      queryStr.replace(/\b(gte|lte|gt|lt\b)/g, (match) => `$${match}`),
    );
    this.query = this.query.find(queryStr);

    return this;
  }

  sorting() {
    //Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  fieldLimiting() {
    //Field limiting
    if (this.queryString.fields) {
      const fieldsBy = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fieldsBy);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  pagination() {
    //Pagination
    const pageNumber = this.queryString.page * 1 || 1;
    const limitNumber = this.queryString.limit * 1 || 100;
    const skip = (pageNumber - 1) * limitNumber;
    this.query = this.query.skip(skip).limit(limitNumber);

    return this;
  }
}

module.exports = APIFeatures;
