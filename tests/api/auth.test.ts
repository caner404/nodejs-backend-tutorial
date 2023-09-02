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
    .then(() => {});
});

/* Closing database connection after each test. */
afterEach(async () => {
  await User.deleteMany({});
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
    expect(res.body.status).toBe('success');
  });
});

describe('POST users/login', () => {
  it('should return an Error when either email or password is not provided', async () => {
    const res = await request(app).post('/api/v1/users/login').send({
      email: 'tes3t@gmx.de',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBe('Please provide email and password');
  });

  it('should return an Error when either password is not correct', async () => {
    await request(app).post('/api/v1/users/signup').send({
      name: 'caner',
      email: 'caner@gmx.de',
      password: 'password1234',
      passwordConfirm: 'password1234',
    });

    const res = await request(app).post('/api/v1/users/login').send({
      email: 'caner@gmx.de',
      password: 'password12345678',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBe('Incorrect credentials (email or password)');
    User.deleteMany({});
  });

  it('should return an Error when either email is not correct', async () => {
    await request(app).post('/api/v1/users/signup').send({
      name: 'caner',
      email: 'caner@gmx.de',
      password: 'password1234',
      passwordConfirm: 'password1234',
    });

    const res = await request(app).post('/api/v1/users/login').send({
      email: 'caner2342342@gmx.de',
      password: 'password1234',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBe('Incorrect credentials (email or password)');
    User.deleteMany({});
  });
});
