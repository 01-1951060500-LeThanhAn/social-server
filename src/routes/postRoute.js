import express from "express";
import Post from "../models/PostModels.js";
import Videos from "../models/VideoModels.js";
import User from "../models/UserModels.js";
import SavePost from "../models/SavePostModels.js";
const router = express.Router();
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/video", async (req, res) => {
  const newPost = new Videos({
    ...req.body,
  });
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ data: -1 });
    //-1 brings the most recent first
    res.status(200).json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// get video
router.get("/video", async (req, res) => {
  try {
    const posts = await Videos.find().populate("userId");
    //-1 brings the most recent first
    res.status(200).json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//delete video
router.delete("/video/:id", async (req, res) => {
  try {
    const posts = await Videos.findById(req.params.id);
    await posts.deleteOne();
    res.status(200).json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
//update a post

router.put("/:id", async (req, res) => {
  const desc = req.body.desc;
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, desc);
    await post.updateOne({ $set: req.body });
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    return res.status(500).json("Failed");
  }
});
//delete a post

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    await post.deleteOne();

    res.status(200).json("the post has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
  // await Post.deleteOne({ _id: req.params.id });

  // return res.status(200).json("Delete post successfully");
});

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      const newPost = await post.updateOne({
        $push: { likes: req.body.userId },
      });
      res.status(200).json(post);
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//like a video

router.put("/:id/like/video", async (req, res) => {
  try {
    const video = await Videos.findById(req.params.id);
    if (!video.likes.includes(req.body.userId)) {
      const newPost = await video.updateOne({
        $push: { likes: req.body.userId },
      });
      res.status(200).json(video);
    } else {
      await video.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The video has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//get a post

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a video

router.get("/video/:id", async (req, res) => {
  try {
    const post = await Videos.findById(req.params.id).populate("userId");
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

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

router.post("/save", async (req, res) => {
  try {
    const { postId, saveBy } = req.body;

    const savedPosts = new SavePost({
      post: postId,
      saveBy: saveBy,
    });

    await savedPosts.save();

    res.status(200).json({
      savedPosts,
      msg: "Post saved successfully",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/save/:userId", async (req, res) => {
  try {
    const savedPosts = await SavePost.find({
      savedBy: req.params.userId,
    }).populate("post");
    res.json({ savedPosts });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Đã xảy ra lỗi khi lấy danh sách các bài đăng đã được lưu lại",
    });
  }
});

// Xóa bài đăng đã được lưu lại
router.delete("/unsave/:postId", async (req, res) => {
  try {
    await SavePost.deleteOne({ post: req.params.postId });
    res.json({
      message:
        "Bài đăng đã được xóa khỏi danh sách các bài đăng đã được lưu lại",
    });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi xóa bài đăng đã được lưu lại" });
  }
});

//share post

router.post("/:id/share", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(id).populate("userId shareFrom");
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Kiểm tra xem người dùng đã chia sẻ bài post này chưa
    const hasShared = post.shareFrom.includes(userId);
    if (hasShared) {
      return res.status(400).send({ message: "Post has already been shared" });
    }

    post.shareFrom.push(user);
    user.sharedPosts.push(post);

    await post.save();
    await user.save();

    res.status(200).send(post);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

router.get("/share/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).json(user.sharedPosts);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

//search post

router.get("/search/post", async (req, res) => {
  const searchQuery = req.query.keyword;
  if (!searchQuery.trim())
    return res.status(400).json({
      success: false,
      message: "Missing parameters!",
    });

  try {
    const textReg = new RegExp(searchQuery, "i");
    const results = await Post.find({
      desc: textReg,
    }).populate("userId");

    return res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server not found!",
    });
  }
});

//search post

router.get("/search/video", async (req, res) => {
  const searchQuery = req.query.keyword;
  if (!searchQuery.trim())
    return res.status(400).json({
      success: false,
      message: "Missing parameters!",
    });

  try {
    const textReg = new RegExp(searchQuery, "i");
    const results = await Videos.find({
      desc: textReg,
    }).populate("userId");

    return res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server not found!",
    });
  }
});

export default router;
