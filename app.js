const express = require("express");
const mongoose = require("./config/db");
const bodyParser = require("body-parser");
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const cors = require("cors");
require('dotenv').config();


const app = express();
app.use(express.json());
app.use(cors());

const VerifyKey = (req, res, next) => {
  console.log("Called Middleware");

  // Normalize header key (Express lowercases all header keys)
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ error: "API key is missing" });
  } else if (apiKey !== "Am Dark") {
    return res.status(401).json({ error: "Invalid API key" });
  }

  console.log("API Key:", apiKey);

  // Optional: attach to req for downstream access
  req.apiKey = apiKey;

  next(); // Proceed to the next middleware or route handler
};

app.use("/students", VerifyKey, studentRoutes);
app.use("/courses", courseRoutes);
app.use("/enrollments", enrollmentRoutes);



const sampleController = (req, res) => {
  res.send("Alive");
};

app.post("/", VerifyKey, sampleController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
