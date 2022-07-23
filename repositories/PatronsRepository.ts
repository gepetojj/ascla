import type { JSONContent } from "@tiptap/core";

import type { Patron } from "entities/Patron";

export interface CreatePatronDTO {
	id?: string;
	name: string;
	bio: JSONContent;
	avatarUrl: string;
	chair: number;
	slug: string;
	academicId?: string;
}

export interface UpdatePatronDTO {
	name?: string;
	bio?: JSONContent;
	avatarUrl?: string;
	chair?: number;
	academicId?: string;
}

export interface PatronsRepository {
	getById(id: string): Promise<Patron | undefined>;
	getBySlug(slug: string): Promise<Patron | undefined>;
	getAll(): Promise<Patron[] | undefined>;
	create(data: CreatePatronDTO): Promise<boolean>;
	update(id: Patron["id"], data: UpdatePatronDTO): Promise<boolean>;
	delete(id: string): Promise<boolean>;
}
