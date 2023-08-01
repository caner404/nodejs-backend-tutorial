import { app } from '.';
import mongoose from 'mongoose';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const db = process.env.DATABASE_LOCAL!;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Mongodb is connected!'));

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

process.on('unhandledRejection', (err: any) => {
  console.log('UNHANDLED REJECTION💥, Shutting down...');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
