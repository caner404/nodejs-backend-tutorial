import mongoose, { Model, Query, Schema, Types } from 'mongoose';

export interface IReview {
  review: string;
  rating: number;
  createdAt: Date;
  user: Types.ObjectId;
  tour: Types.ObjectId;
}

const reviewSchema = new Schema<IReview>(
  {
    review: {
      type: String,
      required: [true, 'A review must have a name'],
      trim: true,
    },
    rating: {
      type: Number,
      default: 4.0,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a tour.'],
    },
    tour: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Tour',
      required: [true, 'Tour must belong to a tour.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  } //when we have a virtual property,which is not stored in DB buit calculated, show it in every output
);

reviewSchema.pre<Query<IReview, null>>(/^find/, function (next: any) {
  /*
  this.populate([
    {
      path: 'user',
      select: 'name',
    },
    {
      path: 'tour',
      select: 'name',
    },
  ]).select('-__v');

  */

  this.populate([
    {
      path: 'user',
      select: 'name',
    },
  ]);
  next();
});

export const Review = mongoose.model<IReview>('Review', reviewSchema);
