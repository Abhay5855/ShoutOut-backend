import jwt from "jsonwebtoken";

const verifyIsLoggedIn = async (req, res, next) => {
  const token = req.cookies?.shoutout_access_token;

  if (!token) {
    return res.status(401).json({
      error: "Invalid token access denied",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded;

    next();
  } catch (err) {
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

export { verifyIsLoggedIn };
