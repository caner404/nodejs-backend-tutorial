import mongoose from 'mongoose';
import fs from 'fs';
import { Tour } from '../../models/tourModel';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const db = process.env.DATABASE_LOCAL!;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Mongodb is connected!'));

//Read JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

//IMPORT DATA INTO DATABASE
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};
//DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

//PATH : /g/webdev/complete-node-bootcamp-master/4-natours/starter/dev-data/data
//ts-node import-dev-data.ts --import
//ts-node import-dev-data.ts --delete
//start script in directory containing the currently executing file
