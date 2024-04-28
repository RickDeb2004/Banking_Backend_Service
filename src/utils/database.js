// src/utils/database.js
// const mysql = require("mysql2/promise");

// try {
//   const db = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     password: "Debanjan@2122",
//     database: "abc",
//   });
//   console.log("Successfully connected to the database");
//   module.exports = db;
// } catch (error) {
//   console.error("Failed to connect to the database:", error);
// }

const mysql = require("mysql2/promise");

try {
  const db = mysql.createPool({
    host: "localhost", // Use environment variable or fallback to localhost
    user: process.env.MYSQL_USER || "root", // Use environment variable or fallback to root
    password: process.env.MYSQL_PASSWORD || "Debanjan@2122", // Use environment variable or fallback to Debanjan@2122
    database: process.env.MYSQL_DATABASE || "abc", // Use environment variable or fallback to abc
  });
  console.log("Successfully connected to the database");
  module.exports = db;
} catch (error) {
  console.error("Failed to connect to the database:", error);
}
