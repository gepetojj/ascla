import NextImage, { ImageProps, ImageLoader } from "next/image";
import React, { FC, memo } from "react";

const customLoader: ImageLoader = ({ src, width, quality }) => {
	return `https://ik.imagekit.io/gepetojj/ascla/tr:w-${width},f-auto,cm-pad_resize,q-${
		quality ?? 75
	}/${src}`;
};

const ImageComponent: FC<ImageProps> = ({ src, ...props }) => {
	const willUseCustomLoader = process.env.NODE_ENV === "production";

	return (
		<NextImage
			{...props}
			loader={willUseCustomLoader ? customLoader : undefined}
			src={
				willUseCustomLoader
					? src
					: src.toString().startsWith("https")
					? src
					: `/images/${src}`
			}
		/>
	);
};

export const Image = memo(ImageComponent);
