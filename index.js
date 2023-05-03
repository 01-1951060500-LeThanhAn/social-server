import express from "express";

import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

import cors from "cors";
import db from "./src/db/index.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoute.js";
import postRoutes from "./src/routes/postRoute.js";
import commentRoutes from "./src/routes/commentRoutes.js";
import messageRoutes from "./src/routes/message.js";
import conversationRoutes from "./src/routes/conversation.js";

const app = express();
dotenv.config();

db();

app.use(cors());
app.use(express.json({ limit: "200mb" }));
app.use(
  express.urlencoded({
    limit: "200mb",
    extended: true,
  })
);
app.use(helmet());
app.use(morgan("common"));

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/conversation", conversationRoutes);

app.listen(process.env.PORT || 8000, () => {
  console.log(`Backend server is running! is ${PORT}`);
});
