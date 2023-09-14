import mongoose from "mongoose";
const Comments = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posts",
    },
    parent: {
      type: mongoose.Types.ObjectId,
      ref: "comments",
    },
    likesComment: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("comments", Comments);
