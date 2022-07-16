import type { JSONContent } from "@tiptap/core";

import { config } from "config";
import type { Academic } from "entities/Academic";
import type { DefaultResponse } from "entities/DefaultResponse";
import { apiHandler } from "helpers/apiHandler";
import { getIdFromText } from "helpers/getIdFromText";
import { uploadAvatar } from "helpers/uploadAvatar";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { v4 as uuid } from "uuid";

interface NewAcademic {
	name: string;
	patronId?: string;
	chair: number;
	avatar?: string;
	bio: JSONContent;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<DefaultResponse>) {
	return await apiHandler(
		req,
		res,
		{ method: "post", col: "academics", role: "admin" },
		async (col, session) => {
			if (!session?.sub) {
				res.status(401).json({ message: "Houve um erro com sua sessão." });
				return res;
			}

			const { name, patronId, chair, avatar, bio }: NewAcademic = req.body;

			// TODO: Adicionar validação aos dados
			if (!name || !chair || !bio.content?.length) {
				res.status(400).json({
					message: "Informe os dados do acadêmico corretamente.",
				});
				return res;
			}

			const customUrl = getIdFromText(name);

			try {
				const query = await col.where("metadata.urlId", "==", customUrl).get();
				if (!query.empty || query.docs.length) {
					res.status(400).json({ message: "O ID customizado do acadêmico já existe." });
					return res;
				}

				const academicId = uuid();
				const upload = avatar
					? await uploadAvatar(avatar, session.sub, academicId)
					: {
							link: "https://ik.imagekit.io/gepetojj/ascla/tr:w-124,f-auto,cm-pad_resize,q-75/usuario-padrao.webp",
					  };

				const academic: Academic = {
					id: academicId,
					metadata: {
						urlId: customUrl,
						createdAt: Date.now(),
						updatedAt: 0,
						patronId: patronId || "nenhum",
						chair,
					},
					name,
					bio,
					avatarUrl: upload.link,
				};

				await col.doc(academic.id).create(academic);

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
						academicId,
					}),
				});

				res.json({ message: "Acadêmico criado com sucesso." });
			} catch (err) {
				console.error(err);
				res.status(500).json({ message: "Não foi possível criar o acadêmico." });
			}

			return res;
		}
	);
}
