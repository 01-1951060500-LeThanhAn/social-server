import mongoose from "mongoose";
const SavePostSchema = new mongoose.Schema(
  {
    saveBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("favourite", SavePostSchema);
