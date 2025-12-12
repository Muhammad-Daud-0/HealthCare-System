/** @format */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { NotificationProvider } from "@/components/NotificationProvider";
import Modal, { ConfirmModal, InputModal } from "@/components/Modal";
import { authAPI, appointmentAPI } from "@/lib/api";
import { User, Appointment } from "@/lib/types";

export default function DoctorDashboard() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [stats, setStats] = useState({
		total: 0,
		pending: 0,
		approved: 0,
		completed: 0,
		rejected: 0,
	});
	const [loading, setLoading] = useState(true);

	// Modal states
	const [cancelModal, setCancelModal] = useState<{
		open: boolean;
		appointmentId: string | null;
	}>({
		open: false,
		appointmentId: null,
	});
	const [rejectModal, setRejectModal] = useState<{
		open: boolean;
		appointmentId: string | null;
	}>({
		open: false,
		appointmentId: null,
	});
	const [completeModal, setCompleteModal] = useState<{
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
				const appts = appointmentsRes.data.appointments;
				setAppointments(appts);

				setStats({
					total: appts.length,
					pending: appts.filter((a) => a.status === "PENDING").length,
					approved: appts.filter((a) => a.status === "APPROVED").length,
					completed: appts.filter((a) => a.status === "COMPLETED").length,
					rejected: appts.filter((a) => a.status === "REJECTED").length,
				});
			}
		} catch (error) {
			console.error("Failed to load data:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleApprove = async (id: string) => {
		const response = await appointmentAPI.approveAppointment(id);
		if (response.success) {
			loadData();
		}
	};

	const handleComplete = async (notes: string) => {
		if (!completeModal.appointmentId) return;
		const response = await appointmentAPI.completeAppointment(
			completeModal.appointmentId,
			notes || undefined
		);
		if (response.success) {
			loadData();
		}
	};

	const handleCancel = async () => {
		if (!cancelModal.appointmentId) return;
		const response = await appointmentAPI.cancelAppointment(
			cancelModal.appointmentId
		);
		if (response.success) {
			loadData();
		}
	};

	const handleReject = async (reason: string) => {
		if (!rejectModal.appointmentId) return;
		const response = await appointmentAPI.rejectAppointment(
			rejectModal.appointmentId,
			reason || undefined
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
			if (cancelledBy === "DOCTOR") {
				return (
					<span className="text-xs text-red-400 ml-2">(Cancelled by you)</span>
				);
			} else if (cancelledBy === "PATIENT") {
				return (
					<span className="text-xs text-red-400 ml-2">
						(Cancelled by patient)
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
				<span className="text-xs text-orange-400 ml-2">(Rejected by you)</span>
			);
		}
		return null;
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
							<span className="text-gradient">Doctor Dashboard</span>
						</h1>
						<p className="text-white/60 mt-2 text-lg">
							🩺 Dr. {user.firstName} {user.lastName} -{" "}
							<span className="text-purple-400">{user.specialization}</span>
						</p>
					</div>

					{/* Stats */}
					<div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
						<div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 rounded-2xl hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(6,182,212,0.15)] transition-all duration-300">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="text-sm font-medium text-white/60">Total</h3>
									<p className="text-3xl font-bold text-white mt-2">
										{stats.total}
									</p>
								</div>
								<div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
									<span className="text-2xl">📊</span>
								</div>
							</div>
						</div>
						<div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 rounded-2xl hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(6,182,212,0.15)] transition-all duration-300">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="text-sm font-medium text-white/60">Pending</h3>
									<p className="text-3xl font-bold text-yellow-400 mt-2">
										{stats.pending}
									</p>
								</div>
								<div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
									<span className="text-2xl">⏳</span>
								</div>
							</div>
						</div>
						<div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 rounded-2xl hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(6,182,212,0.15)] transition-all duration-300">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="text-sm font-medium text-white/60">
										Approved
									</h3>
									<p className="text-3xl font-bold text-emerald-400 mt-2">
										{stats.approved}
									</p>
								</div>
								<div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
									<span className="text-2xl">✅</span>
								</div>
							</div>
						</div>
						<div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 rounded-2xl hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(6,182,212,0.15)] transition-all duration-300">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="text-sm font-medium text-white/60">
										Completed
									</h3>
									<p className="text-3xl font-bold text-cyan-400 mt-2">
										{stats.completed}
									</p>
								</div>
								<div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
									<span className="text-2xl">🎉</span>
								</div>
							</div>
						</div>
						<div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 rounded-2xl hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(6,182,212,0.15)] transition-all duration-300">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="text-sm font-medium text-white/60">
										Rejected
									</h3>
									<p className="text-3xl font-bold text-orange-400 mt-2">
										{stats.rejected}
									</p>
								</div>
								<div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
									<span className="text-2xl">❌</span>
								</div>
							</div>
						</div>
					</div>

					{/* Pending Appointments */}
					{stats.pending > 0 && (
						<div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden mb-8 border border-yellow-500/30">
							<div className="p-6 border-b border-white/10 bg-yellow-500/10">
								<h2 className="text-xl font-semibold text-white flex items-center">
									<span className="mr-2">⚠️</span> Pending Approval (
									{stats.pending})
								</h2>
							</div>
							<div className="divide-y divide-white/10">
								{appointments
									.filter((a) => a.status === "PENDING")
									.map((appointment) => (
										<div
											key={appointment.id}
											className="p-6 hover:bg-white/5 transition-colors">
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<h3 className="text-lg font-medium text-white">
														👤 Patient:{" "}
														{(appointment as any).patientName ||
															appointment.patientEmail ||
															"Unknown"}
													</h3>
													<p className="text-sm text-white/60 mt-2">
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
														})}{" "}
														at{" "}
														{(appointment as any).time ||
															appointment.appointmentTime}
													</p>
													<p className="text-sm text-white/60 mt-1">
														<span className="font-medium text-white/80">
															📋 Reason:
														</span>{" "}
														{appointment.reason}
													</p>
												</div>
												<div className="ml-6 flex space-x-2">
													<button
														onClick={() => handleApprove(appointment.id)}
														className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-lg shadow-emerald-500/25">
														✓ Approve
													</button>
													<button
														onClick={() =>
															setRejectModal({
																open: true,
																appointmentId: appointment.id,
															})
														}
														className="px-4 py-2 text-sm font-medium text-orange-400 hover:text-orange-300 border border-orange-500/50 rounded-xl hover:bg-orange-500/10 transition-all">
														Reject
													</button>
												</div>
											</div>
										</div>
									))}
							</div>
						</div>
					)}

					{/* All Appointments */}
					<div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden">
						<div className="p-6 border-b border-white/10">
							<h2 className="text-xl font-semibold text-white flex items-center">
								<span className="mr-2">🗓️</span> All Appointments
							</h2>
						</div>
						<div className="divide-y divide-white/10">
							{appointments.length === 0 ? (
								<div className="p-8 text-center">
									<div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
										<span className="text-3xl">📭</span>
									</div>
									<p className="text-white/60">No appointments found.</p>
								</div>
							) : (
								appointments.map((appointment) => (
									<div
										key={appointment.id}
										className="p-6 hover:bg-white/5 transition-colors">
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<div className="flex items-center space-x-3 mb-2">
													<h3 className="text-lg font-medium text-white">
														👤 Patient:{" "}
														{(appointment as any).patientName ||
															appointment.patientEmail ||
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
												<div className="space-y-1">
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
														})}{" "}
														at{" "}
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
												</div>
											</div>
											<div className="ml-6 flex space-x-2">
												{appointment.status === "APPROVED" && (
													<button
														onClick={() =>
															setCompleteModal({
																open: true,
																appointmentId: appointment.id,
															})
														}
														className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-all shadow-lg shadow-cyan-500/25">
														✓ Complete
													</button>
												)}
												{appointment.status === "APPROVED" && (
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
					onConfirm={handleCancel}
					title="Cancel Appointment"
					message="Are you sure you want to cancel this appointment? This action cannot be undone."
					confirmText="Cancel Appointment"
					variant="danger"
				/>

				{/* Reject Modal with Reason */}
				<InputModal
					isOpen={rejectModal.open}
					onClose={() => setRejectModal({ open: false, appointmentId: null })}
					onSubmit={handleReject}
					title="Reject Appointment"
					message="Please provide a reason for rejecting this appointment (optional):"
					placeholder="Enter rejection reason..."
					submitText="Reject Appointment"
				/>

				{/* Complete Modal with Notes */}
				<InputModal
					isOpen={completeModal.open}
					onClose={() => setCompleteModal({ open: false, appointmentId: null })}
					onSubmit={handleComplete}
					title="Complete Appointment"
					message="Add any notes for this appointment (optional):"
					placeholder="Enter completion notes..."
					submitText="Mark Complete"
				/>
			</div>
		</NotificationProvider>
	);
}
