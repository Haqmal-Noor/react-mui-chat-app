import express from "express";
import {
	createChat,
	getUserChats,
	getChatById,
} from "../controllers/chat.controller.js";
import protectedRoute from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protectedRoute, createChat);
router.get("/", protectedRoute, getUserChats);
router.get("/:id", protectedRoute, getChatById);

export default router;
