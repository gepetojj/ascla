import EventEmitter from "events";
import { useCallback, useState } from "react";

export interface UseFetcherEvents<I> extends EventEmitter {
	on(event: "success", listener: (data: I) => void): this;
	on(event: "error", listener: (error?: I | Error) => void): this;
}

export interface UseFetcherReturn<I> {
	loading: boolean;
	events: UseFetcherEvents<I>;
	fetcher: (body?: Record<string, unknown>, searchParams?: URLSearchParams) => Promise<void>;
}

export const useFetcher = <I>(
	url: string,
	method: "get" | "post" | "put" | "delete" = "get"
): UseFetcherReturn<I> => {
	const [events] = useState(new EventEmitter());
	const [loading, setLoading] = useState(false);

	const fetcher: UseFetcherReturn<I>["fetcher"] = useCallback(
		async (body, searchParams) => {
			setLoading(true);

			try {
				const response = await fetch(
					`${url}${searchParams ? `?${searchParams.toString()}` : ""}`,
					{
						method: method.toUpperCase(),
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json",
						},
						body: body && JSON.stringify(body),
					}
				);

				setLoading(false);
				const data = await response.json();

				if (response.ok) {
					events.emit("success", data as I);
					return;
				}

				events.emit("error", data);
			} catch {
				setLoading(false);
				events.emit("error");
			}

			return;
		},
		[url, method, events]
	);

	return { loading, events, fetcher };
};
