import NextImage, { ImageProps, ImageLoader } from "next/image";
import React, { FC, memo } from "react";

const customLoader: ImageLoader = ({ src, width, quality }) => {
	return `https://ik.imagekit.io/gepetojj/ascla/tr:w-${width},f-auto,cm-pad_resize,q-${
		quality ?? 75
	}/${src}`;
};

const ImageComponent: FC<ImageProps> = ({ src, ...props }) => {
	// ! Um erro desconhecido está ocorrendo com o Imagekit e o Firebase Storage.
	// ! Enquanto tal problema não é resolvido, imagens vindas do seu domínio devem passar direto.
	const temp_domainSkip = "https://firebasestorage.googleapis.com";
	const willUseCustomLoader =
		process.env.NODE_ENV === "production" && !src.toString().startsWith(temp_domainSkip);

	return (
		<NextImage
			{...props}
			loader={willUseCustomLoader ? customLoader : undefined}
			src={
				willUseCustomLoader
					? src
					: src.toString().startsWith("http")
					? src
					: `/images/${src}`
			}
		/>
	);
};

export const Image = memo(ImageComponent);
