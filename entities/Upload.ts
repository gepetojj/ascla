import type { File } from "@google-cloud/storage";

/**
 * Metadados de um upload.
 *
 * @see {@link Upload}
 */
export interface UploadMetadata {
	/** Timestamp do upload. */
	uploadedAt: number;
	/** ID do usuário que fez o upload. */
	uploader: string;
	/** Tamanho do arquivo antes da compressão. */
	size: number;
	/** Hash MD5 do arquivo antes da compressão. */
	hash: string;
	/** Mimetype do arquivo antes da compressão. */
	mimetype: string;
}

/**
 * Estrutura dos dados de um upload.
 */
export interface Upload {
	/** ID do upload. */
	id: string;
	/** Link público do upload. */
	link: string;
	/**
	 * Metadados do upload.
	 *
	 * @see {@link UploadMetadata}
	 */
	metadata: UploadMetadata;
	/**
	 * Metadados da resposta do upload.
	 *
	 * @see {@link File}
	 */
	uploadMetadata: File;
}
