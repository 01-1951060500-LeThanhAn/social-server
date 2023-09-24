import Post from "../models/PostModels.js";
import SavePost from "../models/SavePostModels.js";
import User from "../models/UserModels.js";
import Video from "../models/VideoModels.js";
import { calculateCommentCountAggregation } from "../routes/postRoute.js";

const createPost = async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAllPostsData = async (req, res) => {
  try {
    const postsWithCommentCount = await calculateCommentCountAggregation();
    res.status(200).json(postsWithCommentCount);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const createVideo = async (req, res) => {
  const newPost = new Video(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAllVideos = async (req, res) => {
  try {
    const posts = await Video.find().populate("userId");
    //-1 brings the most recent first
    res.status(200).json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const deleteVideo = async (req, res) => {
  try {
    const posts = await Video.findById(req.params.id);
    await posts.deleteOne();
    res.status(200).json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const updatePost = async (req, res) => {
  const desc = req.body.desc;
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, desc);
    await post.updateOne({ $set: req.body }, { new: true });
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    return res.status(500).json("Failed");
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    await post.deleteOne();

    res.status(200).json("the post has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
};

const likePost = async (req, res) => {
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
};

const likeVideo = async (req, res) => {
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
};

const getInfoPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getInfoVideo = async (req, res) => {
  try {
    const post = await Videos.findById(req.params.id).populate("userId");
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
};

const savePost = async (req, res) => {
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
};

const savePostById = async (req, res) => {
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
};

const removePostSave = async (req, res) => {
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
};

const sharePosts = async (req, res) => {
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
};

const getSharePost = async (req, res) => {
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
};

const searchPost = async (req, res) => {
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
};

const searchVideo = async (req, res) => {
  const searchQuery = req.query.keyword;
  if (!searchQuery.trim())
    return res.status(400).json({
      success: false,
      message: "Missing parameters!",
    });

  try {
    const textReg = new RegExp(searchQuery, "i");
    const results = await Video.find({
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
};

export {
  createPost,
  getAllPostsData,
  createVideo,
  getAllVideos,
  deleteVideo,
  updatePost,
  deletePost,
  likePost,
  likeVideo,
  getInfoPost,
  getInfoVideo,
  savePost,
  savePostById,
  removePostSave,
  sharePosts,
  getSharePost,
  searchPost,
  searchVideo,
};
