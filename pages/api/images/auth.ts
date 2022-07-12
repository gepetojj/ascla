import ImageKit from "imagekit";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const ik = new ImageKit({
		urlEndpoint: String(process.env.NEXT_PUBLIC_IK_URL),
		publicKey: String(process.env.NEXT_PUBLIC_IK_KEY),
		privateKey: String(process.env.IMAGEKIT_PRIVATE_KEY),
	});

	const params = ik.getAuthenticationParameters();
	return res.json(params);
}
