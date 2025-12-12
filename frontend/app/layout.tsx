/** @format */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "HealthCare+ | Smart Healthcare Management Platform",
	description:
		"HealthCare+ - Next-generation healthcare management platform with AI-powered scheduling, real-time notifications, and seamless doctor-patient connections.",
	icons: {
		icon: "/favicon.svg",
	},
	keywords: [
		"healthcare",
		"appointments",
		"doctors",
		"medical",
		"health management",
	],
	authors: [{ name: "HealthCare+" }],
	openGraph: {
		title: "HealthCare+ | Smart Healthcare Management",
		description:
			"Experience the future of healthcare with AI-powered appointment scheduling and real-time notifications.",
		type: "website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="dark">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0f] text-white`}>
				{children}
			</body>
		</html>
	);
}
