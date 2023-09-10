import mongoose, { Schema } from 'mongoose';

const tourSchema = new Schema<Tour>({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must have less or equal then 40 characters'],
    minlength: [10, 'A tour name must have more or equal then 10 characters'],
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, difficult',
    },
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: {
    type: Number,
    validate: [
      validationPriceDiscount,
      'Discount price ({VALUE}) should be below regular price',
    ],
  },
  summary: {
    type: String,
    required: [true, 'A tour must have a description'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false, //hide from api returns
  },
  startDates: [Date],
});

export interface Tour {
  _id: String;
  name: String;
  duration: Number;
  maxGroupSize: Number;
  difficulty: String;
  ratingsAverage: Number;
  ratingsQuantity: Number;
  price: Number;
  priceDiscount: Number;
  summary: String;
  description: String;
  imageCover: String;
  images: String;
  createdAt: Date;
  startDates: [Date];
}

function validationPriceDiscount(this: Tour, val: Number): boolean {
  // this only points to current doc on NEW document creation
  return val < this.price;
}

export const Tour = mongoose.model<Tour>('Tour', tourSchema);
