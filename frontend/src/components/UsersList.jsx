import UserItem from "./UserItem";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

export default function UsersList({ users }) {
	const { selectedUser, setSelectedUser } = useChatStore();
	const { onlineUsers } = useAuthStore();
	return (
		<div>
			{users.map((user) => (
				<div
					onClick={() => setSelectedUser(user)}
					style={
						selectedUser?._id === user._id ? { backgroundColor: "#e0e0e0" } : {}
					}>
					<UserItem user={user} />
				</div>
			))}
		</div>
	);
}
