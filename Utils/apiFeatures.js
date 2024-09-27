export default class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString || {};
  }

  filter() {
    const queryStringObj = { ...this.queryString };
    const excludes = ["page", "limit", "sort", "fields", "keyword"];
    excludes.forEach((exclude) => delete queryStringObj[exclude]);

    // Another felteration
    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    if (this.queryString.keyword) {
      const query = {};

      if (modelName === "Product") {
        query.$or = [
          { name: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      } else {
        query.$or = [
          { name: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      }

      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  paginate(numOfDocument) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.totalPages = Math.ceil(numOfDocument / limit);

    // Handle invalid page and limit values
    if (page < 1 || limit < 1) {
      throw new Error("Invalid page");
    }

    if (endIndex < numOfDocument) {
      pagination.next = page + 1;
    }

    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;
    return this;
  }
}
