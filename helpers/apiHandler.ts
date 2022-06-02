import type { DefaultResponse } from "entities/DefaultResponse";
import { CollectionName, Collections } from "myFirebase/enums";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";

import { requireAdmin } from "./requireAdmin";

export type PostHandlerCallback<I> = (
	col: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
	session: Session | null
) => Promise<NextApiResponse<I | DefaultResponse>>;

export type PostHandlerMethods = "get" | "post" | "put" | "delete";

export interface PostHandlerOptions {
	method: PostHandlerMethods;
	col: CollectionName;
	adminOnly?: boolean;
}

export const apiHandler = async <I>(
	req: NextApiRequest,
	res: NextApiResponse,
	{ method, col, adminOnly }: PostHandlerOptions,
	callback: PostHandlerCallback<I>
): Promise<NextApiResponse<I | DefaultResponse>> => {
	if (req.method !== method.toLocaleUpperCase()) {
		res.status(405).json({ message: "Método não aceito." });
		return res;
	}

	const { authorized, unauthorized, session } = await requireAdmin<I>(req, res);
	if (adminOnly && !authorized) return unauthorized();

	return await callback(Collections[col], session);
};
