import express from "express";
import User from "../models/UserModels.js";
import {
  followUser,
  getAllFollowers,
  getAllFollowings,
  getAllUser,
  getInfoUser,
  searchUser,
  unfollowUser,
  updateProfile,
} from "../controller/UserController.js";

const router = express.Router();

// router.put("/:id", async (req, res) => {
//   if (req.body.userId === req.params.id) {
//     if (req.body.password) {
//       try {
//         const salt = await bcrypt.genSalt(10);
//         req.body.password = await bcrypt.hash(req.body.password, salt);
//       } catch (err) {
//         return res.status(500).json(err);
//       }
//     }
//     try {
//       const user = await User.findByIdAndUpdate(req.params.id, {
//         $set: req.body,
//       });
//       res.status(200).json("Account has been updated");
//     } catch (err) {
//       return res.status(500).json(err);
//     }
//   } else {
//     return res.status(403).json("You can update only your account!");
//   }
// });

//delete user
// router.delete("/:id", async (req, res) => {
//   if (req.body.userId === req.params.id) {
//     try {
//       await User.findByIdAndDelete(req.params.id);
//       res.status(200).json("Account has been deleted");
//     } catch (err) {
//       return res.status(500).json(err);
//     }
//   } else {
//     return res.status(403).json("You can delete only your account!");
//   }
// });

//get a user list
router.get("/listuser", getAllUser);

//get a user
router.get("/", getInfoUser);

//get friends followings
router.get("/friends/:userId", getAllFollowings);

//get friends followers
router.get("/followers/:userId", getAllFollowers);

//follow a user

router.put("/:id/follow", followUser);

//unfollow a user

router.put("/:id/unfollow", unfollowUser);

//search user

router.get("/search/user", searchUser);

router.put("/profile/:userId", updateProfile);

export default router;
