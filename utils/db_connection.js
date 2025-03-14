import mongoose from "mongoose";
import "dotenv/config";

const DBConnection = () => {
  mongoose.connect(process.env.MONGODB_URL).then(
    () => {
      console.log("Connection successful");
    },
    (err) => {
      console.log("Connection error", err);
    }
  );
};

export default DBConnection;
