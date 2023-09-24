import express from "express";
import Post from "../models/PostModels.js";
import Videos from "../models/VideoModels.js";
import User from "../models/UserModels.js";

import {
  createPost,
  createVideo,
  deletePost,
  deleteVideo,
  getAllPostsData,
  getAllVideos,
  getInfoPost,
  getInfoVideo,
  getSharePost,
  likePost,
  likeVideo,
  removePostSave,
  savePost,
  savePostById,
  searchPost,
  searchVideo,
  sharePosts,
  updatePost,
} from "../controller/PostController.js";
const router = express.Router();
export const calculateCommentCountAggregation = async () => {
  try {
    const result = await Post.aggregate([
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "postId",
          as: "comments",
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          desc: 1,
          img: 1,
          likes: 1,
          shareFrom: 1,
          commentsCount: { $size: "$comments" }, // Đếm số lượng comment
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    return result;
  } catch (error) {
    console.error("Error calculating comment count:", error);
    throw error;
  }
};
router.post("/", createPost);

router.get("/", getAllPostsData);

router.post("/video", createVideo);

// get video
router.get("/video", getAllVideos);

//delete video
router.delete("/video/:id", deleteVideo);

//update a post

router.put("/:id", updatePost);
//delete a post

router.delete("/:id", deletePost);

router.put("/:id/like", likePost);

//like a video

router.put("/:id/like/video", likeVideo);
//get a post

router.get("/:id", getInfoPost);

//get a video

router.get("/video/:id", getInfoVideo);

//get timeline posts

router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});
//get user's all posts

router.get("/profile/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/save", savePost);

router.get("/save/:userId", savePostById);

// Xóa bài đăng đã được lưu lại
router.delete("/unsave/:postId", removePostSave);

//share post

router.post("/:id/share", sharePosts);

router.get("/share/:id", getSharePost);

//search post

router.get("/search/post", searchPost);

//search post

router.get("/search/video", searchVideo);

export default router;
