const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

const callback = (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Database connection successfully established!');
  }
};

mongoose.connect(uri, options, callback);
