import type { JSONContent } from "@tiptap/core";

import type { Academic } from "./Academic";
import type { DefaultMetadata } from "./DefaultMetadata";

/**
 * Metadados de um patrono.
 *
 * @see {@link Patron}
 */
export interface PatronMetadata extends DefaultMetadata {
	/** ID do acadêmico desse patrono. */
	academicId: Academic["id"];
	/** Cadeira do patrono. */
	chair: number;
}

/**
 * Estrutura dos dados de um patrono.
 */
export interface Patron {
	/** ID do patrono. */
	id: string;
	/** Nome do patrono. */
	name: string;
	/** Biografia do patrono. */
	bio: JSONContent;
	/** Link para o avatar do acadêmico. */
	avatarUrl: string;
	/**
	 * Metadados do patrono.
	 *
	 * @see {@link PatronMetadata}
	 */
	metadata: PatronMetadata;
}

/** Estrutura dos dados que podem ser atualizados em um patrono. */
export interface UpdatablePatron {
	"metadata.updatedAt": number;
	"metadata.chair"?: number;
	"metadata.academicId"?: Academic["id"];
	name?: string;
	avatarUrl?: string;
	bio?: JSONContent;
}

export interface OptimizedPatron {
	id: string;
	name: string;
	metadata: {
		chair: number;
		urlId: string;
	};
}
