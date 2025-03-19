import bcrypt from "bcrypt";
import User from "../../models/user/UserModel.js";
import { userSchema } from "../../validations/user.js";
import {
  generateEmailVerifyToken,
  comparePassword,
} from "../../helpers/index.js";
import nodemailer from "nodemailer";
import "dotenv/config";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  const { error, value } = userSchema.validate(req.body, { abortEarly: false });
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(value.password, saltRounds);

    const checkIfEmailExists = await User.findOne({ email: value.email });
    if (checkIfEmailExists) {
      return res.status(409).json({
        message: "Email already exists !",
      });
    }

    if (error) {
      return res.status(500).json({
        message: error.details.map((err) => err.message),
      });
    }

    const verifyEmailToken = generateEmailVerifyToken();

    const user = new User({
      ...value,
      password: hashedPassword,
      verifyEmailToken,
    });

    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOptions = {
      from: '"Shoutout team" <ap3919529@gmail.com>',
      to: user.email,
      subject: "Verify Your Email to Get Started with Shoutout",
      text: `Click on the link to verify your email ${process.env.BASE_URL}/api/v1/users/verify/${verifyEmailToken}`,
      html: "<b>Hello world?</b>",
    };
    await user.save();

    transporter.sendMail(mailOptions);

    res.status(201).json({
      status: 201,
      message: "User creted successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ verifyEmailToken: token });

    if (!user) {
      return res.status(404).json({
        message: "Token is invalid",
      });
    }

    user.isVerified = true;
    user.verifyEmailToken = undefined;
    user.save();

    res.status(200).json({
      message: "User email is verified successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const authenticateUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  try {
    // Compare the password
    const comparedPasswordResult = await comparePassword(
      password,
      user.password
    );

    if (!comparedPasswordResult) {
      return res.status(400).json({
        message: "The password does not match!",
      });
    }

    // Generate access_token
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: "10h",
    });

    //cookie
    res.cookie(process.env.COOKIE_KEY, token, {
      httpOnly: true,
      secure: true,
    });

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        email: user.email,
        access_token: token,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export { registerUser, verifyEmail, authenticateUser };
