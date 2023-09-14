import express from "express";
import Comments from "../models/CommentModels.js";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newCommnet = new Comments({
      ...req.body,
    });
    await newCommnet.save();
    const comment = await Comments.findOne({ _id: newCommnet._id }).populate(
      "userId"
    );
    res.status(200).json(comment);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server not found!",
    });
  }
});
router.get("/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    const comments = await Comments.find({ postId }).populate("userId");
    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server not found!",
    });
  }
});

router.put("/:commentId", async (req, res) => {
  const comment = req.body.comment;

  try {
    const editedComment = await Comments.findByIdAndUpdate(
      {
        _id: req.params.commentId,
      },
      { comment: comment }
    );

    await editedComment.save();

    res.status(200).json(editedComment);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const deleteComment = await Comments.findOneAndDelete({ _id });
    if (deleteComment) {
      res.status(200).json("Delete success comments");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

//like comment

router.put("/:id/likecomment", async (req, res) => {
  try {
    const comment = await Comments.findById(req.params.id);
    if (!comment.likesComment.includes(req.body.userId)) {
      const newComment = await comment.updateOne({
        $push: { likesComment: req.body.userId },
      });
      res.status(200).json({
        success: "The comment has been liked",
        results: comment,
      });
    } else {
      await comment.updateOne({ $pull: { likesComment: req.body.userId } });
      res.status(200).json("The comment has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
