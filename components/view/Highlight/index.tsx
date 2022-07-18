import { useLocalStorage } from "hooks/useLocalStorage";
import React, { FC, memo, useEffect } from "react";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";

import { Image } from "../Image";

const HighlightViewComponent: FC = () => {
	const [hlCache, setHlCache] = useLocalStorage("hlCache");

	useEffect(() => {
		if (!hlCache) setHlCache(String(performance.now()));
		const interval = setInterval(() => {
			setHlCache(String(performance.now()));
		}, 2 * 60 * 1000);

		return () => clearInterval(interval);
	}, [hlCache, setHlCache]);

	return (
		<>
			<div className="w-full h-60 px-4">
				{/* -- Mobile -- */}
				<div className="w-full h-60 bg-primary-main relative overflow-x-auto overflow-y-hidden lg:hidden">
					<Image
						src={`https://ik.imagekit.io/gepetojj/ascla/tr:w-1050,h-240/highlight?renew=${hlCache}`}
						alt="Coletânea de imagens da história de Santana do Ipanema"
						layout="fixed"
						width={1050}
						height={240}
						priority
					/>
				</div>
				{/* -- Desktop -- */}
				<div className="w-full h-60 bg-primary-main relative overflow-x-auto overflow-y-hidden hidden lg:flex">
					<Image
						src={`https://ik.imagekit.io/gepetojj/ascla/tr:w-1050,h-240/highlight?renew=${hlCache}`}
						alt="Coletânea de imagens da história de Santana do Ipanema"
						layout="fill"
						objectFit="cover"
						objectPosition="center"
						priority
					/>
				</div>
			</div>
			<div className="flex justify-center items-center w-full mt-2 gap-1 lg:hidden">
				<MdArrowLeft className="text-xl" />
				<span className="text-sm font-light italic">Arraste para ver mais</span>
				<MdArrowRight className="text-xl" />
			</div>
		</>
	);
};

export const HighlightView = memo(HighlightViewComponent);
