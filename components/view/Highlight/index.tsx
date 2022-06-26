import { useLocalStorage } from "hooks/useLocalStorage";
import { useScreenSize } from "hooks/useScreenSize";
import React, { FC, memo, useEffect } from "react";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";

import { Image } from "../Image";

const HighlightViewComponent: FC = () => {
	const [hlCache, setHlCache] = useLocalStorage("hlCache");
	const { width } = useScreenSize();

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
				<div className="w-full h-60 bg-primary-main relative overflow-x-auto overflow-y-hidden">
					<Image
						src={
							process.env.NODE_ENV === "development"
								? `http://localhost:9199/download/storage/v1/b/asclasi.appspot.com/o/uploads%2Fhighlight.webp?alt=media&reset=${hlCache}`
								: `https://firebasestorage.googleapis.com/v0/b/asclasi.appspot.com/o/uploads%2Fhighlight.webp?alt=media&reset=${hlCache}`
						}
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
		</>
	);
};

export const HighlightView = memo(HighlightViewComponent);
