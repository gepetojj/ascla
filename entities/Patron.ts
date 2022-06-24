import type { JSONContent } from "@tiptap/react";

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
	/** @deprecated As imagens dos patronos agora são guardadas em base64. Use a propriedade `avatar`. */
	avatarUrl?: string;
	/** Avatar do patrono, em base64. */
	avatar: string;
	/**
	 * Metadados do patrono.
	 *
	 * @see {@link PatronMetadata}
	 */
	metadata: PatronMetadata;
}

/** Estrutura dos dados que podem ser atualizados em um patrono. */
export type UpdatablePatron = Partial<Omit<Patron, "id">> & {
	metadata: PatronMetadata;
};
