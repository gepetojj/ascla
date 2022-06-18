import type { JSONContent } from "@tiptap/react";

import type { Patron } from "./Patron";

/**
 * Metadados de um acadêmico.
 *
 * @see {@link Academic}
 */
export interface AcademicMetadata {
	/** Url personalizada para o acadêmico. */
	urlId: string;
	/** Timestamp de criação do acadêmico. */
	createdAt: number;
	/** Timestamp de atualização do acadêmico. */
	updatedAt: number;
	/** ID do patrono desse acadêmico. */
	patronId: Patron["id"];
}

/**
 * Estrutura dos dados de um acadêmico.
 */
export interface Academic {
	/** ID do acadêmico. */
	id: string;
	/** Nome do acadêmico. */
	name: string;
	/** Biografia do acadêmico. */
	bio: JSONContent;
	/** Link do avatar do acadêmico. */
	avatarUrl?: string;
	/**
	 * Metadados do acadêmico.
	 *
	 * @see {@link AcademicMetadata}
	 */
	metadata: AcademicMetadata;
}

/** Estrutura dos dados que podem ser atualizados em um acadêmico. */
export interface UpdatableAcademic {
	name?: Academic["name"];
	bio?: Academic["bio"];
	avatarUrl?: Academic["avatarUrl"];
	metadata: Academic["metadata"];
}
