import mongoose from "mongoose";
import User from "../models/user.model.js";

// Get user profile
export const getProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		if (!user) return res.status(404).json({ message: "User not found" });
		res.status(200).json(user);
	} catch (error) {
		console.error("Error fetching profile:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

// Add friend
export const addFriend = async (req, res) => {
	const friendId = req.body.userId;
	if (!mongoose.Types.ObjectId.isValid(friendId)) {
		return res.status(400).json({ message: "Invalid friend ID" });
	}
	if (friendId === req.user.id) {
		return res.status(400).json({ message: "Invalid request" });
	}

	try {
		const user = await User.findById(req.user.id);
		const friend = await User.findById(friendId);

		if (!friend) return res.status(404).json({ message: "Friend not found" });
		if (user.friends.includes(friendId)) {
			return res.status(400).json({ message: "Already in friends" });
		}

		user.friends.push(friendId);
		friend.friends.push(user._id);
		await user.save();
		await friend.save();

		// Populate the user.friends array with full user details
		const populatedUser = await User.findById(req.user.id).populate(
			"friends",
			"-password -__v"
		);

		// Return the populated array of friends with user details
		res.status(200).json(populatedUser.friends);
	} catch (error) {
		console.error("Error adding friend:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

// Remove friend
export const removeFriend = async (req, res) => {
	const { friendId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(friendId)) {
		return res.status(400).json({ message: "Invalid friend ID" });
	}

	try {
		const user = await User.findById(req.user.id);
		user.friends = user.friends.filter((id) => id.toString() !== friendId);
		await user.save();

		res.status(200).json({ message: "Friend removed successfully" });
	} catch (error) {
		console.error("Error removing friend:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

// Get all friends
export const getAllFriends = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).populate(
			"friends",
			"username email"
		);
		res.status(200).json(user.friends);
	} catch (error) {
		console.error("Error fetching friends:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

// Get friend by ID
export const getFriendById = async (req, res) => {
	const { friendId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(friendId)) {
		return res.status(400).json({ message: "Invalid friend ID" });
	}

	try {
		const friend = await User.findById(friendId).select("username email");
		if (!friend) return res.status(404).json({ message: "Friend not found" });
		res.status(200).json(friend);
	} catch (error) {
		console.error("Error fetching friend by ID:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

// Get friend by username
export const getFriendByUsername = async (req, res) => {
	const { username } = req.params;

	try {
		const friend = await User.findOne({ username }).select("username email");
		if (!friend) return res.status(404).json({ message: "Friend not found" });
		res.status(200).json(friend);
	} catch (error) {
		console.error("Error fetching friend by username:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
// export const getUsersForSidebar = async (req, res) => {
// 	try {
// 		const loggedInUserId = req.user._id;
// 		const filteredUsers = await User.find({
// 			_id: { $ne: loggedInUserId },
// 		}).select("-password");

// 		res.status(200).json(filteredUsers);
// 	} catch (error) {
// 		console.error("Error in getUsersForSidebar: ", error.message);
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// };

// Search users
export const searchUsers = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;
		// 		const filteredUsers = await User.find({
		// 			_id: { $ne: loggedInUserId },
		// 		}).select("-password");
		let users;
		// todo: should return existing contacts instead
		if (req.query.q.length < 1) {
			users = await User.find({ _id: { $ne: loggedInUserId } })
				.select("username email profilePic")
				.limit(10);
		} else {
			const query = req.query.q?.trim().toLowerCase() || "";
			// Exclude friends in the friends array
			users = await User.find({
				username: { $regex: query, $options: "i" },
				_id: { $ne: loggedInUserId },
			}).select("username email profilePic");
		}

		res.status(200).json(users);
	} catch (error) {
		console.error("Error searching users:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
