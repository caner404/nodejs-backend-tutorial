import { Model, Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

export interface User {
  name: String;
  email: String;
  photo: String;
  password: String;
  role: String;
  passwordConfirm: String;
  passwordChangedAt: Date;
}

interface UserDocument extends User, Document {
  correctPassword(candidatePassword: string, password: string): boolean;
  changedPasswordAfter(JWTTimestamp: number): number;
}

// For model
export interface UserModel extends Model<UserDocument> {}

const userSchema = new Schema<UserDocument, UserModel>({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true,
    maxlength: [40, 'A user name must have less or equal then 40 characters'],
    minlength: [3, 'A user name must have more or equal then 3 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    // This only works on CREATE and SAVE!!
    validate: [validatePassword, 'Passwords are not the same '],
  },
  passwordChangedAt: Date,
});

userSchema.methods.correctPassword = async function (
  this: UserDocument,
  candidatePassword: string
) {
  //this.password not available cause of 'select' property
  return await bcrypt.compare(candidatePassword, this.password.toString());
};

userSchema.methods.changedPasswordAfter = function (
  this: UserDocument,
  JWTTimestamp: number
) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      (this.passwordChangedAt.getTime() / 1000).toString(),
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
};

userSchema.pre('save', async function (next) {
  //Only run function when password was actually changed
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password.toString(), 12);
  //required on schema only matters for input, not when brute forced onsave
  this.passwordConfirm = undefined!;
});

function validatePassword(this: User, val: String) {
  return val === this.password;
}
export const User = model<UserDocument, UserModel>('User', userSchema);
