import bcrypt from "bcrypt";
import User from "../../models/user/UserModel.js";
import { userSchema } from "../../validations/user.js";

const registerUser = async (req, res) => {
  const { error, value } = userSchema.validate(req.body, { abortEarly: false });
  const saltRounds = 10;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(value.password, saltRounds);

    //check if email already exists
    const checkIfEmailExists = await User.findOne({ email: value.email });
    if (checkIfEmailExists) {
      return res.status(409).json({
        message: "Email already exists !",
      });
    }

    //Validations message
    if (error) {
      return res.status(500).json({
        message: error.details.map((err) => err.message),
      });
    }

    const user = new User({
      ...value,
      password: hashedPassword,
    });

    //Save the user
    await user.save();

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

export { registerUser };
