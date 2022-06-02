import { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";

interface Props {
	statusCode?: number;
}

const Error: NextPage<Props> = ({ statusCode }) => {
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		switch (statusCode) {
			default:
				setErrorMessage("Não foi possível completar seu pedido, tente novamente.");
				break;

			case 404:
				setErrorMessage("Esta página não foi encontrada, verifique se ela existe.");
				break;

			case 500:
				setErrorMessage("O servidor encontrou um erro, tente novamente mais tarde.");
				break;
		}
	}, [statusCode]);

	return (
		<>
			<Head>
				<title>ASCLA - Houve um erro ({statusCode})</title>
			</Head>
			<main className="flex flex-col h-screen justify-center items-center">
				<h2 className="text-3xl font-bold">Houve um erro - {statusCode}</h2>
				<p className="text-lg font-medium">{errorMessage}</p>
			</main>
		</>
	);
};

Error.getInitialProps = ({ res, err }) => {
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

	return { statusCode };
};

export default Error;
