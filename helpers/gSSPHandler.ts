import { CollectionName, Collections } from "myFirebase/enums";
import type { GetServerSidePropsContext, GetServerSidePropsResult, PreviewData } from "next";
import type { ParsedUrlQuery } from "querystring";

/** Dados que devem existir quando a função for executada. */
export interface GSSPHandlerEnsure {
	/** Array de keys de dados que devem existir no query. */
	query?: string[];
	/** Array de keys de dados que devem existir nos params. */
	params?: string[];
}

/** Opções do gSSPHandler. */
export interface GSSPHandlerOptions {
	/**
	 * Coleção do banco de dados desejada pela API.
	 *
	 * @see {@link CollectionName}
	 */
	col: CollectionName;
	/**
	 * Definição de dados que deverão existir quando a API for chamada.
	 *
	 * @see {@link GSSPHandlerEnsure}
	 */
	ensure?: GSSPHandlerEnsure;
	/** Define se o callback deve ser envelopado por um try-catch. */
	autoTry?: boolean;
}

/** Definição do callback executado pelo gSSPHandler. */
export type GSSPHandlerCallback<ReturnPropsType> = (
	col: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>
) => Promise<GetServerSidePropsResult<ReturnPropsType>>;

/**
 * Função que padroniza os `getServerSideProps`. Permite personalizar cada API com um
 * callback que retorna uma coleção do banco de dados.
 *
 * @see {@link GSSPHandlerOptions}
 * @see {@link GSSPHandlerCallback}
 *
 * @param {GetServerSidePropsContext} ctx Contexto da execução
 * @param {GSSPHandlerOptions} ...options Opções desestruturadas
 * @param {GSSPHandlerCallback} callback Callback que será executado quando a API for chamada
 * @returns {Promise<GetServerSidePropsResult>} Objeto da resposta manipulado pela função
 */
export const gSSPHandler = async <ReturnPropsType>(
	ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
	{ col, ensure, autoTry }: GSSPHandlerOptions,
	callback: GSSPHandlerCallback<ReturnPropsType>
): Promise<GetServerSidePropsResult<ReturnPropsType>> => {
	if (ensure?.params && ctx.params) {
		for (const param of ensure.params) {
			if (!ctx.params[param] || typeof ctx.params[param] !== "string") {
				return { notFound: true };
			}
		}
	}

	if (ensure?.query) {
		for (const query of ensure.query) {
			if (!ctx.query[query] || typeof ctx.query[query] !== "string") {
				return { notFound: true };
			}
		}
	}

	if (autoTry) {
		try {
			return await callback(Collections[col]);
		} catch (err) {
			console.error(err);
			return { notFound: true };
		}
	}

	return await callback(Collections[col]);
};
