"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const mongoose_1 = __importDefault(require("mongoose"));
const db = process.env.DATABASE_LOCAL;
mongoose_1.default
    .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
})
    .then(() => console.log('Mongodb is connected!'));
const port = process.env.PORT;
_1.app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
