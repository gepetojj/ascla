import type { JSONContent } from "@tiptap/core";

import type { DefaultMetadata } from "./DefaultMetadata";
import type { Patron } from "./Patron";

export type AcademicType = "primary" | "meritorious" | "honorary" | "correspondent" | "deceased";
export const AcademicTypes: { id: AcademicType; name: string }[] = [
	{ id: "primary", name: "Efetivo" },
	{ id: "meritorious", name: "Benemérito" },
	{ id: "correspondent", name: "Correspondente" },
	{ id: "honorary", name: "Honorário" },
	{ id: "deceased", name: "In Memoriam" },
];

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
	/** Tipo do acadêmico. */
	type: AcademicType;
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
	/**
	 * Metadados do acadêmico.
	 *
	 * @see {@link AcademicMetadata}
	 */
	metadata: AcademicMetadata;
}

/** Estrutura dos dados que podem ser atualizados em um acadêmico. */
export interface UpdatableAcademic {
	"metadata.updatedAt": number;
	"metadata.chair"?: number;
	"metadata.patronId"?: Patron["id"];
	"metadata.type"?: AcademicType;
	name?: string;
	avatarUrl?: string;
	bio?: JSONContent;
}

export interface OptimizedAcademic {
	id: string;
	name: string;
	metadata: {
		chair: number;
		urlId: string;
		type: AcademicType;
	};
}
