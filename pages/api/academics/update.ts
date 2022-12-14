import type { JSONContent } from "@tiptap/core";

import type { AcademicType } from "entities/Academic";
import type { DefaultResponse } from "entities/DefaultResponse";
import { apiHandler } from "helpers/apiHandler";
import { uploadAvatar } from "helpers/uploadAvatar";
import type { NextApiRequest, NextApiResponse } from "next";
import { academicsRepo, patronsRepo } from "repositories";

interface UpdateAcademic {
	id?: string;
	name?: string;
	patronId?: string;
	chair?: number;
	type?: AcademicType;
	bio?: JSONContent;
	avatar?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<DefaultResponse>) {
	return apiHandler(
		req,
		res,
		{ method: "put", col: "academics", role: "admin" },
		async (_, session) => {
			if (!session?.sub) {
				res.status(401).json({ message: "Houve um erro com sua sessão." });
				return res;
			}

			const { id, name, patronId, chair, type, avatar, bio }: UpdateAcademic = req.body;

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
				const updated = await academicsRepo.update(id, {
					name,
					bio,
					chair,
					type,
					avatarUrl,
					patronId,
				});

				// Atualiza a relação entre este acadêmico e seu patrono.
				if (updated && patronId) await patronsRepo.update(patronId, { academicId: id });

				res.json({ message: "Acadêmico atualizado com sucesso." });
			} catch (err) {
				console.error(err);
				res.status(500).json({ message: "Não foi possível atualizar o acadêmico." });
			}

			return res;
		}
	);
}
