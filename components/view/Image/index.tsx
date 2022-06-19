import NextImage, { ImageProps, ImageLoader } from "next/image";
import React, { FC, memo } from "react";

const customLoader: ImageLoader = ({ src, width, quality }) => {
	return `https://ik.imagekit.io/gepetojj/tr:w-${width},f-auto,cm-pad_resize,q-${
		quality ?? 75
	}/${src}`;
};

const ImageComponent: FC<ImageProps> = ({ ...props }) => {
	return (
		<NextImage
			{...props}
			loader={process.env.NODE_ENV === "production" ? customLoader : undefined}
		/>
	);
};

export const Image = memo(ImageComponent);
