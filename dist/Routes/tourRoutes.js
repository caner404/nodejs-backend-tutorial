"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const tourController_1 = require("../controllers/tourController");
const authController = __importStar(require("../controllers/authController"));
exports.router = express_1.default.Router();
exports.router.route('/top5-cheap').get(tourController_1.alliasTopTours, tourController_1.getAllTours);
exports.router.route('/tour-stats').get(tourController_1.getTourStats);
exports.router.route('/monthly-plan/:year').get(tourController_1.getMonthlyPlan);
exports.router.route('/').get(authController.protect, tourController_1.getAllTours).post(tourController_1.createTour);
exports.router
    .route('/:id')
    .get(tourController_1.getTour)
    .patch(tourController_1.updateTour)
    .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController_1.deleteTour);
