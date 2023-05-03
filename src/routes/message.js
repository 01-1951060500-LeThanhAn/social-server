import express from "express";
import MessageModel from "../models/MessageModel.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const messages = new MessageModel(req.body);

  try {
    const savedMessage = await messages.save();
    res.status(200).json(savedMessage);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await MessageModel.find({
      conversationId: req.params.conversationId,
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
