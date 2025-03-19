import crypto from "crypto";
import bcrypt from "bcrypt";

const generateEmailVerifyToken = () => {
  const verifyToken = crypto.randomBytes(32).toString("hex");

  return verifyToken;
};

const comparePassword = async (password, userPassword) => {
  const comparisionResult = await bcrypt.compare(password, userPassword);

  return comparisionResult;
};

export { generateEmailVerifyToken, comparePassword };
