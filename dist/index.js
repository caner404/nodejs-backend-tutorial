"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const tourRoutes_1 = require("./routes/tourRoutes");
const userRoutes_1 = require("./routes/userRoutes");
const appError_1 = __importDefault(require("./utils/appError"));
const errorController_1 = require("./controllers/errorController");
dotenv_1.default.config();
exports.app = (0, express_1.default)();
//1. Midldewares
//Middlware order in code is important .defines execution order -> needs be to always before othes routes
exports.app.use(express_1.default.json());
if (process.env.NODE_ENV === 'development') {
    exports.app.use((0, morgan_1.default)('dev'));
}
// 3) Routers mouting
exports.app.use('/api/v1/tours', tourRoutes_1.router);
exports.app.use('/api/v1/users', userRoutes_1.router);
exports.app.all('*', (req, res, next) => {
    next(new appError_1.default(`Can't find ${req.originalUrl} on this server!`, 404));
});
exports.app.use(errorController_1.globalErrHandler);
//index.js mainly used for connecting our different middlewares
