import { NextStrictCSP } from "next-strict-csp";
import { Html, Head, Main, NextScript } from "next/document";
import React from "react";

const HeadCSP = process.env.NODE_ENV === "production" ? NextStrictCSP : Head;

export default function Document() {
	return (
		<Html lang="pt-br" dir="ltr">
			<HeadCSP>
				{process.env.NODE_ENV === "production" && (
					<meta httpEquiv="Content-Security-Policy" />
				)}
			</HeadCSP>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
