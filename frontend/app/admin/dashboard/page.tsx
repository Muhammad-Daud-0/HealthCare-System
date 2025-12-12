/** @format */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { NotificationProvider } from "@/components/NotificationProvider";
import { authAPI, appointmentAPI } from "@/lib/api";
import { User, Appointment } from "@/lib/types";

export default function AdminDashboard() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [users, setUsers] = useState<User[]>([]);
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [stats, setStats] = useState({
		totalUsers: 0,
		totalPatients: 0,
		totalDoctors: 0,
		totalAppointments: 0,
	});
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
				const allUsers = usersRes.data.users;
				setUsers(allUsers);
				setStats({
					totalUsers: allUsers.length,
					totalPatients: allUsers.filter((u) => u.role === "PATIENT").length,
					totalDoctors: allUsers.filter((u) => u.role === "DOCTOR").length,
					totalAppointments: 0,
				});
			}

			const appointmentsRes = await appointmentAPI.getAllAppointments();
			if (appointmentsRes.success && appointmentsRes.data) {
				const allAppointments = appointmentsRes.data.appointments;
				setAppointments(allAppointments);
				setStats((prev) => ({
					...prev,
					totalAppointments: allAppointments.length,
				}));
			}
		} catch (error) {
			console.error("Failed to load data:", error);
		} finally {
			setLoading(false);
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "PENDING":
				return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
			case "APPROVED":
				return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
			case "COMPLETED":
				return "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30";
			case "CANCELLED":
				return "bg-red-500/20 text-red-400 border border-red-500/30";
			case "REJECTED":
				return "bg-orange-500/20 text-orange-400 border border-orange-500/30";
			default:
				return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
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
					<div className="absolute rounded-full blur-[80px] opacity-50 animate-blob w-[600px] h-[600px] bg-cyan-500/10 top-0 -left-64"></div>
					<div
						className="absolute rounded-full blur-[80px] opacity-50 animate-blob w-[500px] h-[500px] bg-purple-500/10 top-1/2 -right-48"
						style={{ animationDelay: "-5s" }}></div>
					<div
						className="absolute rounded-full blur-[80px] opacity-50 animate-blob w-[400px] h-[400px] bg-pink-500/10 -bottom-32 left-1/3"
						style={{ animationDelay: "-10s" }}></div>
				</div>

				<Navbar userEmail={user.email} userRole={user.role} />

				<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{/* Header */}
					<div className="mb-8">
						<h1 className="text-4xl font-bold">
							<span className="text-gradient">Admin Dashboard</span>
						</h1>
						<p className="text-white/60 mt-2 text-lg">
							🛡️ System overview and management
						</p>
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
										{stats.totalUsers}
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
									<h3 className="text-sm font-medium text-white/60">
										Patients
									</h3>
									<p className="text-3xl font-bold text-cyan-400 mt-2">
										{stats.totalPatients}
									</p>
								</div>
								<div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
									<span className="text-2xl">🏥</span>
								</div>
							</div>
						</div>
						<div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 rounded-2xl hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(6,182,212,0.15)] transition-all duration-300">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="text-sm font-medium text-white/60">Doctors</h3>
									<p className="text-3xl font-bold text-emerald-400 mt-2">
										{stats.totalDoctors}
									</p>
								</div>
								<div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
									<span className="text-2xl">🩺</span>
								</div>
							</div>
						</div>
						<div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 rounded-2xl hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(6,182,212,0.15)] transition-all duration-300">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="text-sm font-medium text-white/60">
										Total Appointments
									</h3>
									<p className="text-3xl font-bold text-purple-400 mt-2">
										{stats.totalAppointments}
									</p>
								</div>
								<div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
									<span className="text-2xl">📅</span>
								</div>
							</div>
						</div>
					</div>

					{/* Quick Actions */}
					<div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 rounded-2xl mb-8">
						<h2 className="text-xl font-semibold text-white mb-4 flex items-center">
							<span className="mr-2">⚡</span> Quick Actions
						</h2>
						<div className="flex flex-wrap gap-4">
							<button
								onClick={() => router.push("/admin/users")}
								className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-[0_4px_15px_rgba(6,182,212,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(6,182,212,0.4)] transition-all duration-300 px-6 py-3 rounded-xl font-medium">
								👥 Manage Users
							</button>
							<button
								onClick={() => router.push("/admin/appointments")}
								className="bg-transparent border border-white/20 text-white/80 hover:bg-white/5 hover:border-cyan-500/50 hover:text-white transition-all duration-300 px-6 py-3 rounded-xl font-medium">
								📋 View All Appointments
							</button>
						</div>
					</div>

					{/* Recent Activity */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Recent Users */}
						<div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden">
							<div className="p-6 border-b border-white/10">
								<h2 className="text-xl font-semibold text-white flex items-center">
									<span className="mr-2">👤</span> Recent Users
								</h2>
							</div>
							<div className="divide-y divide-white/10">
								{users.slice(0, 5).map((usr) => (
									<div
										key={usr.id}
										className="p-4 hover:bg-white/5 transition-colors">
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm font-medium text-white">
													{usr.email}
												</p>
												<p className="text-xs text-white/60">{usr.role}</p>
												{usr.specialization && (
													<p className="text-xs text-purple-400">
														{usr.specialization}
													</p>
												)}
											</div>
											<span className="text-xs text-white/40">
												{new Date(usr.createdAt).toLocaleDateString()}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Recent Appointments */}
						<div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden">
							<div className="p-6 border-b border-white/10">
								<h2 className="text-xl font-semibold text-white flex items-center">
									<span className="mr-2">🗓️</span> Recent Appointments
								</h2>
							</div>
							<div className="divide-y divide-white/10">
								{appointments.slice(0, 5).map((apt) => (
									<div
										key={apt.id}
										className="p-4 hover:bg-white/5 transition-colors">
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm font-medium text-white">
													{(apt as any).patientName ||
														apt.patientEmail ||
														"Unknown"}{" "}
													→ 🩺 Dr.{" "}
													{(apt as any).doctorName ||
														apt.doctorEmail ||
														"Unknown"}
												</p>
												<p className="text-xs text-white/60">
													{new Date(
														(apt as any).date || apt.appointmentDate
													).toLocaleDateString("en-US", {
														weekday: "short",
														month: "short",
														day: "numeric",
													})}{" "}
													at {(apt as any).time || apt.appointmentTime}
												</p>
											</div>
											<span
												className={`text-xs px-3 py-1 rounded-full ${getStatusColor(
													apt.status
												)}`}>
												{apt.status}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</NotificationProvider>
	);
}
