import type { DefaultResponse } from "entities/DefaultResponse";
import type { Upload } from "entities/Upload";
import { File, Files, IncomingForm } from "formidable";
import { apiHandler } from "helpers/apiHandler";
import { storage } from "myFirebase/server";
import type { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";
import { v4 as uuid } from "uuid";

interface Response extends DefaultResponse {
	status: boolean;
	payload?: { link: string };
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
			if (!session?.sub) {
				res.status(401).json({ status: false, message: "Houve um erro com sua sessão." });
				return res;
			}

			const destinations = ["hl", "generic"];
			const destination = req.query.dest as string;
			if (
				!destination ||
				typeof destination !== "string" ||
				!destinations.includes(destination)
			) {
				res.status(400).json({ status: false, message: "Informe o destino do upload." });
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
					form.parse(req, (err, _, files) => {
						if (err) return reject(err);
						return resolve(files);
					});
				});

				let image: File;
				const imageName = uuid();
				const location =
					destination === "hl"
						? "uploads/highlight.webp"
						: `uploads/${session.sub}/${imageName}.webp`;

				if (!files || !files.file) {
					res.status(400).json({ status: false, message: "Imagem não encontrada." });
					return res;
				}

				if ((files.file as File[]).length) image = (files.file as File[])[0];
				else if ((files.file as File).filepath) image = files.file as File;
				else {
					res.status(500).json({
						status: false,
						message: "Não foi possível manipular a imagem. Tente novamente.",
					});
					return res;
				}

				try {
					await sharp(image.filepath)
						.webp({ quality: 60 })
						.toFile(`${image.filepath}.webp`);

					const upload = await storage.bucket().upload(`${image.filepath}.webp`, {
						public: true,
						destination: location,
						metadata: { firebaseStorageDownloadTokens: imageName },
					});

					const uploadLog: Upload = {
						id: imageName,
						link:
							process.env.NODE_ENV === "production"
								? `https://firebasestorage.googleapis.com/v0/b/${
										storage.app.options.storageBucket
								  }/o/${location.replaceAll(/\//g, "%2F")}?alt=media`
								: upload[0].metadata.mediaLink,
						metadata: {
							uploadedAt: Date.now(),
							uploader: session.sub,
							size: image.size,
							hash: String(image.hash),
							mimetype: String(image.mimetype),
							location,
						},
						uploadMetadata: upload[0].metadata,
					};
					await col.doc(destination === "hl" ? "highlight" : imageName).set(uploadLog);

					res.status(200).json({
						status: true,
						message: "Upload concluído com sucesso.",
						payload: { link: uploadLog.link },
					});
					return res;
				} catch (err) {
					console.error(err);

					res.status(500).json({
						status: false,
						message: "Não foi possível fazer o upload da imagem. Tente novamente.",
					});
					return res;
				}
			} catch (err) {
				console.error(err);
				res.status(500).json({
					status: false,
					message: "Não foi possível processar a imagem. Tente novamente.",
				});
				return res;
			}
		}
	);
}
