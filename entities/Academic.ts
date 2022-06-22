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
	/** Cadeira do acadêmico. */
	chair: number;
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
	/** @deprecated As imagens dos acadêmicos agora são guardadas em base64. Use a propriedade `avatar`. */
	avatarUrl?: string;
	/** Avatar do acadêmico, em base64. */
	avatar: string;
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
	/** @deprecated As imagens dos acadêmicos agora são guardadas em base64. Use a propriedade `avatar`. */
	avatarUrl?: Academic["avatarUrl"];
	avatar?: Academic["avatar"];
	metadata: Academic["metadata"];
}
