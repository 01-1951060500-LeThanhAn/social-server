import jwt  from "jsonwebtoken"
import User  from ("../models/UserModels");
const verifyToken = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({
      success: false,
      message: "User is not login !!!",
    });
  try {
    const decoded = jwt.verify(token, "thanhan");

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({
      success: false,
      message: "Token not found !!!",
    });
  }
};

export default verifyToken
