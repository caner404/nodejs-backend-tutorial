"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const __1 = require("../..");
const supertest_1 = __importDefault(require("supertest"));
const userModel_1 = require("../../models/userModel");
const db = process.env.DATABASE_LOCAL_TEST;
/* Connecting to the database before each test. */
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default
        .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
        .then(() => { });
}));
/* Closing database connection after each test. */
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield userModel_1.User.deleteMany({});
    yield mongoose_1.default.connection.close();
}));
describe('POST users/signup', () => {
    it('should return a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(__1.app).post('/api/v1/users/signup').send({
            name: 'test3',
            email: 'tes3t@gmx.de',
            password: 'password1234',
            passwordConfirm: 'password1234',
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe('success');
    }));
});
describe('POST users/login', () => {
    it('should return an Error when either email or password is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(__1.app).post('/api/v1/users/login').send({
            email: 'tes3t@gmx.de',
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe('error');
        expect(res.body.message).toBe('Please provide email and password');
    }));
    it('should return an Error when either password is not correct', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(__1.app).post('/api/v1/users/signup').send({
            name: 'caner',
            email: 'caner@gmx.de',
            password: 'password1234',
            passwordConfirm: 'password1234',
        });
        const res = yield (0, supertest_1.default)(__1.app).post('/api/v1/users/login').send({
            email: 'caner@gmx.de',
            password: 'password12345678',
        });
        expect(res.statusCode).toBe(401);
        expect(res.body.status).toBe('error');
        expect(res.body.message).toBe('Incorrect credentials (email or password)');
        userModel_1.User.deleteMany({});
    }));
    it('should return an Error when either email is not correct', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(__1.app).post('/api/v1/users/signup').send({
            name: 'caner',
            email: 'caner@gmx.de',
            password: 'password1234',
            passwordConfirm: 'password1234',
        });
        const res = yield (0, supertest_1.default)(__1.app).post('/api/v1/users/login').send({
            email: 'caner2342342@gmx.de',
            password: 'password1234',
        });
        expect(res.statusCode).toBe(401);
        expect(res.body.status).toBe('error');
        expect(res.body.message).toBe('Incorrect credentials (email or password)');
        userModel_1.User.deleteMany({});
    }));
});
