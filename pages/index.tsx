import { Main } from "components/layout/Main";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { GoQuote } from "react-icons/go";

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>ASCLA - Academia Santanense de Letras, Ciências e Artes</title>
			</Head>

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
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque
								magnam sit porro illo quasi soluta libero velit, sequi modi
								doloremque quia voluptatibus cum eos totam iste esse! Sint, pariatur
								neque!
							</p>
						</div>
						<p className="text-right font-bold pt-2">Autor/a</p>
					</blockquote>
				</div>
			</Main>
		</>
	);
};

export default Home;
