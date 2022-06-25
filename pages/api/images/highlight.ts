import { apiHandler } from "helpers/apiHandler";
import { storage } from "myFirebase/server";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	return apiHandler(req, res, { method: "get", col: "images" }, async () => {
		const link =
			process.env.NODE_ENV === "development"
				? `http://localhost:9199/download/storage/v1/b/${storage.app.options.storageBucket}/o/uploads%2Fhighlight.webp?alt=media`
				: `https://firebasestorage.googleapis.com/v0/b/${
						storage.app.options.storageBucket
				  }/o/${"uploads/highlight.webp".replaceAll(/\//g, "%2F")}?alt=media`;
		return res.redirect(link);
	});
}
