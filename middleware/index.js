import jwt from "jsonwebtoken";

const verifyIsLoggedIn = async (req, res, next) => {
  const token = req.cookies?.shoutout_access_token;

  if (!token) {
    res.status(401).json({
      message: "Invalid token access denied",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded;

    next();
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export { verifyIsLoggedIn };
