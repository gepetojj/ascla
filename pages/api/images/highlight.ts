import { readFileSync, createWriteStream, unlinkSync } from "fs";
import { apiHandler } from "helpers/apiHandler";
import { storage } from "myFirebase/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { resolve } from "path";

export const config = {
	api: {
		bodyParser: false,
	},
};

function getImageBuffer(name: string, unlink?: boolean): Buffer | null {
	try {
		const imagePath =
			process.env.NODE_ENV === "development"
				? resolve(process.cwd(), "public", "images", name)
				: resolve(process.cwd(), "images", name);
		const image = readFileSync(imagePath);
		if (unlink) unlinkSync(imagePath);
		return image;
	} catch (err) {
		console.error(err);
		return null;
	}
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const readStream = new Promise<NextApiResponse>(resolveP => {
		storage
			.bucket()
			.file("uploads/highlight.webp")
			.createReadStream()
			.on("error", err => {
				throw err;
			})
			.on("end", () => {
				const highlight = getImageBuffer("highlight.webp", true);
				res.setHeader("Content-Type", "image/webp").status(200).send(highlight);
				return resolveP(res);
			})
			.pipe(
				createWriteStream(
					resolve(
						process.env.NODE_ENV === "development"
							? resolve(process.cwd(), "public", "images", "highlight.webp")
							: resolve(process.cwd(), "images", "highlight.webp")
					)
				)
			);
	});

	return apiHandler(req, res, { method: "get", col: "images" }, async () => {
		try {
			return await readStream;
		} catch (err) {
			console.error(err);

			const fallbackImage = getImageBuffer("banner-ascla.webp");
			res.setHeader("Content-Type", "image/webp").status(200).send(fallbackImage);
			return res;
		}
	});
}
