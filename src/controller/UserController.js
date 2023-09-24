import User from "../models/UserModels.js";

const getAllUser = async (req, res) => {
  try {
    const user = await User.find().select("username email profilePicture");

    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const getInfoUser = async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAllFollowings = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (err) {
    res.status(400).json("Failed");
  }
};

const getAllFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followers.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (err) {
    res.status(400).json("Failed");
  }
};

const followUser = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
};

const unfollowUser = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
};
const searchUser = async (req, res) => {
  const searchQuery = req.query.keyword;
  if (!searchQuery)
    return res.status(400).json({
      success: false,
      message: "Missing parameters!",
    });

  try {
    const textReg = new RegExp(searchQuery, "i");
    const results = await User.find({
      username: textReg,
    });

    return res.json({
      success: true,
      results,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server not found!",
    });
  }
};

const updateProfile = async (req, res) => {
  const userId = req.params.userId;

  try {
    await User.findOneAndUpdate({ _id: userId }, { ...req.body });

    return res.json({
      success: true,
      profile: req.body,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server not found!",
    });
  }
};
export {
  getAllUser,
  getInfoUser,
  getAllFollowings,
  getAllFollowers,
  followUser,
  searchUser,
  updateProfile,
  unfollowUser,
};
