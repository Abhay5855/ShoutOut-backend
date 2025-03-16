import crypto from "crypto";

export const generateToken = () => {
  const verifyToken = crypto.randomBytes(32).toString("hex");

  return verifyToken;
};
