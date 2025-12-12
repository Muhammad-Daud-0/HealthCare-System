/** @format */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { NotificationProvider } from "@/components/NotificationProvider";
import Modal, { ConfirmModal } from "@/components/Modal";
import { authAPI, appointmentAPI } from "@/lib/api";
import { User, CreateAppointmentData } from "@/lib/types";

export default function BookAppointmentPage() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [doctors, setDoctors] = useState<User[]>([]);
	const [formData, setFormData] = useState<CreateAppointmentData>({
		doctorId: "",
		appointmentDate: "",
		appointmentTime: "",
		reason: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// Modal states
	const [confirmModal, setConfirmModal] = useState(false);
	const [successModal, setSuccessModal] = useState(false);

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		try {
			// Get user profile
			const profileRes = await authAPI.getProfile();
			if (profileRes.success && profileRes.data?.user) {
				setUser(profileRes.data.user);
			} else {
				router.push("/login");
				return;
			}

			// Get doctors list
			const doctorsRes = await authAPI.getDoctors();
			if (doctorsRes.success && doctorsRes.data) {
				setDoctors(doctorsRes.data.doctors);
			}
		} catch (error) {
			console.error("Failed to load data:", error);
		}
	};

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		// Validate form
		if (
			!formData.doctorId ||
			!formData.appointmentDate ||
			!formData.appointmentTime ||
			!formData.reason
		) {
			setError("Please fill in all required fields");
			return;
		}

		if (formData.reason.length < 10) {
			setError(
				"Please provide a more detailed reason (at least 10 characters)"
			);
			return;
		}

		// Show confirmation modal
		setConfirmModal(true);
	};

	const handleConfirmBooking = async () => {
		setLoading(true);
		setError("");

		try {
			const response = await appointmentAPI.createAppointment(formData);

			if (response.success) {
				setSuccessModal(true);
				setFormData({
					doctorId: "",
					appointmentDate: "",
					appointmentTime: "",
					reason: "",
				});
			} else {
				setError(response.message || "Failed to book appointment");
			}
		} catch (err) {
			setError("An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const getSelectedDoctorDetails = () => {
		const doctor = doctors.find((d: any) => d.id === formData.doctorId) as any;
		if (!doctor) return null;
		return `Dr. ${doctor.first_name} ${doctor.last_name} (${doctor.specialization})`;
	};

	const formatDate = (dateStr: string) => {
		if (!dateStr) return "";
		return new Date(dateStr).toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const formatTime = (timeStr: string) => {
		if (!timeStr) return "";
		const [hours, minutes] = timeStr.split(":");
		const hour = parseInt(hours);
		const ampm = hour >= 12 ? "PM" : "AM";
		const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
		return `${displayHour}:${minutes} ${ampm}`;
	};

	if (!user) {
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

				<div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="mb-8">
						<h1 className="text-4xl font-bold">
							<span className="text-gradient">Book Appointment</span>
						</h1>
						<p className="text-white/60 mt-2">
							Schedule an appointment with a doctor 📅
						</p>
					</div>

					<div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-2xl p-6">
						{error && (
							<div className="mb-6 bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl">
								{error}
							</div>
						)}

						<form onSubmit={handleFormSubmit} className="space-y-6">
							<div>
								<label
									htmlFor="doctor"
									className="block text-sm font-medium text-white/80 mb-2">
									🩺 Select Doctor *
								</label>
								<select
									id="doctor"
									required
									value={formData.doctorId}
									onChange={(e) =>
										setFormData({ ...formData, doctorId: e.target.value })
									}
									className="w-full px-4 py-3 text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all">
									<option value="" className="bg-[#0a0a0f]">
										Choose a doctor
									</option>
									{doctors.map((doctor: any) => (
										<option
											key={doctor.id}
											value={doctor.id}
											className="bg-[#0a0a0f]">
											Dr. {doctor.first_name} {doctor.last_name} -{" "}
											{doctor.specialization}
										</option>
									))}
								</select>
							</div>

							<div>
								<label
									htmlFor="date"
									className="block text-sm font-medium text-white/80 mb-2">
									📅 Appointment Date *
								</label>
								<input
									id="date"
									type="date"
									required
									min={new Date().toISOString().split("T")[0]}
									value={formData.appointmentDate}
									onChange={(e) =>
										setFormData({
											...formData,
											appointmentDate: e.target.value,
										})
									}
									className="w-full px-4 py-3 text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all [color-scheme:dark]"
								/>
							</div>

							<div>
								<label
									htmlFor="time"
									className="block text-sm font-medium text-white/80 mb-2">
									🕐 Appointment Time *
								</label>
								<select
									id="time"
									required
									value={formData.appointmentTime}
									onChange={(e) =>
										setFormData({
											...formData,
											appointmentTime: e.target.value,
										})
									}
									className="w-full px-4 py-3 text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all">
									<option value="" className="bg-[#0a0a0f]">
										Choose a time
									</option>
									<option value="09:00" className="bg-[#0a0a0f]">
										09:00 AM
									</option>
									<option value="09:30" className="bg-[#0a0a0f]">
										09:30 AM
									</option>
									<option value="10:00" className="bg-[#0a0a0f]">
										10:00 AM
									</option>
									<option value="10:30" className="bg-[#0a0a0f]">
										10:30 AM
									</option>
									<option value="11:00" className="bg-[#0a0a0f]">
										11:00 AM
									</option>
									<option value="11:30" className="bg-[#0a0a0f]">
										11:30 AM
									</option>
									<option value="12:00" className="bg-[#0a0a0f]">
										12:00 PM
									</option>
									<option value="14:00" className="bg-[#0a0a0f]">
										02:00 PM
									</option>
									<option value="14:30" className="bg-[#0a0a0f]">
										02:30 PM
									</option>
									<option value="15:00" className="bg-[#0a0a0f]">
										03:00 PM
									</option>
									<option value="15:30" className="bg-[#0a0a0f]">
										03:30 PM
									</option>
									<option value="16:00" className="bg-[#0a0a0f]">
										04:00 PM
									</option>
									<option value="16:30" className="bg-[#0a0a0f]">
										04:30 PM
									</option>
									<option value="17:00" className="bg-[#0a0a0f]">
										05:00 PM
									</option>
								</select>
							</div>

							<div>
								<label
									htmlFor="reason"
									className="block text-sm font-medium text-white/80 mb-2">
									📋 Reason *{" "}
									<span className="text-white/40 text-xs">
										(min. 10 characters)
									</span>
								</label>
								<textarea
									id="reason"
									required
									rows={4}
									minLength={10}
									value={formData.reason}
									onChange={(e) =>
										setFormData({ ...formData, reason: e.target.value })
									}
									className="w-full px-4 py-3 text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 resize-none placeholder-white/40 transition-all"
									placeholder="Describe your symptoms or reason for consultation (at least 10 characters)"
								/>
								<p className="mt-1 text-xs text-white/40">
									{formData.reason.length}/10 characters minimum
								</p>
							</div>

							<div className="flex flex-col sm:flex-row gap-4 pt-4">
								<button
									type="submit"
									disabled={loading}
									className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-[0_4px_15px_rgba(6,182,212,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(6,182,212,0.4)] transition-all duration-300 py-3 px-4 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
									{loading ? "Booking..." : "📅 Book Appointment"}
								</button>
								<button
									type="button"
									onClick={() => router.push("/patient/dashboard")}
									className="bg-transparent border border-white/20 text-white/80 hover:bg-white/5 hover:border-cyan-500/50 hover:text-white transition-all duration-300 px-6 py-3 rounded-xl text-sm font-medium">
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>

				{/* Confirmation Modal */}
				<Modal
					isOpen={confirmModal}
					onClose={() => setConfirmModal(false)}
					title="Confirm Appointment">
					<div className="space-y-4">
						<p className="text-white/70">
							Please review your appointment details:
						</p>

						<div className="bg-white/5 rounded-xl p-4 space-y-2 border border-white/10">
							<p className="text-sm">
								<span className="font-medium text-white/60">🩺 Doctor:</span>{" "}
								<span className="text-white">{getSelectedDoctorDetails()}</span>
							</p>
							<p className="text-sm">
								<span className="font-medium text-white/60">📅 Date:</span>{" "}
								<span className="text-white">
									{formatDate(formData.appointmentDate)}
								</span>
							</p>
							<p className="text-sm">
								<span className="font-medium text-white/60">🕐 Time:</span>{" "}
								<span className="text-white">
									{formatTime(formData.appointmentTime)}
								</span>
							</p>
							<p className="text-sm">
								<span className="font-medium text-white/60">📋 Reason:</span>{" "}
								<span className="text-white">{formData.reason}</span>
							</p>
						</div>

						<div className="flex justify-end space-x-3 pt-4">
							<button
								onClick={() => setConfirmModal(false)}
								className="px-4 py-2 text-sm font-medium text-white/70 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
								Go Back
							</button>
							<button
								onClick={() => {
									setConfirmModal(false);
									handleConfirmBooking();
								}}
								disabled={loading}
								className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl hover:from-cyan-400 hover:to-purple-400 disabled:opacity-50 transition-all shadow-lg shadow-cyan-500/25">
								{loading ? "Booking..." : "✓ Confirm Booking"}
							</button>
						</div>
					</div>
				</Modal>

				{/* Success Modal */}
				<Modal
					isOpen={successModal}
					onClose={() => {}}
					title="🎉 Appointment Booked!">
					<div className="text-center space-y-4">
						<div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
							<svg
								className="w-8 h-8 text-emerald-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
						<p className="text-white/70">
							Your appointment has been successfully booked and is pending
							approval from the doctor.
						</p>
						<button
							onClick={() => router.push("/patient/appointments")}
							className="w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl hover:from-cyan-400 hover:to-purple-400 transition-all shadow-lg shadow-cyan-500/25">
							📋 View My Appointments
						</button>
					</div>
				</Modal>
			</div>
		</NotificationProvider>
	);
}
