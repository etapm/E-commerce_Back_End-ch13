require("dotenv").config();

console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PW:", process.env.DB_PW);
console.log("DB_NAME:", process.env.DB_NAME);

const Sequelize = require("sequelize");

const sequelize = process.env.JAWSDB_URL
  ? new Sequelize(process.env.JAWSDB_URL)
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
      host: "localhost",
      dialect: "mysql",
      dialectOptions: {
        decimalNumbers: true,
      },
    });

module.exports = sequelize;
