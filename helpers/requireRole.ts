import type { DefaultResponse } from "entities/DefaultResponse";
import type { UserRole } from "entities/User";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";

export interface RequireRoleResult<I> {
	authorized: boolean;
	unauthorized: () => NextApiResponse<I | DefaultResponse>;
	session: Session | null;
}

export const requireRole = async <I>(
	req: NextApiRequest,
	res: NextApiResponse<I | DefaultResponse>,
	role: UserRole = "admin"
): Promise<RequireRoleResult<I>> => {
	const unauthorized = () => {
		res.status(401).json({ message: "Você não está autorizado." });
		return res;
	};

	const session = await getSession({ req });
	const acceptedRoles = role === "academic" ? ["academic", "admin"] : ["admin"];
	return {
		authorized:
			!!session?.user && !!session.user.role && acceptedRoles.includes(session.user.role),
		unauthorized,
		session,
	};
};
