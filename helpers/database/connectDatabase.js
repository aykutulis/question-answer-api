const mongoose = require('mongoose');

const connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => {
      console.log('MongoDB Connection Succesfull');
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDatabase;
