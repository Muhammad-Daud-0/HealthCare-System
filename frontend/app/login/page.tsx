/** @format */

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authAPI } from "@/lib/api";

const AUTH_SERVICE_URL =
	process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:3001";

function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [focusedField, setFocusedField] = useState<string | null>(null);

	useEffect(() => {
		const errorParam = searchParams.get("error");
		if (errorParam) {
			if (errorParam === "google_auth_failed") {
				setError(
					"Google authentication failed. Please try again or use email/password."
				);
			} else if (errorParam === "callback_failed") {
				setError("Authentication callback failed. Please try again.");
			} else {
				setError("An error occurred during authentication.");
			}
		}
	}, [searchParams]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const response = await authAPI.login(formData.email, formData.password);

			if (response.success) {
				const userRole = response.data?.user?.role;
				if (userRole === "ADMIN") {
					router.push("/admin/dashboard");
				} else if (userRole === "DOCTOR") {
					router.push("/doctor/dashboard");
				} else {
					router.push("/patient/dashboard");
				}
			} else {
				setError(response.message || "Login failed");
			}
		} catch (err) {
			setError("An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleSignIn = () => {
		window.location.href = `${AUTH_SERVICE_URL}/api/auth/google`;
	};

	const getInputClasses = (fieldName: string, value: string) => {
		const isFocused = focusedField === fieldName;
		const hasValue = value.length > 0;

		return `w-full text-white text-base outline-none transition-colors duration-300 ease-out bg-transparent py-3.5 px-3 ${
			isFocused ? "input-focus-gradient " : "border-b border-white/20"
		}`;
	};

	const getLabelClasses = (fieldName: string, value: string) => {
		const isFocused = focusedField === fieldName;
		const hasValue = value.length > 0;
		const isFloating = isFocused || hasValue;

		return `absolute left-3 transition-all duration-300 ease-out pointer-events-none ${
			isFloating
				? `top-0 -translate-y-1/2 text-xs px-2 py-0.5 rounded-full z-10  border ${
						isFocused
							? "text-purple-500 border-purple-500/50 left-4"
							: "text-purple-500 border-purple-500/50 left-2"
						// : "text-white/60 border-white/20 left-2"
				  }`
				: "top-1/2 -translate-y-1/2 text-base text-white/50"
		}`;
	};

	return (
		<div className="bg-white/[0.02] backdrop-blur-[40px] border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-3xl p-10 w-full max-w-md relative overflow-hidden">
			{/* Decorative gradient orbs */}
			<div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl" />
			<div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />

			<div className="relative z-10">
				<div className="text-center mb-10">
					<Link href="/" className="inline-block">
						<div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center mb-6 animate-pulse-glow">
							<svg
								className="w-8 h-8 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 6v6m0 0v6m0-6h6m-6 0H6"
								/>
							</svg>
						</div>
					</Link>
					<h1 className="text-3xl font-bold text-gradient mb-2">
						Welcome Back
					</h1>
					<p className="text-white/50">Sign in to continue to HealthCare+</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-8">
					{error && (
						<div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
							{error}
						</div>
					)}

					<div className="relative mt-5">
						<input
							id="email"
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
						<label
							htmlFor="email"
							className={getLabelClasses("email", formData.email)}>
							Email Address
						</label>
					</div>

					<div className="relative mt-5">
						<input
							id="password"
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
						<label
							htmlFor="password"
							className={getLabelClasses("password", formData.password)}>
							Password
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
								Signing in...
							</span>
						) : (
							"Sign In"
						)}
					</button>
				</form>

				<div className="my-8 flex items-center gap-4">
					<div className="flex-1 h-px bg-white/10" />
					<span className="text-white/30 text-sm">or continue with</span>
					<div className="flex-1 h-px bg-white/10" />
				</div>

				<button
					type="button"
					onClick={handleGoogleSignIn}
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
					Sign in with Google
				</button>
				<p className="mt-3 text-xs text-center text-white/30">
					Google sign-in is available for patients only
				</p>

				<p className="mt-8 text-center text-white/50">
					Don&apos;t have an account?{" "}
					<Link
						href="/register"
						className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
						Create account
					</Link>
				</p>
			</div>
		</div>
	);
}

export default function LoginPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0f1729] bg-[length:400%_400%] animate-gradient-shift relative overflow-hidden flex items-center justify-center p-4">
			{/* Animated background blobs */}
			<div className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-[80px] opacity-50 top-0 left-0 animate-blob" />
			<div
				className="absolute w-80 h-80 bg-purple-500/20 rounded-full blur-[80px] opacity-50 bottom-0 right-0 animate-blob"
				style={{ animationDelay: "-5s" }}
			/>
			<div
				className="absolute w-64 h-64 bg-pink-500/20 rounded-full blur-[80px] opacity-50 top-1/2 left-1/2 animate-blob"
				style={{ animationDelay: "-10s" }}
			/>

			<Suspense
				fallback={
					<div className="bg-white/[0.02] backdrop-blur-[40px] border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-3xl p-10 w-full max-w-md">
						<div className="animate-pulse space-y-6">
							<div className="w-16 h-16 mx-auto rounded-2xl bg-white/10" />
							<div className="h-8 bg-white/10 rounded-xl w-3/4 mx-auto" />
							<div className="space-y-4">
								<div className="h-14 bg-white/5 rounded-xl" />
								<div className="h-14 bg-white/5 rounded-xl" />
								<div className="h-14 bg-white/10 rounded-xl" />
							</div>
						</div>
					</div>
				}>
				<LoginForm />
			</Suspense>
		</div>
	);
}
