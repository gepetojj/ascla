import type { JSONContent } from "@tiptap/core";

import type { Academic } from "entities/Academic";

export interface CreateAcademicDTO {
	id?: string;
	name: string;
	bio: JSONContent;
	avatarUrl: string;
	chair: number;
	slug: string;
	patronId?: string;
}

export interface UpdateAcademicDTO {
	name?: string;
	bio?: JSONContent;
	avatarUrl?: string;
	chair?: number;
	patronId?: string;
}

export interface AcademicsRepository {
	getById(id: string): Promise<Academic | undefined>;
	getBySlug(slug: string): Promise<Academic | undefined>;
	getAll(): Promise<Academic[] | undefined>;
	create(data: CreateAcademicDTO): Promise<boolean>;
	update(id: Academic["id"], data: UpdateAcademicDTO): Promise<boolean>;
	delete(id: string): Promise<boolean>;
}
