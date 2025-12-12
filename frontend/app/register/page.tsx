/** @format */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authAPI } from "@/lib/api";
import { UserRole } from "@/lib/types";

const AUTH_SERVICE_URL =
	process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:3001";

export default function RegisterPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
		phone: "",
		role: UserRole.PATIENT,
		specialization: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [focusedField, setFocusedField] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (formData.password.length < 6) {
			setError("Password must be at least 6 characters");
			return;
		}

		if (!formData.phone || formData.phone.trim() === "") {
			setError("Phone number is required");
			return;
		}

		if (formData.role === UserRole.DOCTOR && !formData.specialization) {
			setError("Specialization is required for doctors");
			return;
		}

		setLoading(true);

		try {
			const response = await authAPI.register(
				formData.email,
				formData.password,
				formData.firstName,
				formData.lastName,
				formData.role,
				formData.phone,
				formData.role === UserRole.DOCTOR ? formData.specialization : undefined
			);

			if (response.success) {
				router.push("/login");
			} else {
				setError(response.message || "Registration failed");
			}
		} catch (err) {
			setError("An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleSignUp = () => {
		window.location.href = `${AUTH_SERVICE_URL}/api/auth/google`;
	};

	const getInputClasses = (fieldName: string, value: string) => {
		const isFocused = focusedField === fieldName;

		return `w-full text-white text-base outline-none transition-colors duration-300 ease-out bg-transparent py-3 px-3 ${
			isFocused ? "input-focus-gradient" : "border-b border-white/20"
		}`;
	};

	const getLabelClasses = (fieldName: string, value: string) => {
		const isFocused = focusedField === fieldName;
		const hasValue = value.length > 0;
		const isFloating = isFocused || hasValue;

		return `absolute left-3 transition-all duration-300 ease-out pointer-events-none ${
			isFloating
				? `top-0 -translate-y-1/2 text-xs px-2 py-0.5 rounded-full z-10 border ${
						isFocused
							? "text-purple-500 border-purple-500/50 left-4"
							: "text-purple-500 border-purple-500/50 left-2"
						// : "text-white/60 border-white/20 left-2"
				  }`
				: "top-1/2 -translate-y-1/2 text-base text-white/50"
		}`;
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0f1729] bg-[length:400%_400%] animate-gradient-shift relative overflow-hidden flex items-center justify-center p-4 py-12">
			{/* Animated background blobs */}
			<div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-[80px] opacity-50 top-0 right-0 animate-blob" />
			<div
				className="absolute w-80 h-80 bg-cyan-500/20 rounded-full blur-[80px] opacity-50 bottom-0 left-0 animate-blob"
				style={{ animationDelay: "-5s" }}
			/>
			<div
				className="absolute w-64 h-64 bg-pink-500/20 rounded-full blur-[80px] opacity-50 top-1/3 left-1/4 animate-blob"
				style={{ animationDelay: "-10s" }}
			/>

			<div className="bg-white/[0.02] backdrop-blur-[40px] border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-3xl p-10 w-full max-w-md relative overflow-hidden">
				{/* Decorative gradient orbs */}
				<div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
				<div className="absolute -bottom-20 -right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl" />

				<div className="relative z-10">
					<div className="text-center mb-8">
						<Link href="/" className="inline-block">
							<div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-400 to-cyan-500 flex items-center justify-center mb-6 animate-pulse-glow">
								<svg
									className="w-8 h-8 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
									/>
								</svg>
							</div>
						</Link>
						<h1 className="text-3xl font-bold text-gradient mb-2">
							Create Account
						</h1>
						<p className="text-white/50">Join HealthCare+ today</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-5">
						{error && (
							<div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
								{error}
							</div>
						)}

						{/* Role Selection */}
						<div className="space-y-2">
							<label className="block text-sm font-medium text-white/70">
								I am a
							</label>
							<div className="grid grid-cols-2 gap-3">
								<button
									type="button"
									onClick={() =>
										setFormData({ ...formData, role: UserRole.PATIENT })
									}
									className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
										formData.role === UserRole.PATIENT
											? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-[0_4px_15px_rgba(6,182,212,0.3)]"
											: "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
									}`}>
									🏥 Patient
								</button>
								<button
									type="button"
									onClick={() =>
										setFormData({ ...formData, role: UserRole.DOCTOR })
									}
									className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
										formData.role === UserRole.DOCTOR
											? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-[0_4px_15px_rgba(6,182,212,0.3)]"
											: "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
									}`}>
									👨‍⚕️ Doctor
								</button>
							</div>
						</div>

						{/* Google Sign Up for Patients */}
						{formData.role === UserRole.PATIENT && (
							<>
								<button
									type="button"
									onClick={handleGoogleSignUp}
									className="w-full py-3.5 rounded-xl flex items-center justify-center gap-3 text-white/80 font-medium bg-transparent border border-white/20 hover:bg-white/5 hover:border-cyan-500/50 hover:text-white transition-all duration-300">
									<svg className="w-5 h-5" viewBox="0 0 24 24">
										<path
											fill="#4285F4"
											d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
										/>
										<path
											fill="#34A853"
											d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
										/>
										<path
											fill="#FBBC05"
											d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
										/>
										<path
											fill="#EA4335"
											d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
										/>
									</svg>
									Quick sign up with Google
								</button>

								<div className="flex items-center gap-4">
									<div className="flex-1 h-px bg-white/10" />
									<span className="text-white/30 text-sm">
										or fill in details
									</span>
									<div className="flex-1 h-px bg-white/10" />
								</div>
							</>
						)}

						{/* Name Fields */}
						<div className="grid grid-cols-2 gap-3">
							<div className="relative mt-4">
								<input
									type="text"
									required
									value={formData.firstName}
									onChange={(e) =>
										setFormData({ ...formData, firstName: e.target.value })
									}
									onFocus={() => setFocusedField("firstName")}
									onBlur={() => setFocusedField(null)}
									className={getInputClasses("firstName", formData.firstName)}
									placeholder=" "
								/>
								<label
									className={getLabelClasses("firstName", formData.firstName)}>
									First Name
								</label>
							</div>
							<div className="relative mt-4">
								<input
									type="text"
									required
									value={formData.lastName}
									onChange={(e) =>
										setFormData({ ...formData, lastName: e.target.value })
									}
									onFocus={() => setFocusedField("lastName")}
									onBlur={() => setFocusedField(null)}
									className={getInputClasses("lastName", formData.lastName)}
									placeholder=" "
								/>
								<label
									className={getLabelClasses("lastName", formData.lastName)}>
									Last Name
								</label>
							</div>
						</div>

						<div className="relative mt-4">
							<input
								type="email"
								required
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								onFocus={() => setFocusedField("email")}
								onBlur={() => setFocusedField(null)}
								className={getInputClasses("email", formData.email)}
								placeholder=" "
							/>
							<label className={getLabelClasses("email", formData.email)}>
								Email
							</label>
						</div>

						<div className="relative mt-4">
							<input
								type="tel"
								required
								value={formData.phone}
								onChange={(e) =>
									setFormData({ ...formData, phone: e.target.value })
								}
								onFocus={() => setFocusedField("phone")}
								onBlur={() => setFocusedField(null)}
								className={getInputClasses("phone", formData.phone)}
								placeholder=" "
							/>
							<label className={getLabelClasses("phone", formData.phone)}>
								Phone
							</label>
						</div>

						{formData.role === UserRole.DOCTOR && (
							<div className="relative mt-4">
								<input
									type="text"
									required
									value={formData.specialization}
									onChange={(e) =>
										setFormData({ ...formData, specialization: e.target.value })
									}
									onFocus={() => setFocusedField("specialization")}
									onBlur={() => setFocusedField(null)}
									className={getInputClasses(
										"specialization",
										formData.specialization
									)}
									placeholder=" "
								/>
								<label
									className={getLabelClasses(
										"specialization",
										formData.specialization
									)}>
									Specialization
								</label>
							</div>
						)}

						<div className="relative mt-4">
							<input
								type="password"
								required
								value={formData.password}
								onChange={(e) =>
									setFormData({ ...formData, password: e.target.value })
								}
								onFocus={() => setFocusedField("password")}
								onBlur={() => setFocusedField(null)}
								className={getInputClasses("password", formData.password)}
								placeholder=" "
							/>
							<label className={getLabelClasses("password", formData.password)}>
								Password
							</label>
						</div>

						<div className="relative mt-4">
							<input
								type="password"
								required
								value={formData.confirmPassword}
								onChange={(e) =>
									setFormData({ ...formData, confirmPassword: e.target.value })
								}
								onFocus={() => setFocusedField("confirmPassword")}
								onBlur={() => setFocusedField(null)}
								className={getInputClasses(
									"confirmPassword",
									formData.confirmPassword
								)}
								placeholder=" "
							/>
							<label
								className={getLabelClasses(
									"confirmPassword",
									formData.confirmPassword
								)}>
								Confirm Password
							</label>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full py-4 text-white font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 shadow-[0_4px_15px_rgba(6,182,212,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
							{loading ? (
								<span className="flex items-center justify-center gap-2">
									<svg
										className="animate-spin w-5 h-5"
										fill="none"
										viewBox="0 0 24 24">
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
										/>
									</svg>
									Creating account...
								</span>
							) : (
								"Create Account"
							)}
						</button>
					</form>

					<p className="mt-8 text-center text-white/50">
						Already have an account?{" "}
						<Link
							href="/login"
							className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
