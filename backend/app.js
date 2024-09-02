import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user_routes.js";
import blogRouter from "./routes/blog_routes.js";

// Loading environment variables from .env file
dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Define routes
app.use("/api/user", userRouter); // http://localhost:5000/api/user/login
app.use("/api/blog", blogRouter);

// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    // Ensure all required environment variables are set
    const mongoUrl = process.env.MONGO_URL;
    const port = process.env.PORT || 5000; // Default to 5000 if PORT is not set

    if (!mongoUrl) {
      throw new Error("MONGO_URL is not defined in environment variables");
    }

    // Connect to MongoDB
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Connected to Database and listening on port ${port}`);
    });
  } catch (err) {
    console.error("Error connecting to database or starting server:", err);
  }
};

// Call the function to start the server
startServer();
