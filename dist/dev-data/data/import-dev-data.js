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
const fs_1 = __importDefault(require("fs"));
const tourModel_1 = require("../../models/tourModel");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '../../.env' });
const db = process.env.DATABASE_LOCAL;
mongoose_1.default
    .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
})
    .then(() => console.log('Mongodb is connected!'));
//Read JSON FILE
const tours = JSON.parse(fs_1.default.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));
//IMPORT DATA INTO DATABASE
const importData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield tourModel_1.Tour.create(tours);
        console.log('Data successfully loaded');
    }
    catch (error) {
        console.log(error);
    }
    process.exit();
});
//DELETE ALL DATA FROM COLLECTION
const deleteData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield tourModel_1.Tour.deleteMany();
        console.log('Data successfully deleted');
    }
    catch (error) {
        console.log(error);
    }
    process.exit();
});
if (process.argv[2] === '--import') {
    importData();
}
else if (process.argv[2] === '--delete') {
    deleteData();
}
//PATH : /g/webdev/complete-node-bootcamp-master/4-natours/starter/dev-data/data
//ts-node import-dev-data.ts --import
//ts-node import-dev-data.ts --delete
//start script in directory containing the currently executing file
