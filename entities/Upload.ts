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
	/** Localização do arquivo no Storage. */
	location: string;
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
}
