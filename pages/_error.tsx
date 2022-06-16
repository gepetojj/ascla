import { Main } from "components/layout/Main";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
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
			<NextSeo title={`Houve um erro (${statusCode})`} />

			<Main title={`Houve um erro - ${statusCode}`}>
				<div className="flex flex-col text-center">
					<h3 className="text-xl font-semibold">Aconteceu um problema:</h3>
					<p className="text-lg font-medium">{errorMessage}</p>
				</div>
			</Main>
		</>
	);
};

Error.getInitialProps = ({ res, err }) => {
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

	return { statusCode };
};

export default Error;
