/** @format */

"use client";

import { ReactNode, useEffect } from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
}

export default function Modal({
	isOpen,
	onClose,
	title,
	children,
}: ModalProps) {
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 overflow-y-auto">
			<div className="flex min-h-screen items-center justify-center p-4">
				{/* Backdrop */}
				<div
					className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
					onClick={onClose}
				/>

				{/* Modal */}
				<div className="relative w-full max-w-md transform rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 shadow-2xl transition-all border border-white/10">
					{/* Header */}
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-white">{title}</h3>
						<button
							onClick={onClose}
							className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					{/* Content */}
					{children}
				</div>
			</div>
		</div>
	);
}

// Confirm Modal Component
interface ConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	variant?: "danger" | "warning" | "info";
}

export function ConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = "Confirm",
	cancelText = "Cancel",
	variant = "danger",
}: ConfirmModalProps) {
	const variantStyles = {
		danger:
			"bg-red-600 hover:bg-red-500 focus:ring-red-500 shadow-lg shadow-red-500/25",
		warning:
			"bg-yellow-600 hover:bg-yellow-500 focus:ring-yellow-500 shadow-lg shadow-yellow-500/25",
		info: "bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 focus:ring-cyan-500 shadow-lg shadow-cyan-500/25",
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title={title}>
			<p className="text-white/70 mb-6">{message}</p>
			<div className="flex justify-end space-x-3">
				<button
					onClick={onClose}
					className="px-4 py-2 text-sm font-medium text-white/70 bg-white/10 rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all">
					{cancelText}
				</button>
				<button
					onClick={() => {
						onConfirm();
						onClose();
					}}
					className={`px-4 py-2 text-sm font-medium text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] transition-all ${variantStyles[variant]}`}>
					{confirmText}
				</button>
			</div>
		</Modal>
	);
}

// Input Modal Component
interface InputModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (value: string) => void;
	title: string;
	message: string;
	placeholder?: string;
	submitText?: string;
	cancelText?: string;
	required?: boolean;
}

export function InputModal({
	isOpen,
	onClose,
	onSubmit,
	title,
	message,
	placeholder = "Enter text...",
	submitText = "Submit",
	cancelText = "Cancel",
	required = false,
}: InputModalProps) {
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const value = formData.get("input") as string;
		if (required && !value.trim()) return;
		onSubmit(value);
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title={title}>
			<form onSubmit={handleSubmit}>
				<p className="text-white/70 mb-4">{message}</p>
				<textarea
					name="input"
					placeholder={placeholder}
					rows={3}
					className="w-full px-4 py-3 text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 resize-none placeholder-white/40 transition-all"
					required={required}
				/>
				<div className="flex justify-end space-x-3 mt-4">
					<button
						type="button"
						onClick={onClose}
						className="px-4 py-2 text-sm font-medium text-white/70 bg-white/10 rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all">
						{cancelText}
					</button>
					<button
						type="submit"
						className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl hover:from-cyan-400 hover:to-purple-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] focus:ring-cyan-500 transition-all shadow-lg shadow-cyan-500/25">
						{submitText}
					</button>
				</div>
			</form>
		</Modal>
	);
}
