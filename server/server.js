const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
dotenv.config();
app.use(cors());

const port = process.env.PORT;
// Connect to MySQL without specifying the database
const sequelize = new Sequelize(
  `mysql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:3306`,
  {
    dialect: "mysql",
  }
);

// Create the database if it doesn't exist
sequelize
  .query("CREATE DATABASE IF NOT EXISTS users;")
  .then(() => {
    console.log("Database created or already exists");
  })
  .catch((err) => {
    console.error("Error creating database:", err);
  })
  .finally(() => {
    // Now, connect to the specific database
    const db = new Sequelize(
      `mysql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:3306/users`,
      {
        dialect: "mysql",
      }
    );

    // Define a 'User' model
    const User = db.define("User", {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });

    // Synchronize the model with the database
    db.sync()
      .then(() => {
        console.log("Database synchronized");
      })
      .catch((err) => {
        console.error("Error synchronizing database:", err);
      });

    // Middleware to parse JSON requests
    app.use(bodyParser.json());

    // Signup route
    app.post("/api/signup", async (req, res) => {
      try {
        const { username, password } = req.body;
        const user = await User.create({ username, password });
        res.json({ message: "User created successfully", userId: user.id });
      } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.get("/api/test", (req, res) => {
      res.json({ message: "Test successful" });
    });

    app.get("/api/stress", async (req, res) => {
      let sum = 0;

      for (let i = 0; i < 10000000; i++) {
        sum += i;
      }

      res.json({ message: "Stress test complete" });
    });

    // Login route
    app.post("/api/login", async (req, res) => {
      try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username, password } });

        if (user) {
          res.json({ message: "Login successful", userId: user.id });
        } else {
          res.status(401).json({ error: "Invalid credentials" });
        }
      } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  });
