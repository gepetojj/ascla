import type { DefaultResponse } from "entities/DefaultResponse";
import type { User } from "entities/User";
import { apiHandler } from "helpers/apiHandler";
import type { NextApiRequest, NextApiResponse } from "next";

interface UpdateUser {
	name?: string;
	avatarUrl?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<DefaultResponse>) {
	return apiHandler(req, res, { method: "put", col: "users" }, async (col, session) => {
		const { name, avatarUrl }: UpdateUser = req.body;

		if (!session || !session.user?.id) {
			res.status(401).json({ message: "Você não tem permissão para completar esta ação." });
			return res;
		}

		try {
			const query = await col.doc(session.user.id).get();
			const user = query.data() as User;

			if (!query.exists || !user) {
				res.status(400).json({ message: "Usuário não encontrado." });
				return res;
			}

			if (name && typeof name === "string") user.name = name;
			if (avatarUrl && typeof avatarUrl === "string") user.avatarUrl = avatarUrl;

			await col.doc(session.user.id).update(user);
			res.json({ message: "Dados atualizados com sucesso." });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Não foi possível atualizar seus dados." });
		}

		return res;
	});
}
