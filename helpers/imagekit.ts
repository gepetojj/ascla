import ImageKit from "imagekit";

export const imagekit = new ImageKit({
	urlEndpoint: String(process.env.NEXT_PUBLIC_IK_URL),
	publicKey: String(process.env.NEXT_PUBLIC_IK_KEY),
	privateKey: String(process.env.IMAGEKIT_PRIVATE_KEY),
});
