import { app } from '.';
import mongoose from 'mongoose';

const db = process.env.DATABASE_LOCAL!;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Mongodb is connected!'));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
