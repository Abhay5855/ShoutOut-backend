import express from "express";
import "dotenv/config";
import cors from "cors";
import DBConnection from "./utils/db_connection.js";
import userRoutes from "./routes/user/user.routes.js";
const app = express();

// Middleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//cors configuaration
app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Databse Connection
DBConnection();

const port = process.env.PORT;

// user routes
app.use("/api/users/", userRoutes);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
