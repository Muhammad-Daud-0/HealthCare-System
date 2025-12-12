/** @format */

"use client";

import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import NotificationBell from "./NotificationBell";

interface NavbarProps {
	userEmail: string;
	userRole: string;
}

export default function Navbar({ userEmail, userRole }: NavbarProps) {
	const router = useRouter();

	const handleLogout = async () => {
		await authAPI.logout();
		router.push("/login");
	};

	const getDashboardLinks = () => {
		switch (userRole) {
			case "ADMIN":
				return [
					{ name: "Dashboard", href: "/admin/dashboard", icon: "📊" },
					{ name: "Users", href: "/admin/users", icon: "👥" },
					{ name: "Appointments", href: "/admin/appointments", icon: "📅" },
				];
			case "DOCTOR":
				return [
					{ name: "Dashboard", href: "/doctor/dashboard", icon: "📊" },
					{ name: "Appointments", href: "/doctor/appointments", icon: "📅" },
				];
			case "PATIENT":
				return [
					{ name: "Dashboard", href: "/patient/dashboard", icon: "📊" },
					{
						name: "Book Appointment",
						href: "/patient/book-appointment",
						icon: "➕",
					},
					{
						name: "My Appointments",
						href: "/patient/appointments",
						icon: "📅",
					},
				];
			default:
				return [];
		}
	};

	const getRoleBadgeColor = () => {
		switch (userRole) {
			case "ADMIN":
				return "from-red-500 to-orange-500";
			case "DOCTOR":
				return "from-purple-500 to-pink-500";
			case "PATIENT":
				return "from-cyan-500 to-blue-500";
			default:
				return "from-gray-500 to-gray-600";
		}
	};

	return (
		<nav className="bg-white/[0.02] backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex items-center gap-8">
						{/* Logo */}
						<a href="/" className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
								<svg
									className="w-5 h-5 text-white"
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
							<span className="text-xl font-bold text-gradient hidden sm:block">
								HealthCare+
							</span>
						</a>

						{/* Navigation Links */}
						<div className="hidden md:flex items-center gap-1">
							{getDashboardLinks().map((link) => (
								<a
									key={link.href}
									href={link.href}
									className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all">
									<span>{link.icon}</span>
									{link.name}
								</a>
							))}
						</div>
					</div>

					<div className="flex items-center gap-4">
						{/* Notification Bell */}
						<NotificationBell />

						{/* User Info */}
						<div className="hidden sm:flex items-center gap-3 pl-4 border-l border-white/10">
							<div className="text-right">
								<p className="text-sm font-medium text-white/90">{userEmail}</p>
								<span
									className={`inline-block text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${getRoleBadgeColor()} text-white`}>
									{userRole}
								</span>
							</div>
							<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-white/60">
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
							</div>
						</div>

						{/* Logout Button */}
						<button
							onClick={handleLogout}
							className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/70 hover:text-white bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all">
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
								/>
							</svg>
							<span className="hidden sm:inline">Logout</span>
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
}
