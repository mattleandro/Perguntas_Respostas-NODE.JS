const Sequelize = require("sequelize");

const connection = new Sequelize("guiaperguntas", "root", "1990", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = connection;
