import { useCallback, useEffect, useState } from "react";

export const useLocalStorage = (key: string): [string, (newValue: string) => void] => {
	const [value, setValue] = useState("");

	const changeValue = useCallback((newValue: string) => {
		setValue(JSON.stringify(newValue));
	}, []);

	const localStorageObserver = useCallback(
		(event: StorageEvent) => {
			if (event.key !== key) return;
			setValue(event.newValue || "");
		},
		[key]
	);

	useEffect(() => {
		setValue(localStorage.getItem(key) || "");
		window.addEventListener("storage", localStorageObserver);
		return () => window.removeEventListener("storage", localStorageObserver);
	}, [key, localStorageObserver]);

	useEffect(() => {
		localStorage.setItem(key, value);
	}, [key, value]);

	return [value, changeValue];
};
