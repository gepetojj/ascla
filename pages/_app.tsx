import { ThemeProvider } from "@material-tailwind/react";

import { Footer } from "components/layout/Footer";
import { Header } from "components/layout/Header";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import React from "react";
import "styles/globals.css";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	return (
		<>
			<SessionProvider session={session}>
				<ThemeProvider>
					<div className="min-h-screen">
						<Header />
						<Component {...pageProps} />
					</div>
					<Footer />
				</ThemeProvider>
			</SessionProvider>
		</>
	);
}
