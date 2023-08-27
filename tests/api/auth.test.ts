import mongoose from 'mongoose';
import { app } from '../..';
import request from 'supertest';
import { User } from '../../models/userModel';

const db = process.env.DATABASE_LOCAL_TEST!;

/* Connecting to the database before each test. */
beforeEach(async () => {
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Mongodb is connected!'));
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

describe('POST users/signup', () => {
  it('should return a new user', async () => {
    const res = await request(app).post('/api/v1/users/signup').send({
      name: 'test3',
      email: 'tes3t@gmx.de',
      password: 'password1234',
      passwordConfirm: 'password1234',
    });
    expect(res.statusCode).toBe(201);
    await User.deleteMany({});
  });
});
