import { Footer } from "components/layout/Footer";
import { Header } from "components/layout/Header";
import { SessionProvider } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Script from "next/script";
import React, { useMemo } from "react";
import { ReactNotifications } from "react-notifications-component";
import "styles/fonts.css";
import "styles/globals.css";

import SEO from "../next-seo.config";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	const { pathname } = useRouter();

	const Layout = useMemo(() => {
		if (pathname === "/conta") return <Component {...pageProps} />;

		return (
			<>
				<div className="min-h-screen bg-cream-main">
					<Header />
					<Component {...pageProps} />
				</div>
				<Footer />
			</>
		);
	}, [pathname, Component, pageProps]);

	return (
		<>
			<DefaultSeo {...SEO} />
			<SessionProvider session={session}>
				<ReactNotifications />
				{Layout}
			</SessionProvider>

			<Script
				strategy="afterInteractive"
				src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
			/>
			<Script
				id="gtag-init"
				strategy="afterInteractive"
				/* # skipcq: JS-0440 */
				dangerouslySetInnerHTML={{
					__html: `
            			window.dataLayer = window.dataLayer || [];
           				function gtag(){dataLayer.push(arguments);}
            			gtag('js', new Date());
            			gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              				page_path: '${pathname}',
           				});
          			`,
				}}
			/>
		</>
	);
}
