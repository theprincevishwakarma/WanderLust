const mongoose = require("mongoose");

module.exports = () => {
  mongoose
    .connect(process.env.ATLUSDB_URL)
    .then(() => {
      console.log("connected to DB");
    })
    .catch((err) => {
      console.log(err);
    });
};
