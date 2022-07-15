import type { JSONContent } from "@tiptap/core";

import { config } from "config";
import type { DefaultResponse } from "entities/DefaultResponse";
import type { Patron, UpdatablePatron } from "entities/Patron";
import { apiHandler } from "helpers/apiHandler";
import { uploadAvatar } from "helpers/uploadAvatar";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

interface UpdatePatron {
	id?: string;
	name?: string;
	academicId?: string;
	chair?: number;
	bio?: JSONContent;
	avatar?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<DefaultResponse>) {
	return apiHandler(
		req,
		res,
		{ method: "put", col: "patrons", role: "admin" },
		async (col, session) => {
			if (!session?.sub) {
				res.status(401).json({ message: "Houve um erro com sua sessão." });
				return res;
			}

			const { id, name, academicId, chair, avatar, bio }: UpdatePatron = req.body;

			// TODO: Adicionar validação aos dados
			if (!id) {
				res.status(400).json({ message: "Informe o ID do patrono." });
				return res;
			}

			try {
				const query = await col.doc(id).get();
				const originalPatron = query.data() as Patron;

				if (!query.exists || !originalPatron) {
					res.status(400).json({ message: "Patrono não encontrado." });
					return res;
				}

				const patron: UpdatablePatron = {
					metadata: {
						...originalPatron.metadata,
						updatedAt: Date.now(),
					},
				};

				if (name && typeof name === "string") patron.name = name;
				if (academicId && typeof academicId === "string")
					patron.metadata.academicId = academicId;
				if (chair && typeof chair === "number") patron.metadata.chair = chair;
				if (avatar && typeof avatar === "string") {
					const upload = await uploadAvatar(avatar, session.sub, id);
					patron.avatarUrl = upload.link;
				}
				if (bio && bio.content?.length) patron.bio = bio;

				// Verificar a diferença entre patron e originalPatron; não havendo mudanças,
				// enviar resposta diferente.

				await col.doc(id).update(patron);

				// Altera o patronId do acadêmico escolhido para este
				const token = await getToken({
					req,
					secret: process.env.NEXTAUTH_SECRET,
					raw: true,
				});
				await fetch(`${config.basePath}/api/academics/update`, {
					method: "PUT",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						id: academicId,
						patronId: id,
					}),
				});

				res.json({ message: "Patrono atualizado com sucesso." });
			} catch (err) {
				console.error(err);
				res.status(500).json({ message: "Não foi possível atualizar o patrono." });
			}

			return res;
		}
	);
}
