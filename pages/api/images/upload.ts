import type { DefaultResponse } from "entities/DefaultResponse";
import type { Upload } from "entities/Upload";
import { File, Files, IncomingForm } from "formidable";
import { apiHandler } from "helpers/apiHandler";
import { storage } from "myFirebase/server";
import type { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";
import { v4 as uuid } from "uuid";

interface Response extends DefaultResponse {
	link?: string;
}

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
	return apiHandler(
		req,
		res,
		{ method: "post", col: "images", role: "academic" },
		async (col, session) => {
			if (!session?.user?.id) {
				res.status(401).json({ message: "Houve um erro com sua sessão." });
				return res;
			}

			const form = new IncomingForm({
				allowEmptyFiles: false,
				maxFields: 1,
				maxFiles: 1,
				maxFileSize: 5 * 1024 * 1024, // 5 MB
				hashAlgorithm: "md5",
				filter: ({ mimetype }) => !!mimetype && mimetype.includes("image"),
			});

			try {
				const files = await new Promise<Files>((resolve, reject) => {
					form.parse(req, async (err, _, files) => {
						if (err) return reject(err);
						return resolve(files);
					});
				});

				let image: File;
				const imageName = uuid();

				if (!files || !files.image) {
					res.status(400).json({ message: "Imagem não encontrada." });
					return res;
				}

				if ((files.image as File[]).length) image = (files.image as File[])[0];
				else if ((files.image as File).filepath) image = files.image as File;
				else {
					res.status(500).json({
						message: "Não foi possível manipular a imagem. Tente novamente.",
					});
					return res;
				}

				try {
					await sharp(image.filepath)
						.webp({ nearLossless: true })
						.toFile(`${image.filepath}.webp`);

					const upload = await storage.bucket().upload(`${image.filepath}.webp`, {
						public: true,
						destination: `/uploads/${session.user.id}/${imageName}.webp`,
						metadata: { firebaseStorageDownloadTokens: imageName },
					});

					const uploadLog: Upload = {
						id: imageName,
						link: upload[0].metadata.mediaLink,
						metadata: {
							uploadedAt: Date.now(),
							uploader: session.user.id,
							size: image.size,
							hash: String(image.hash),
							mimetype: String(image.mimetype),
						},
						uploadMetadata: upload[0],
					};
					await col.doc(imageName).create(uploadLog);

					res.status(200).json({
						message: "Upload concluído com sucesso.",
						link: uploadLog.link,
					});
					return res;
				} catch (err) {
					console.error(err);

					res.status(500).json({
						message: "Não foi possível fazer o upload da imagem. Tente novamente.",
					});
					return res;
				}
			} catch (err) {
				console.error(err);
				res.status(500).json({
					message: "Não foi possível processar a imagem. Tente novamente.",
				});
				return res;
			}
		}
	);
}
