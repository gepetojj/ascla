import type { DefaultResponse } from "entities/DefaultResponse";
import type { UserRole } from "entities/User";
import { CollectionName, Collections } from "myFirebase/enums";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";

import { requireRole } from "./requireRole";

export type ApiHandlerCallback<I> = (
	col: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
	session: Session | null
) => Promise<NextApiResponse<I | DefaultResponse>>;

export type ApiHandlerMethods = "get" | "post" | "put" | "delete";

export interface ApiHandlerOptions {
	method: ApiHandlerMethods;
	col: CollectionName;
	role?: UserRole;
}

export const apiHandler = async <I>(
	req: NextApiRequest,
	res: NextApiResponse,
	{ method, col, role }: ApiHandlerOptions,
	callback: ApiHandlerCallback<I>
): Promise<NextApiResponse<I | DefaultResponse>> => {
	if (req.method !== method.toLocaleUpperCase()) {
		res.status(405).json({ message: "Método não aceito." });
		return res;
	}

	const { authorized, unauthorized, session } = await requireRole<I>(req, res, role);
	if (role && role !== "common" && !authorized) return unauthorized();

	return await callback(Collections[col], session);
};
