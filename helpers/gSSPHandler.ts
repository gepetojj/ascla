import { CollectionName, Collections } from "myFirebase/enums";
import type { GetServerSidePropsContext, GetServerSidePropsResult, PreviewData } from "next";
import type { ParsedUrlQuery } from "querystring";

export interface GSSPHandlerEnsure {
	query?: string[];
	params?: string[];
}

export interface GSSPHandlerOptions {
	col: CollectionName;
	ensure?: GSSPHandlerEnsure;
	autoTry?: boolean;
}

export type GSSPHandlerCallback<ReturnPropsType> = (
	col: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>
) => Promise<GetServerSidePropsResult<ReturnPropsType>>;

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
