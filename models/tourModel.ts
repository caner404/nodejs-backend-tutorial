import mongoose, { Schema } from 'mongoose';
import { IUser } from './userModel';

export interface Locations {
  type: string;
  coordinates: [number];
  address: string;
  description: string;
  day: number;
}

const locationsSchema = new Schema<Locations>({
  type: {
    type: String,
    default: 'Point',
    enum: ['Point'],
  },
  coordinates: [Number],
  address: String,
  description: String,
  day: {
    type: Number,
    default: 0,
  },
});

export interface Tour {
  _id: string;
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscount: number;
  summary: string;
  description: string;
  imageCover: string;
  images: string;
  createdAt: Date;
  startDates: [Date];
  //guideIds: [string];
  //guides: IUser[] |string[];
  guides: IUser[];
  startLocation: Locations;
  locations: Locations[];
}

function validationPriceDiscount(this: Tour, val: number): boolean {
  // this only points to current doc on NEW document creation
  return val < this.price;
}

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
  /*
  if there will be problems with guides mixed type, this works too
  guideIds: {
    type: [String],
    select: false, //hide from api returns
  },
  */
  //guides: Schema.Types.Mixed, embedding
  guides: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
  ],
  startLocation: locationsSchema,
  locations: [locationsSchema],
});

tourSchema.pre(/^find/, function (next) {
  //this always points to the current query in middleware
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangeAt', //filter out those fields of Users
  }); // find all guides with the corresponding ObjectId
  next();
});

/*

tourSchema.pre('save', async function (next: any) {
  const guidePromises = this.guides.map((guide) => {
    return typeof guide === 'string'
      ? User.findById(guide)
      : User.findById(guide.id);
  });
  const guidesResolved = await Promise.all(guidePromises);
  this.guides = guidesResolved.filter((guide) => guide !== null) as
    | IUser[]
    | string[];
  next();
});

*/

export const Tour = mongoose.model<Tour>('Tour', tourSchema);
