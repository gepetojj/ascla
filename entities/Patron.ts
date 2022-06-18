import type { JSONContent } from "@tiptap/react";

import type { Academic } from "./Academic";

/**
 * Metadados de um patrono.
 *
 * @see {@link Patron}
 */
export interface PatronMetadata {
	/** Url personalizada para o patrono. */
	urlId: string;
	/** Timestamp de criação do patrono. */
	createdAt: number;
	/** Timestamp de atualização do patrono. */
	updatedAt: number;
	/** ID do acadêmico desse patrono. */
	academicId: Academic["id"];
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
	/** Link do avatar do patrono. */
	avatarUrl?: string;
	/**
	 * Metadados do patrono.
	 *
	 * @see {@link PatronMetadata}
	 */
	metadata: PatronMetadata;
}

/** Estrutura dos dados que podem ser atualizados em um patrono. */
export interface UpdatablePatron {
	name?: Patron["name"];
	bio?: Patron["bio"];
	avatarUrl?: Patron["avatarUrl"];
	metadata: Patron["metadata"];
}
