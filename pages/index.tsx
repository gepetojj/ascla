import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { GoQuote } from "react-icons/go";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.css";

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>ASCLA - Academia Santanense de Letras, Ciências e Artes</title>
			</Head>

			<main className="w-screen px-2 py-6 bg-white">
				<Carousel
					autoPlay
					infiniteLoop
					showArrows
					swipeable
					stopOnHover
					dynamicHeight
					showThumbs={false}
					interval={4000}
					statusFormatter={(current, total) => `${current} de ${total}`}
					className="px-4"
				>
					<div>
						<div className="w-full h-52 bg-orange-500"></div>
						<p>Legenda 1</p>
					</div>
					<div>
						<div className="w-full h-52 bg-orange-400"></div>
						<p>Legenda 2</p>
					</div>
					<div>
						<div className="w-full h-52 bg-orange-300"></div>
						<p>Legenda 3</p>
					</div>
				</Carousel>
				<div className="flex flex-col justify-center items-center pt-20">
					<h2 className="text-2xl font-bold text-center break-words">
						Academia Santanense de Letras, Ciências e Artes
					</h2>
					<blockquote className="px-8 pt-6">
						<div className="flex">
							<div className="w-fit pr-3">
								<GoQuote className="text-2xl" />
							</div>
							<p>
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque
								magnam sit porro illo quasi soluta libero velit, sequi modi
								doloremque quia voluptatibus cum eos totam iste esse! Sint, pariatur
								neque!
							</p>
						</div>
						<p className="text-right font-bold pt-2">Autor/a</p>
					</blockquote>
				</div>
			</main>
		</>
	);
};

export default Home;