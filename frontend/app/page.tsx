/** @format */

import Link from "next/link";

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0f1729] bg-[length:400%_400%] animate-gradient-shift relative overflow-hidden">
			{/* Animated background blobs */}
			<div className="absolute w-96 h-96 bg-cyan-500/30 rounded-full blur-[80px] opacity-50 top-0 left-0 animate-blob" />
			<div
				className="absolute w-80 h-80 bg-purple-500/30 rounded-full blur-[80px] opacity-50 top-1/4 right-0 animate-blob"
				style={{ animationDelay: "-5s" }}
			/>
			<div
				className="absolute w-72 h-72 bg-pink-500/30 rounded-full blur-[80px] opacity-50 bottom-0 left-1/3 animate-blob"
				style={{ animationDelay: "-10s" }}
			/>

			{/* Header */}
			<header className="relative z-10 bg-white/[0.02] backdrop-blur-xl border-b border-white/5">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
					<div className="flex items-center space-x-3">
						<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center animate-pulse-glow">
							<svg
								className="w-6 h-6 text-white"
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
						<span className="text-2xl font-bold text-gradient">
							HealthCare+
						</span>
					</div>
					<div className="flex items-center space-x-4">
						<Link
							href="/login"
							className="px-5 py-2.5 text-sm font-medium text-white/80 hover:text-white transition-colors">
							Login
						</Link>
						<Link
							href="/register"
							className="px-6 py-2.5 text-sm font-medium text-white rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 shadow-[0_4px_15px_rgba(6,182,212,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(6,182,212,0.4)] transition-all duration-300">
							Get Started
						</Link>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
				<div className="text-center mb-20">
					<div className="inline-flex items-center px-4 py-2 rounded-full bg-white/[0.02] backdrop-blur-xl border border-white/5 mb-8 animate-float">
						<span className="w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse" />
						<span className="text-sm text-white/70">
							Next-Gen Healthcare Platform
						</span>
					</div>

					<h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
						<span className="text-white">Smart</span>
						<br />
						<span className="text-gradient">Healthcare</span>
						<br />
						<span className="text-white">Management</span>
					</h1>

					<p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
						Experience the future of healthcare with AI-powered appointment
						scheduling, real-time notifications, and seamless doctor-patient
						connections.
					</p>

					<div className="flex flex-col sm:flex-row justify-center gap-4">
						<Link
							href="/register"
							className="px-10 py-4 text-lg font-semibold text-white rounded-2xl inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 shadow-[0_4px_15px_rgba(6,182,212,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(6,182,212,0.4)] transition-all duration-300">
							Start Free Trial
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 7l5 5m0 0l-5 5m5-5H6"
								/>
							</svg>
						</Link>
						<Link
							href="/login"
							className="px-10 py-4 text-lg font-semibold text-white/80 rounded-2xl inline-flex items-center justify-center gap-2 bg-transparent border border-white/20 hover:bg-white/5 hover:border-cyan-500/50 hover:text-white transition-all duration-300">
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							Watch Demo
						</Link>
					</div>
				</div>

				{/* Feature Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
					<div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-2xl p-8 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(6,182,212,0.15)] transition-all duration-300 group">
						<div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400/20 to-cyan-400/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
							<svg
								className="w-7 h-7 text-cyan-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<h3 className="text-xl font-semibold text-white mb-3">
							Smart Scheduling
						</h3>
						<p className="text-white/50 leading-relaxed">
							AI-powered appointment booking that finds the perfect time slot
							for both patients and doctors.
						</p>
					</div>

					<div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-2xl p-8 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(6,182,212,0.15)] transition-all duration-300 group">
						<div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400/20 to-purple-400/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
							<svg
								className="w-7 h-7 text-purple-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
								/>
							</svg>
						</div>
						<h3 className="text-xl font-semibold text-white mb-3">
							Real-time Alerts
						</h3>
						<p className="text-white/50 leading-relaxed">
							Instant notifications for appointments, reminders, and important
							updates via WebSocket.
						</p>
					</div>

					<div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-2xl p-8 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(6,182,212,0.15)] transition-all duration-300 group">
						<div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-400/20 to-pink-400/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
							<svg
								className="w-7 h-7 text-pink-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
								/>
							</svg>
						</div>
						<h3 className="text-xl font-semibold text-white mb-3">
							Secure Access
						</h3>
						<p className="text-white/50 leading-relaxed">
							Role-based authentication with OAuth 2.0 and JWT for maximum
							security and privacy.
						</p>
					</div>
				</div>

				{/* Tech Stack */}
				<div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-3xl p-10 mb-20">
					<h2 className="text-2xl font-bold text-white mb-2 text-center">
						Powered by Modern Tech
					</h2>
					<p className="text-white/50 text-center mb-10">
						Built with cutting-edge technologies for optimal performance
					</p>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						<div className="text-center group">
							<div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
								<span className="text-3xl">⚛️</span>
							</div>
							<p className="text-sm text-white/40">Frontend</p>
							<p className="text-lg font-semibold text-cyan-400">Next.js 14</p>
						</div>
						<div className="text-center group">
							<div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
								<span className="text-3xl">🚀</span>
							</div>
							<p className="text-sm text-white/40">Backend</p>
							<p className="text-lg font-semibold text-purple-400">Node.js</p>
						</div>
						<div className="text-center group">
							<div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
								<span className="text-3xl">🐘</span>
							</div>
							<p className="text-sm text-white/40">Database</p>
							<p className="text-lg font-semibold text-pink-400">PostgreSQL</p>
						</div>
						<div className="text-center group">
							<div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
								<span className="text-3xl">⚡</span>
							</div>
							<p className="text-sm text-white/40">Real-time</p>
							<p className="text-lg font-semibold text-cyan-400">Socket.IO</p>
						</div>
					</div>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
					<div className="text-center">
						<p className="text-4xl font-bold text-gradient mb-2">10K+</p>
						<p className="text-white/50">Active Users</p>
					</div>
					<div className="text-center">
						<p className="text-4xl font-bold text-gradient mb-2">500+</p>
						<p className="text-white/50">Doctors</p>
					</div>
					<div className="text-center">
						<p className="text-4xl font-bold text-gradient mb-2">50K+</p>
						<p className="text-white/50">Appointments</p>
					</div>
					<div className="text-center">
						<p className="text-4xl font-bold text-gradient mb-2">99.9%</p>
						<p className="text-white/50">Uptime</p>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="relative z-10 bg-white/[0.02] backdrop-blur-xl border-t border-white/5">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4">
						<div className="flex items-center space-x-3">
							<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
								<svg
									className="w-4 h-4 text-white"
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
							<span className="font-semibold text-white/80">HealthCare+</span>
						</div>
						<p className="text-white/40 text-sm">
							© 2025 HealthCare+. Built with microservices architecture.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
