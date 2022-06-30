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
					<div>
						<Image
							src={
								process.env.NODE_ENV === "development"
									? `http://localhost:9199/download/storage/v1/b/asclasi.appspot.com/o/uploads%2Fhighlight.webp?alt=media&reset=${hlCache}`
									: `https://firebasestorage.googleapis.com/v0/b/asclasi.appspot.com/o/uploads%2Fhighlight.webp?alt=media&reset=${hlCache}`
							}
							alt="Coletânea de imagens da história de Santana do Ipanema"
							layout="fixed"
							width={1050}
							height={240}
							priority
							unoptimized
						/>
					</div>
				</div>
				{/* -- Desktop -- */}
				<div className="w-full h-60 bg-primary-main relative overflow-x-auto overflow-y-hidden hidden lg:flex">
					<div>
						<Image
							src={
								process.env.NODE_ENV === "development"
									? `http://localhost:9199/download/storage/v1/b/asclasi.appspot.com/o/uploads%2Fhighlight.webp?alt=media&reset=${hlCache}`
									: `https://firebasestorage.googleapis.com/v0/b/asclasi.appspot.com/o/uploads%2Fhighlight.webp?alt=media&reset=${hlCache}`
							}
							alt="Coletânea de imagens da história de Santana do Ipanema"
							layout="fill"
							objectFit="cover"
							objectPosition="center"
							priority
							unoptimized
						/>
					</div>
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
