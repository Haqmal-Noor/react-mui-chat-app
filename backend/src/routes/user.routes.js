import express from "express";
const router = express.Router();
import {
	getProfile,
	addFriend,
	removeFriend,
	getAllFriends,
	getFriendById,
	getFriendByUsername,
	searchUsers,
} from "../controllers/user.controller.js";
import authenticate from "../middlewares/auth.middleware.js";

// User profile route
router.get("/profile", authenticate, getProfile);

// Friend management routes
router.post("/friends/add", authenticate, addFriend);
router.delete("/friends/remove/:friendId", authenticate, removeFriend);
// router.put("/friends/update", authenticate, updateFriend);
router.get("/friends", authenticate, getAllFriends);
router.get("/friends/id/:friendId", authenticate, getFriendById);
router.get("/friends/username/:username", authenticate, getFriendByUsername);
router.get("/search", authenticate, searchUsers);

export default router;
