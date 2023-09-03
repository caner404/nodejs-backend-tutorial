"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class APIFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    filter() {
        const queryObj = Object.assign({}, this.queryStr);
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((field) => delete queryObj[field]);
        //1b) advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    sort() {
        if (this.queryStr.sort) {
            const sort = this.queryStr.sort;
            const sortBy = sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
            //sort('price ratingsAverage')
        }
        else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }
    limitFields() {
        if (this.queryStr.fields) {
            const fieldStr = this.queryStr.fields;
            const fields = fieldStr.split(',').join(' ');
            this.query = this.query.select(fields); //inlcude only values in fields
        }
        else {
            this.query = this.query.select('-__v'); //include everything except this mongoose value
        }
        return this;
    }
    paginate() {
        const page = Number(this.queryStr.page) || 1;
        const limit = Number(this.queryStr.limit) || 100;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}
exports.default = APIFeatures;
