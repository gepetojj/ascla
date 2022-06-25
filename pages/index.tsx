import { Main } from "components/layout/Main";
import { Image } from "components/view/Image";
import { useScreenSize } from "hooks/useScreenSize";
import type { NextPage } from "next";
import React from "react";
import { GoQuote } from "react-icons/go";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";

const Home: NextPage = () => {
	const { width } = useScreenSize();

	return (
		<Main title="Academia Santanense de Ciências, Letras e Artes">
			<div className="w-full h-60 px-4">
				<div className="w-full h-60 bg-primary-main relative overflow-x-auto overflow-y-hidden">
					<Image
						src="banner-ascla.webp"
						alt="Coletânea de imagens da história de Santana do Ipanema"
						layout={width >= 1130 ? "fill" : "fixed"}
						width={width >= 1130 ? undefined : 1050}
						height={width >= 1130 ? undefined : 240}
						objectFit={width >= 1130 ? "cover" : undefined}
						objectPosition={width >= 1130 ? "center" : undefined}
						priority
					/>
				</div>
			</div>
			{width <= 1130 && (
				<div className="flex justify-center items-center w-full mt-2 gap-1">
					<MdArrowLeft className="text-xl" />
					<span className="text-sm font-light italic">Arraste para ver mais</span>
					<MdArrowRight className="text-xl" />
				</div>
			)}
			<div className="flex flex-col justify-center items-center px-6 py-20">
				<blockquote className="px-8 pt-6">
					<div className="flex">
						<div className="w-fit pr-3">
							<GoQuote className="text-2xl" />
						</div>
						<p className="max-w-md">
							Um povo sem memória é um povo sem história. Um povo sem história está
							fadado a cometer, no presente e no futuro, os mesmos erros do passado.
						</p>
					</div>
					<p className="text-right font-bold pt-2">
						Emilia Viotti da Costa, historiadora.
					</p>
				</blockquote>
			</div>
		</Main>
	);
};

export default Home;
