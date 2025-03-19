import bcrypt from "bcrypt";
import User from "../../models/user/UserModel.js";
import { userSchema } from "../../validations/user.js";
import { generateRandomToken, comparePassword } from "../../helpers/index.js";
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

    const verifyEmailToken = generateRandomToken();

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

//forgot password link

const sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;

  // Check the email
  const user = await User.findOne({ email });

  if (!user) {
    res.status(401).json({
      message: "Email not found",
    });
  }

  try {
    //generate the token
    const resetPasswordToken = generateRandomToken();

    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const resetPasswordLinkOptions = {
      from: '"Shoutout team" <ap3919529@gmail.com>',
      to: user.email,
      subject: "Verify Your Email to Get Started with Shoutout",
      text: `Click on the link to reset your password ${process.env.BASE_URL}/api/v1/users/verify/forgot-password/${resetPasswordToken}`,
    };

    transporter.sendMail(resetPasswordLinkOptions);

    // Save the token in the user's record
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordTokenExpiry = Date.now() + 3600000;
    user.save();

    res.status(200).json({
      status: 200,
      message: "Reset password link sent",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const forgotPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirm_password } = req.body;

  if (password !== confirm_password) {
    return res.status(400).json({
      message: "password and confirm password does not match",
    });
  }
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
    });

    console.log(user);

    if (!user) {
      return res.status(404).json({
        message: "Invalid or expired forgot password token",
      });
    }

    // hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log(hashedPassword, "hashpassword");

    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (err) {
    console.log(err.message);

    res.status(500).json({
      message: "something went wrong",
    });
  }
};

export {
  registerUser,
  verifyEmail,
  authenticateUser,
  sendPasswordResetEmail,
  forgotPassword,
};
