/** @format */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { NotificationProvider } from "@/components/NotificationProvider";
import { authAPI } from "@/lib/api";
import { User } from "@/lib/types";

export default function AdminUsersPage() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [users, setUsers] = useState<User[]>([]);
	const [filter, setFilter] = useState<string>("ALL");
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		try {
			const profileRes = await authAPI.getProfile();
			if (profileRes.success && profileRes.data?.user) {
				setUser(profileRes.data.user);
			} else {
				router.push("/login");
				return;
			}

			const usersRes = await authAPI.getAllUsers();
			if (usersRes.success && usersRes.data) {
				setUsers(usersRes.data.users);
			}
		} catch (error) {
			console.error("Failed to load data:", error);
		} finally {
			setLoading(false);
		}
	};

	const filteredUsers = users
		.filter((usr) => {
			if (filter === "ALL") return true;
			return usr.role === filter;
		})
		.filter((usr) => {
			if (!searchTerm) return true;
			return (
				usr.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
				usr.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
			);
		});

	const getRoleBadgeColor = (role: string) => {
		switch (role) {
			case "ADMIN":
				return "bg-purple-500/20 text-purple-400 border border-purple-500/30";
			case "DOCTOR":
				return "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30";
			case "PATIENT":
				return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
			default:
				return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
		}
	};

	const getRoleEmoji = (role: string) => {
		switch (role) {
			case "ADMIN":
				return "🛡️";
			case "DOCTOR":
				return "🩺";
			case "PATIENT":
				return "👤";
			default:
				return "👥";
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0f1729] flex items-center justify-center">
				<div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 rounded-2xl">
					<div className="flex items-center space-x-3">
						<div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
						<span className="text-white text-lg">Loading...</span>
					</div>
				</div>
			</div>
		);
	}

	if (!user) {
		return null;
	}

	return (
		<NotificationProvider userId={user.id}>
			<div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0f1729]">
				{/* Animated background blobs */}
				<div className="fixed inset-0 overflow-hidden pointer-events-none">
					<div className="absolute rounded-full blur-[80px] opacity-50 animate-blob w-[600px] h-[600px] bg-purple-500/10 top-0 -right-64"></div>
					<div
						className="absolute rounded-full blur-[80px] opacity-50 animate-blob w-[500px] h-[500px] bg-cyan-500/10 top-1/2 -left-48"
						style={{ animationDelay: "-5s" }}></div>
					<div
						className="absolute rounded-full blur-[80px] opacity-50 animate-blob w-[400px] h-[400px] bg-pink-500/10 -bottom-32 right-1/3"
						style={{ animationDelay: "-10s" }}></div>
				</div>

				<Navbar userEmail={user.email} userRole={user.role} />

				<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="mb-8">
						<h1 className="text-4xl font-bold">
							<span className="text-gradient">User Management</span>
						</h1>
						<p className="text-white/60 mt-2">
							View and manage all system users 👥
						</p>
					</div>

					{/* Filters and Search */}
					<div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-2xl p-4 mb-6">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
							<div className="flex space-x-2">
								{["ALL", "ADMIN", "DOCTOR", "PATIENT"].map((role) => (
									<button
										key={role}
										onClick={() => setFilter(role)}
										className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
											filter === role
												? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25"
												: "bg-white/10 text-white/70 hover:bg-white/20"
										}`}>
										{role === "ALL"
											? "👥 ALL"
											: `${getRoleEmoji(role)} ${role}`}
									</button>
								))}
							</div>
							<input
								type="text"
								placeholder="🔍 Search users..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="px-4 py-2 text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 placeholder-white/40 transition-all"
							/>
						</div>
					</div>

					{/* Stats */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
						<div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 rounded-2xl hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(6,182,212,0.15)] transition-all duration-300">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="text-sm font-medium text-white/60">
										Total Users
									</h3>
									<p className="text-3xl font-bold text-white mt-2">
										{users.length}
									</p>
								</div>
								<div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
									<span className="text-2xl">👥</span>
								</div>
							</div>
						</div>
						<div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 rounded-2xl hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(6,182,212,0.15)] transition-all duration-300">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="text-sm font-medium text-white/60">Admins</h3>
									<p className="text-3xl font-bold text-purple-400 mt-2">
										{users.filter((u) => u.role === "ADMIN").length}
									</p>
								</div>
								<div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
									<span className="text-2xl">🛡️</span>
								</div>
							</div>
						</div>
						<div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 rounded-2xl hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(6,182,212,0.15)] transition-all duration-300">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="text-sm font-medium text-white/60">Doctors</h3>
									<p className="text-3xl font-bold text-cyan-400 mt-2">
										{users.filter((u) => u.role === "DOCTOR").length}
									</p>
								</div>
								<div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
									<span className="text-2xl">🩺</span>
								</div>
							</div>
						</div>
						<div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 rounded-2xl hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(6,182,212,0.15)] transition-all duration-300">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="text-sm font-medium text-white/60">
										Patients
									</h3>
									<p className="text-3xl font-bold text-emerald-400 mt-2">
										{users.filter((u) => u.role === "PATIENT").length}
									</p>
								</div>
								<div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
									<span className="text-2xl">👤</span>
								</div>
							</div>
						</div>
					</div>

					{/* Users Table */}
					<div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden">
						<div className="overflow-x-auto">
							<table className="min-w-full">
								<thead>
									<tr className="border-b border-white/10">
										<th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
											User
										</th>
										<th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
											Role
										</th>
										<th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
											Specialization
										</th>
										<th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
											Joined
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-white/10">
									{filteredUsers.length === 0 ? (
										<tr>
											<td colSpan={4} className="px-6 py-12 text-center">
												<div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
													<span className="text-3xl">🔍</span>
												</div>
												<p className="text-white/60">No users found</p>
											</td>
										</tr>
									) : (
										filteredUsers.map((usr) => (
											<tr
												key={usr.id}
												className="hover:bg-white/5 transition-colors">
												<td className="px-6 py-4">
													<div className="flex items-center">
														<div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-xl flex items-center justify-center border border-white/20">
															<span className="text-lg">
																{getRoleEmoji(usr.role)}
															</span>
														</div>
														<div className="ml-4">
															<div className="text-sm font-medium text-white">
																{usr.email}
															</div>
															<div className="text-sm text-white/40">
																ID: {usr.id.slice(0, 8)}...
															</div>
														</div>
													</div>
												</td>
												<td className="px-6 py-4">
													<span
														className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(
															usr.role
														)}`}>
														{usr.role}
													</span>
												</td>
												<td className="px-6 py-4 text-sm text-white/60">
													{usr.specialization || "-"}
												</td>
												<td className="px-6 py-4 text-sm text-white/60">
													{new Date(usr.createdAt).toLocaleDateString("en-US", {
														month: "short",
														day: "numeric",
														year: "numeric",
													})}
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</NotificationProvider>
	);
}
