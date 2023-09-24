import express from "express";

import { login, register } from "../controller/AuthController.js";
const router = express.Router();
router.post("/register", register);

//LOGIN
router.post("/login", login);

export default router;
