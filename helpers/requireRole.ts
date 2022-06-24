import type { DefaultResponse } from "entities/DefaultResponse";
import type { UserRole } from "entities/User";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken, JWT } from "next-auth/jwt";

/** Resultado retornado pelo requireRole. */
export interface RequireRoleResult<I> {
	/** Define se o usuário está autorizado ou não. */
	authorized: boolean;
	/** Função executada quando o usuário não estiver autorizado. */
	unauthorized: () => NextApiResponse<I | DefaultResponse>;
	/** Sessão do usuário. */
	session: JWT | null;
}

/**
 * Verifica a sessão do usuário e determina se está autorizado a acessar uma API
 * dependendo de seu cargo.
 *
 * @see {@link RequireRoleResult}
 *
 * @param {NextApiRequest} req Objeto do pedido
 * @param {NextApiResponse} res Objeto da resposta
 * @param {UserRole} role Cargo necessário para acessar a API
 * @returns {Promise<RequireRoleResult>} Resultado da verificação
 */
export const requireRole = async <I>(
	req: NextApiRequest,
	res: NextApiResponse<I | DefaultResponse>,
	role: UserRole = "admin"
): Promise<RequireRoleResult<I>> => {
	const unauthorized = () => {
		res.status(401).json({ message: "Você não está autorizado." });
		return res;
	};

	const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
	const acceptedRoles = role === "academic" ? ["academic", "admin"] : ["admin"];
	return {
		authorized: !!session && !!session.role && acceptedRoles.includes(session.role),
		unauthorized,
		session,
	};
};
