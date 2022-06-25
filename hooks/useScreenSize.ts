import { useCallback, useEffect, useState } from "react";

const getDimensions = () => {
	if (typeof window === "undefined") return { width: 0, height: 0 };
	return { width: window.innerWidth, height: window.innerHeight };
};

export const useScreenSize = () => {
	const [dimensions, setDimensions] = useState(getDimensions());

	const handleResize = useCallback(() => {
		setDimensions(getDimensions());
	}, []);

	useEffect(() => {
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [handleResize]);

	return dimensions;
};
