import { useCallback, useState } from "react";

export interface UseFetcherReturn<I> {
	data: I | undefined;
	fetcher: (body?: Record<string, unknown>) => Promise<void>;

	loading: boolean;
	error: boolean;
	errorData?: Record<string, unknown>;
}

export const useFetcher = <I>(
	url: string,
	method: "get" | "post" | "put" | "delete" = "get"
): UseFetcherReturn<I> => {
	const [data, setData] = useState<I>();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [errorData, setErrorData] = useState<UseFetcherReturn<I>["errorData"]>();

	const fetcher: UseFetcherReturn<I>["fetcher"] = useCallback(
		async body => {
			try {
				const response = await fetch(url, {
					method: method.toUpperCase(),
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
					body: body && JSON.stringify(body),
				});
				setLoading(false);
				setError(!response.ok);

				const data = await response.json();
				if (!response.ok) return setErrorData(data);
				setData(data as I);
			} catch {
				setData(undefined);
				setLoading(false);
				setError(true);
			}
			return;
		},
		[url, method]
	);

	return { data, fetcher, loading, error, errorData };
};
