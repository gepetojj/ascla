import type { DefaultResponse } from "entities/DefaultResponse";
import type { UserRole } from "entities/User";
import { CollectionName, Collections } from "myFirebase/enums";
import type { NextApiRequest, NextApiResponse } from "next";
import type { JWT } from "next-auth/jwt";

import { requireRole } from "./requireRole";

/** Definição do callback executado pelo apiHandler. */
export type ApiHandlerCallback<I> = (
	col: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
	session: JWT | null
) => Promise<NextApiResponse<I | DefaultResponse>>;

/** Métodos HTTP suportados pelo apiHandler. */
export type ApiHandlerMethods = "get" | "post" | "put" | "delete";

/** Opções do apiHandler */
export interface ApiHandlerOptions {
	/**
	 * Método HTTP.
	 *
	 * @see {@link ApiHandlerMethods}
	 */
	method: ApiHandlerMethods;
	/**
	 * Coleção do banco de dados desejada pela API.
	 *
	 * @see {@link CollectionName}
	 */
	col: CollectionName;
	/**
	 * Cargo do usuário necessário para acessar a API.
	 *
	 * @see {@link UserRole}
	 */
	role?: UserRole;
}

/**
 * Função que padroniza as APIs. Permite personalizar cada API com um
 * callback que retorna uma coleção do banco de dados e a sessão do usuário.
 *
 * @see {@link ApiHandlerOptions}
 * @see {@link ApiHandlerCallback}
 *
 * @param {NextApiRequest} req Objeto do pedido
 * @param {NextApiResponse} res Objeto da resposta
 * @param {ApiHandlerOptions} ...options Opções desestruturadas
 * @param {ApiHandlerCallback} callback Callback que será executado quando a API for chamada
 * @returns {Promise<NextApiResponse>} Objeto da resposta manipulado pela função
 */
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
