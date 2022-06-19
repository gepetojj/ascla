import { Main } from "components/layout/Main";
import type { NextPage } from "next";
import React from "react";
import { GoQuote } from "react-icons/go";

const Home: NextPage = () => {
	return (
		<>
			<Main title="Academia Santanense de Ciências, Letras e Artes">
				<div className="w-full h-60 px-4">
					<div className="w-full h-full bg-primary-main"></div>
				</div>
				<div className="flex flex-col justify-center items-center px-6 py-20">
					<blockquote className="px-8 pt-6">
						<div className="flex">
							<div className="w-fit pr-3">
								<GoQuote className="text-2xl" />
							</div>
							<p className="max-w-md">
								Um povo sem memória é um povo sem história. Um povo sem história
								está fadado a cometer, no presente e no futuro, os mesmos erros do
								passado.
							</p>
						</div>
						<p className="text-right font-bold pt-2">
							Emilia Viotti da Costa, historiadora.
						</p>
					</blockquote>
				</div>
			</Main>
		</>
	);
};

export default Home;
