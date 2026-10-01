import React from "react";
import { Metadata } from "next";
import { Space_Grotesk, Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	variable: "--font-sans",
	display: "swap",
});

const outfit = Outfit({
	subsets: ["latin"],
	variable: "--font-mono",
	display: "swap",
});

export const metadata: Metadata = {
	title: "EarlyStage Digital Analytics - Local Business Insights",
	description: "Simple analytics for local businesses",
};

export const viewport = {
	width: "device-width",
	initialScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`dark ${spaceGrotesk.variable} ${outfit.variable}`}
		>
			<body>
				<Suspense fallback={null}>
					{children}
					<Analytics />
				</Suspense>
			</body>
		</html>
	);
}
