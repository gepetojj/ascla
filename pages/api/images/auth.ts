import { imagekit } from "helpers/imagekit";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const params = imagekit.getAuthenticationParameters();
	return res.json(params);
}
