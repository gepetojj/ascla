import type { DefaultResponse } from "entities/DefaultResponse";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";

export interface RequireAdminResult<I> {
	authorized: boolean;
	unauthorized: () => NextApiResponse<I | DefaultResponse>;
	session: Session | null;
}

export const requireAdmin = async <I = any>(
	req: NextApiRequest,
	res: NextApiResponse<I | DefaultResponse>
): Promise<RequireAdminResult<I>> => {
	const unauthorized = () => {
		res.status(401).json({ message: "Você não está autorizado." });
		return res;
	};

	const session = await getSession({ req });
	return {
		authorized: !!session?.user && !!session.user.role && session.user.role === "admin",
		unauthorized,
		session,
	};
};
