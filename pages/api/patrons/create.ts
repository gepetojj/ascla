import type { JSONContent } from "@tiptap/core";

import { config } from "config";
import type { DefaultResponse } from "entities/DefaultResponse";
import type { Patron } from "entities/Patron";
import { apiHandler } from "helpers/apiHandler";
import { getIdFromText } from "helpers/getIdFromText";
import { uploadAvatar } from "helpers/uploadAvatar";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { v4 as uuid } from "uuid";

interface NewPatron {
	name: string;
	academicId: string;
	chair: number;
	avatar: string;
	bio: JSONContent;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<DefaultResponse>) {
	return apiHandler(
		req,
		res,
		{ method: "post", col: "patrons", role: "admin" },
		async (col, session) => {
			if (!session?.sub) {
				res.status(401).json({ message: "Houve um erro com sua sessão." });
				return res;
			}

			const { name, academicId, chair, avatar, bio }: NewPatron = req.body;

			// TODO: Adicionar validação aos dados
			if (!name || !academicId || !chair || !avatar || !bio.content?.length) {
				res.status(400).json({ message: "Informe os dados do patrono corretamente." });
				return res;
			}

			const customUrl = getIdFromText(name);

			try {
				const query = await col.where("metadata.urlId", "==", customUrl).get();
				if (!query.empty || query.docs.length) {
					res.status(400).json({ message: "O ID customizado do patrono já existe." });
					return res;
				}

				const patronId = uuid();
				const upload = await uploadAvatar(avatar, session.sub, patronId);

				const patron: Patron = {
					id: patronId,
					metadata: {
						urlId: customUrl,
						createdAt: Date.now(),
						updatedAt: 0,
						academicId,
						chair,
					},
					name,
					bio,
					avatarUrl: upload.link,
				};

				await col.doc(patron.id).create(patron);

				// Altera o patronId do acadêmico escolhido para este
				const token = await getToken({
					req,
					secret: process.env.NEXTAUTH_SECRET,
					raw: true,
				});
				fetch(`${config.basePath}/api/academics/update`, {
					method: "PUT",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						id: academicId,
						patronId,
					}),
				});

				res.json({ message: "Patrono criado com sucesso." });
			} catch (err) {
				console.error(err);
				res.status(500).json({ message: "Não foi possível criar o patrono." });
			}

			return res;
		}
	);
}
