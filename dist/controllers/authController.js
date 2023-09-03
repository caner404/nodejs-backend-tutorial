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
exports.resetPassword = exports.forgotPassword = exports.restrictTo = exports.protect = exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../models/userModel");
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
exports.signup = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield userModel_1.User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
    });
    const token = signToken(newUser._id);
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser,
        },
    });
}));
exports.login = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    //1.) Check if email and password exits
    if (!email || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'Please provide email and password',
        });
    }
    // 2) Check if the user exit && password is correct
    const user = yield userModel_1.User.findOne({ email: email }).select('+password'); //normally password field not included in select,explicity select password
    const correct = yield (user === null || user === void 0 ? void 0 : user.correctPassword(password, user.password.toString()));
    if (!user || !correct) {
        return res.status(401).json({
            status: 'error',
            message: 'Incorrect credentials (email or password)',
        });
    }
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token,
    });
}));
exports.protect = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.headers.authorization ||
        !((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.startsWith('Bearer')) ||
        req.headers.authorization.split(' ').length <= 1) {
        return next(new appError_1.default('You are not logged in. Please log in to get access', 401));
    }
    const token = req.headers.authorization.split(' ')[1];
    // 2) Verify token
    const decoced = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    console.log(decoced);
    // 3) Check if user still exists
    const user = yield userModel_1.User.findById(decoced.id);
    if (!user) {
        return next(new appError_1.default('The user belonging to the token does no longer exist', 401));
    }
    // 4) Check if user changed password after the token was issued
    if (user.changedPasswordAfter(decoced.iat)) {
        return next(new appError_1.default('The User recently changed password! Please log in again', 401));
    }
    req.user = user;
    next();
}));
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role.toString())) {
            return next(new appError_1.default('You do not have permission to perform this action', 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
exports.forgotPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.User.findOne({ email: req.body.email });
    if (!user) {
        return next(new appError_1.default('There is no user with that email address', 404));
    }
    const resetToken = user.createPasswordResetToken();
    yield user.save({ validateBeforeSave: false }); //passwordConfirm not needed here
    res.status(200).json({
        status: 'success',
        data: {
            resetToken,
        },
    });
}));
const resetPassword = (req, res, next) => { };
exports.resetPassword = resetPassword;
