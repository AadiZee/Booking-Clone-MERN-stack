const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const auth = require("./routes/Auth");
const users = require("./routes/Users");
const hotels = require("./routes/Hotels");
const rooms = require("./routes/Rooms");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 300``;

const connect = async () => {
  try {
    await mongoose.connect(process.env.DB_URI).then(() => {
      console.log("Connected to MongoDB");
    });
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected!");
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected!");
});

// middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/hotels", hotels);
app.use("/api/rooms", rooms);

//for handing errors using middleware (This will be executed when error is thrown in try catch)
// app.use((err, req, res, next) => {
//   const errorStatus = err.status || 500;
//   const errorMessage = err.message || "Something went wrong!";
//   return res.status(errorStatus).json({
//     status: false,
//     status: errorStatus,
//     message: errorMessage,
//     stack: err.stack,
//   });
// });

app.listen(PORT, async () => {
  await connect();
  console.log(`Server Started on port ${PORT}`);
});
