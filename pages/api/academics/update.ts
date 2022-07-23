import type { JSONContent } from "@tiptap/core";

import { config } from "config";
import type { DefaultResponse } from "entities/DefaultResponse";
import { apiHandler } from "helpers/apiHandler";
import { uploadAvatar } from "helpers/uploadAvatar";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { academicsRepo } from "repositories";

interface UpdateAcademic {
	id?: string;
	name?: string;
	patronId?: string;
	chair?: number;
	bio?: JSONContent;
	avatar?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<DefaultResponse>) {
	return apiHandler(
		req,
		res,
		{ method: "put", col: "academics", role: "admin" },
		async (col, session) => {
			if (!session?.sub) {
				res.status(401).json({ message: "Houve um erro com sua sessão." });
				return res;
			}

			const { id, name, patronId, chair, avatar, bio }: UpdateAcademic = req.body;

			// TODO: Adicionar validação aos dados
			if (!id) {
				res.status(400).json({ message: "Informe o ID do acadêmico." });
				return res;
			}

			try {
				let avatarUrl = "";
				if (avatar && typeof avatar === "string") {
					const upload = await uploadAvatar(avatar, session.sub, id);
					avatarUrl = upload.link;
				}
				await academicsRepo.update(id, { name, bio, chair, avatarUrl, patronId });

				// Altera o academicId do patrono escolhido para este
				const token = await getToken({
					req,
					secret: process.env.NEXTAUTH_SECRET,
					raw: true,
				});
				fetch(`${config.basePath}/api/patrons/update`, {
					method: "PUT",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						id: patronId,
						academicId: id,
					}),
				});

				res.json({ message: "Acadêmico atualizado com sucesso." });
			} catch (err) {
				console.error(err);
				res.status(500).json({ message: "Não foi possível atualizar o acadêmico." });
			}

			return res;
		}
	);
}
