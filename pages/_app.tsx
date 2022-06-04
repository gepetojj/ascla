import { ThemeProvider } from "@material-tailwind/react";

import { Footer } from "components/layout/Footer";
import { Header } from "components/layout/Header";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import "styles/globals.css";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	const { pathname } = useRouter();
	
	const Layout = useMemo(() => {
		if (pathname === "/conta") return <Component {...pageProps} />;

		return (
			<>
				<div className="min-h-screen">
					<Header />
					<Component {...pageProps} />
				</div>
				<Footer />
			</>
		);
	}, [pathname, Component, pageProps]);

	return (
		<>
			<SessionProvider session={session}>
				<ThemeProvider>{Layout}</ThemeProvider>
			</SessionProvider>
		</>
	);
}
