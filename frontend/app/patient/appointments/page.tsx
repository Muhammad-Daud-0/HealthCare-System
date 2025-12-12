/** @format */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { NotificationProvider } from "@/components/NotificationProvider";
import { ConfirmModal } from "@/components/Modal";
import { authAPI, appointmentAPI } from "@/lib/api";
import { User, Appointment } from "@/lib/types";

export default function PatientAppointmentsPage() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [filter, setFilter] = useState<string>("ALL");
	const [loading, setLoading] = useState(true);

	// Modal state
	const [cancelModal, setCancelModal] = useState<{
		open: boolean;
		appointmentId: string | null;
	}>({
		open: false,
		appointmentId: null,
	});

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

			const appointmentsRes = await appointmentAPI.getMyAppointments();
			if (appointmentsRes.success && appointmentsRes.data) {
				setAppointments(appointmentsRes.data.appointments);
			}
		} catch (error) {
			console.error("Failed to load data:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleCancelAppointment = async () => {
		if (!cancelModal.appointmentId) return;
		const response = await appointmentAPI.cancelAppointment(
			cancelModal.appointmentId
		);
		if (response.success) {
			loadData();
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

	const getCancellationContext = (appointment: any) => {
		if (appointment.status === "CANCELLED") {
			const cancelledBy = appointment.cancelledBy;
			if (cancelledBy === "PATIENT") {
				return (
					<span className="text-xs text-red-400 ml-2">(Cancelled by you)</span>
				);
			} else if (cancelledBy === "DOCTOR") {
				return (
					<span className="text-xs text-red-400 ml-2">
						(Cancelled by doctor)
					</span>
				);
			} else if (cancelledBy === "ADMIN") {
				return (
					<span className="text-xs text-red-400 ml-2">
						(Cancelled by admin)
					</span>
				);
			}
		}
		if (appointment.status === "REJECTED") {
			return (
				<span className="text-xs text-orange-400 ml-2">
					(Rejected by doctor)
				</span>
			);
		}
		return null;
	};

	const filteredAppointments = appointments.filter((apt) => {
		if (filter === "ALL") return true;
		return apt.status === filter;
	});

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
					<div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
						<div>
							<h1 className="text-4xl font-bold">
								<span className="text-gradient">My Appointments</span>
							</h1>
							<p className="text-white/60 mt-2">
								View and manage your appointments
							</p>
						</div>
						<button
							onClick={() => router.push("/patient/book-appointment")}
							className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-[0_4px_15px_rgba(6,182,212,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(6,182,212,0.4)] transition-all duration-300 px-6 py-3 rounded-xl font-medium">
							📅 Book New Appointment
						</button>
					</div>

					{/* Filters */}
					<div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-2xl p-4 mb-6">
						<div className="flex flex-wrap gap-2">
							{[
								"ALL",
								"PENDING",
								"APPROVED",
								"COMPLETED",
								"CANCELLED",
								"REJECTED",
							].map((status) => (
								<button
									key={status}
									onClick={() => setFilter(status)}
									className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
										filter === status
											? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25"
											: "bg-white/10 text-white/70 hover:bg-white/20"
									}`}>
									{status}
								</button>
							))}
						</div>
					</div>

					{/* Appointments List */}
					<div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden">
						<div className="divide-y divide-white/10">
							{filteredAppointments.length === 0 ? (
								<div className="p-8 text-center">
									<div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
										<span className="text-3xl">📭</span>
									</div>
									<p className="text-white/60">No appointments found.</p>
								</div>
							) : (
								filteredAppointments.map((appointment) => (
									<div
										key={appointment.id}
										className="p-6 hover:bg-white/5 transition-colors">
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<div className="flex items-center flex-wrap gap-2 mb-2">
													<h3 className="text-lg font-medium text-white">
														🩺 Dr.{" "}
														{(appointment as any).doctorName ||
															appointment.doctorEmail?.split("@")[0] ||
															"Unknown"}
													</h3>
													<span
														className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
															appointment.status
														)}`}>
														{appointment.status}
													</span>
													{getCancellationContext(appointment)}
												</div>
												{((appointment as any).doctorSpecialization ||
													appointment.doctorSpecialization) && (
													<p className="text-sm text-purple-400 mb-3">
														{(appointment as any).doctorSpecialization ||
															appointment.doctorSpecialization}
													</p>
												)}
												<div className="space-y-2">
													<p className="text-sm text-white/60">
														<span className="font-medium text-white/80">
															📅 Date:
														</span>{" "}
														{new Date(
															(appointment as any).date ||
																appointment.appointmentDate
														).toLocaleDateString("en-US", {
															weekday: "long",
															year: "numeric",
															month: "long",
															day: "numeric",
														})}
													</p>
													<p className="text-sm text-white/60">
														<span className="font-medium text-white/80">
															🕐 Time:
														</span>{" "}
														{(appointment as any).time ||
															appointment.appointmentTime}
													</p>
													<p className="text-sm text-white/60">
														<span className="font-medium text-white/80">
															📋 Reason:
														</span>{" "}
														{appointment.reason}
													</p>
													{appointment.notes && (
														<p className="text-sm text-white/60">
															<span className="font-medium text-white/80">
																📝 Notes:
															</span>{" "}
															{appointment.notes}
														</p>
													)}
													{(appointment.createdAt ||
														(appointment as any).created_at) && (
														<p className="text-xs text-white/40 mt-3">
															Booked on{" "}
															{new Date(
																appointment.createdAt ||
																	(appointment as any).created_at
															).toLocaleString()}
														</p>
													)}
												</div>
											</div>
											<div className="ml-6">
												{(appointment.status === "PENDING" ||
													appointment.status === "APPROVED") && (
													<button
														onClick={() =>
															setCancelModal({
																open: true,
																appointmentId: appointment.id,
															})
														}
														className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 border border-red-500/50 rounded-xl hover:bg-red-500/10 transition-all">
														Cancel
													</button>
												)}
											</div>
										</div>
									</div>
								))
							)}
						</div>
					</div>
				</div>

				{/* Cancel Confirmation Modal */}
				<ConfirmModal
					isOpen={cancelModal.open}
					onClose={() => setCancelModal({ open: false, appointmentId: null })}
					onConfirm={handleCancelAppointment}
					title="Cancel Appointment"
					message="Are you sure you want to cancel this appointment? This action cannot be undone."
					confirmText="Cancel Appointment"
					variant="danger"
				/>
			</div>
		</NotificationProvider>
	);
}
