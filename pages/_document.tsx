import { Html, Head, Main, NextScript } from "next/document";
import React from "react";

export default function Document() {
	return (
		<Html lang="pt-br" dir="ltr">
			<Head>
				<link
					href="https://fonts.googleapis.com/css2?family=Roboto&display=optional"
					rel="stylesheet"
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
