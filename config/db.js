// import sequelize
require("dotenv").config();
const Sequelize = require("sequelize");

// create connection
const db = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PW, {
  host: "localhost",
  dialect: "mysql",
});

// export connection
module.exports = db;
