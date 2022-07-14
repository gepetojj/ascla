import type { Upload } from "entities/Upload";
import { Collections } from "myFirebase/enums";
import { v4 as uuid } from "uuid";

import { imagekit } from "./imagekit";

/**
 * Faz upload de uma imagem base64 para o Storage.
 *
 * @param {string} avatar String de uma imagem em base64
 * @param {string} uploaderId ID do usuário fazendo o upload
 * @param {string} subjectId ID de quem pertence o avatar
 * @returns {Promise<Upload>} Dados do upload
 */
export const uploadAvatar = async (
	avatar: string,
	uploaderId: string,
	subjectId: string
): Promise<Upload> => {
	const imageId = uuid();
	const imageName = `${imageId}.png`;

	const buffer = Buffer.from(avatar.replace("data:image/png;base64,", ""), "base64");
	const folder = `avatars/${subjectId}`;

	// const transform = await sharp(buffer).webp({ quality: 68 }).toFile(path);
	const upload = await imagekit.upload({
		file: buffer,
		fileName: imageName,
		folder,
		useUniqueFileName: false,
	});

	const uploadLog: Upload = {
		id: imageId,
		link: upload.url,
		metadata: {
			uploadedAt: Date.now(),
			uploader: uploaderId,
			size: upload.size,
			hash: avatar,
			mimetype: "image/png",
			location: folder,
		},
	};
	await Collections.images.doc(imageId).create(uploadLog);
	return uploadLog;
};
