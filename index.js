import express from "express";
import "dotenv/config";
import cors from "cors";
import DBConnection from "./utils/db_connection.js";
const app = express();

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

app.get("/", (req, res) => {
  res.send("Abhay is cool");
});

app.get("/post", (req, res) => {
  res.send({
    abhay: "iscool",
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
