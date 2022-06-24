import type { JSONContent } from "@tiptap/react";

import type { DefaultMetadata } from "./DefaultMetadata";
import type { Patron } from "./Patron";

/**
 * Metadados de um acadêmico.
 *
 * @see {@link Academic}
 */
export interface AcademicMetadata extends DefaultMetadata {
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
	/** Link para o avatar do acadêmico. */
	avatarUrl: string;
	/** @deprecated Avatares não são mais armazenados em base64, use a propriedade `avatarUrl`. */
	avatar?: string;
	/**
	 * Metadados do acadêmico.
	 *
	 * @see {@link AcademicMetadata}
	 */
	metadata: AcademicMetadata;
}

/** Estrutura dos dados que podem ser atualizados em um acadêmico. */
export type UpdatableAcademic = Partial<Omit<Academic, "id">> & {
	metadata: AcademicMetadata;
};
