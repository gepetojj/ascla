import EventEmitter from "events";
import { useCallback, useState } from "react";

/** Eventos específicos do useFetcher */
export interface UseFetcherEvents<I> extends EventEmitter {
	/**
	 * Evento disparado sempre que uma função fetcher retorna sucesso.
	 *
	 * @param {string} event Sempre igual a `success`
	 * @param {Function} listener Callback executado quando o evento é disparado. Recebe os dados da função fetcher
	 */
	on(event: "success", listener: (data: I) => void): this;
	/**
	 * Evento disparado sempre que uma função fetcher retorna erro.
	 *
	 * @param {string} event Sempre igual a `error`
	 * @param {Function} listener Callback executado quando o evento é disparado. Recebe os dados da função fetcher ou um objeto de erro
	 */
	on(event: "error", listener: (error?: I | Error) => void): this;
}

/** Define o retorno do useFetcher */
export interface UseFetcherReturn<I> {
	/** Define se a função fetcher está carregando. */
	loading: boolean;
	/** Retorna um event emitter com os eventos do useFetcher. */
	events: UseFetcherEvents<I>;
	/** Função fetcher que deve ser executada sempre que for desejado executar o fetching. */
	fetcher: (body?: Record<string, unknown>, searchParams?: URLSearchParams) => Promise<void>;
}

/**
 * Hook para facilitar fetching e submit de dados. Usa o web fetch por baixo dos panos.
 * 
 * @see {@link UseFetcherReturn}
 * 
 * @param {string} url Endpoint que os dados serão enviados e/ou recebidos
 * @param {"get" | "post" | "put" | "delete"} method Método HTTP dos pedidos
 * @returns {UseFetcherReturn} Dados retornados pelo hook
 */
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
