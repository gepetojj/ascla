import type { DefaultResponse } from "entities/DefaultResponse";
import type { User } from "entities/User";
import { apiHandler } from "helpers/apiHandler";
import type { NextApiRequest, NextApiResponse } from "next";

interface Response extends DefaultResponse {
	users?: User[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
	return apiHandler(req, res, { method: "get", col: "users", adminOnly: true }, async col => {
		try {
			const query = await col.get();
			const users: User[] = [];

			query.forEach(user => users.push(user.data() as User));

			res.json({ message: "Usuários listados com sucesso.", users });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Não foi possível listar os usuários." });
		}

		return res;
	});
}
