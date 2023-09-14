import mongoose from "mongoose";

const Posts = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: "users",
    },
    desc: {
      type: String,
      max: 500,
      required: true,
    },

    videos: {
      type: String,
      required: true,
    },

    likes: {
      type: Array,
      default: [],
    },
    shareFrom: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    comments: [
      {
        type: Array,
        ref: "comments",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("videos", Posts);
