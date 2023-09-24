import UserModels from "../models/UserModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  try {
    const user = await UserModels.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      res.status(400).json("wrong password");
    } else {
      const accessToken = jwt.sign(
        {
          userId: user._id,
        },
        "thanhan",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        user: user,
        token: accessToken,
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const register = async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new UserModels({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const accessToken = jwt.sign(
      {
        userId: newUser._id,
      },
      "thanhan",
      { expiresIn: "1h" }
    );

    //save user and respond

    res.status(203).json({
      user: user,
      token: accessToken,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

export { login, register };
