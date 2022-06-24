import type { JSONContent } from "@tiptap/react";

import type { Academic, UpdatableAcademic } from "entities/Academic";
import type { DefaultResponse } from "entities/DefaultResponse";
import { apiHandler } from "helpers/apiHandler";
import { uploadAvatar } from "helpers/uploadAvatar";
import type { NextApiRequest, NextApiResponse } from "next";

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
				const query = await col.doc(id).get();
				const originalAcademic = query.data() as Academic;

				if (!query.exists || !originalAcademic) {
					res.status(400).json({ message: "Acadêmico não encontrado." });
					return res;
				}

				const academic: UpdatableAcademic = {
					metadata: {
						...originalAcademic.metadata,
						updatedAt: Date.now(),
					},
				};

				if (name && typeof name === "string") academic.name = name;
				if (patronId && typeof patronId === "string") academic.metadata.patronId = patronId;
				if (chair && typeof chair === "number") academic.metadata.chair = chair;
				if (avatar && typeof avatar === "string") {
					const upload = await uploadAvatar(avatar, session.sub, id);
					academic.avatarUrl = upload.link;
				}
				if (bio && bio.content?.length) academic.bio = bio;

				await col.doc(id).update(academic);
				res.json({ message: "Acadêmico atualizado com sucesso." });
			} catch (err) {
				console.error(err);
				res.status(500).json({ message: "Não foi possível atualizar o acadêmico." });
			}

			return res;
		}
	);
}
