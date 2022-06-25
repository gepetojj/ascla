import { useScreenSize } from "hooks/useScreenSize";
import React, { FC, memo } from "react";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";

import { Image } from "../Image";

export interface HighlightViewProps {
	src: string;
}

const HighlightViewComponent: FC<HighlightViewProps> = ({ src }) => {
	const { width } = useScreenSize();

	return (
		<>
			<div className="w-full h-60 px-4">
				<div className="w-full h-60 bg-primary-main relative overflow-x-auto overflow-y-hidden">
					<Image
						src={src}
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
