import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const useAuthStore = create((set) => ({
	authUser: null,
	isSigningUp: false,
	isLoggingIn: false,
	isUpdatingProfile: false,
	isCheckingAuth: true,
	checkAuth: async () => {
		try {
			const response = await axiosInstance.get("/auth/check");
			console.log(response);
			set({ authUser: response.data });
		} catch (error) {
			console.log(error);
			set({ authUser: null });
		} finally {
			set({ isCheckingAuth: false });
		}
	},
	signup: async (data) => {
		set({ isSigningUp: true });
		try {
			const response = await axiosInstance.post("/auth/signup", data);
			set({ authUser: response.data });
			toast.success("Account created successfully!");
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			set({ isSigningUp: false });
		}
	},
	logout: async () => {
		try {
			await axiosInstance.post("/auth/logout");
			set({ authUser: null });
			toast.success("Logout successfully!");
		} catch (error) {
			toast.error(error.response.data.message);
		}
	},
}));
