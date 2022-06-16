import type { DefaultResponse } from "entities/DefaultResponse";
import type { User, UserRole } from "entities/User";
import { apiHandler } from "helpers/apiHandler";
import type { NextApiRequest, NextApiResponse } from "next";

interface UpdateUser {
	id: string;
	role?: UserRole;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<DefaultResponse>) {
	return apiHandler(req, res, { method: "put", col: "users", role: "admin" }, async col => {
		const { id, role }: UpdateUser = req.body;

		// TODO: Adicionar validação aos dados
		if (!id) {
			res.status(400).json({ message: "Informe o ID do usuário." });
			return res;
		}

		try {
			const query = await col.doc(id).get();
			const user = query.data() as User;

			if (!query.exists || !user) {
				res.status(400).json({ message: "Usuário não encontrado." });
				return res;
			}

			if (role && typeof role === "string") {
				user.metadata.role = role;
				await col.doc(id).update(user);
			}

			res.json({ message: "Usuário atualizado com sucesso." });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Não foi possível atualizar o usuário." });
		}

		return res;
	});
}
