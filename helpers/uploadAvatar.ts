import type { Upload } from "entities/Upload";
import { Collections } from "myFirebase/enums";
import { storage } from "myFirebase/server";
import { tmpdir } from "os";
import { resolve } from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid";

export const uploadAvatar = async (
	avatar: string,
	uploaderId: string,
	subjectId: string
): Promise<Upload> => {
	const imageId = uuid();

	const buffer = Buffer.from(avatar.replace("data:image/png;base64,", ""), "base64");
	const path = resolve(tmpdir(), `${imageId}.webp`);
	const location = `avatars/${subjectId}/${imageId}.webp`;

	const transform = await sharp(buffer).webp({ quality: 68 }).toFile(path);
	const upload = await storage.bucket().upload(path, {
		public: true,
		destination: location,
	});

	const uploadLog: Upload = {
		id: imageId,
		link:
			process.env.NODE_ENV === "production"
				? `https://firebasestorage.googleapis.com/v0/b/${
						storage.app.options.storageBucket
				  }/o/${location.replaceAll(/\//g, "%2F")}?alt=media`
				: upload[0].metadata.mediaLink,
		metadata: {
			uploadedAt: Date.now(),
			uploader: uploaderId,
			size: transform.size,
			hash: avatar,
			mimetype: "image/png",
			location: location,
		},
		uploadMetadata: upload[0].metadata,
	};
	await Collections.images.doc(imageId).create(uploadLog);
	return uploadLog;
};
