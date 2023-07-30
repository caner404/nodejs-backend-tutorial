"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const tourController_1 = require("../controllers/tourController");
exports.router = express_1.default.Router();
exports.router.route('/').get(tourController_1.getAllTours).post(tourController_1.createTour);
exports.router.route('/:id').get(tourController_1.getTour).patch(tourController_1.updateTour).delete(tourController_1.deleteTour);
