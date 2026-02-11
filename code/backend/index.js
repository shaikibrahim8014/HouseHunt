const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
//const connectDb = require("./config/connect.js");
const path = require("path");
const mongoose = require("mongoose");

const app =express();

// index.js


// dotenv config
dotenv.config();

// connection to DB
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
};
connectDb();


const PORT = process.env.PORT || 8001;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST']
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/owner', require('./routes/ownerRoutes'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});