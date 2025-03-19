import { Schema } from "mongoose";
import mongoose from "mongoose";
import { type } from "os";

const userSchema = new Schema(
  {
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyEmailToken: {
      type: String,
    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordTokenExpiry: {
      type: Date,
      expires: 3600,
    },
  },
  {
    virtuals: {
      fullName: {
        get() {
          return this.first_name + " " + this.last_name;
        },
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
