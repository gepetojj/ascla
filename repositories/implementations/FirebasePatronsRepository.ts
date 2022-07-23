import type { Patron, UpdatablePatron } from "entities/Patron";
import { Collections } from "myFirebase/enums";
import type {
	CreatePatronDTO,
	PatronsRepository,
	UpdatePatronDTO,
} from "repositories/PatronsRepository";
import { v4 as uuid } from "uuid";

export class FirebasePatronsRepository implements PatronsRepository {
	private readonly col: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;

	constructor() {
		this.col = Collections.patrons;
	}

	async getById(id: string): Promise<Patron | undefined> {
		if (!id) throw new Error("O ID é necessário para encontrar os dados.");

		try {
			const query = await this.col.doc(id).get();
			const data = query.data() as Patron | undefined;
			return data;
		} catch (err) {
			console.trace(err);
			return undefined;
		}
	}

	async getBySlug(slug: string): Promise<Patron | undefined> {
		if (!slug) throw new Error("O slug é necessário para encontrar os dados.");

		try {
			const query = await this.col.where("metadata.urlId", "==", slug).get();
			if (query.empty || !query.docs) return undefined;
			const data = query.docs[0].data() as Patron | undefined;
			return data;
		} catch (err) {
			console.trace(err);
			return undefined;
		}
	}

	async getAll(): Promise<Patron[] | undefined> {
		try {
			const query = await this.col.get();
			if (query.empty || !query.docs) return undefined;

			const patrons: Patron[] = [];
			for (const patron of query.docs) {
				const data = patron.data() as Patron;
				patrons.push(data);
			}
			return patrons;
		} catch (err) {
			console.trace(err);
			return undefined;
		}
	}

	async create({
		id,
		name,
		bio,
		avatarUrl,
		chair,
		slug,
		academicId,
	}: CreatePatronDTO): Promise<boolean> {
		try {
			const data: Patron = {
				id: id || uuid(),
				name,
				bio,
				avatarUrl,
				metadata: {
					academicId: academicId || "nenhum",
					chair,
					urlId: slug,
					createdAt: Date.now(),
					updatedAt: 0,
				},
			};

			await this.col.doc(data.id).create(data);
			return true;
		} catch (err) {
			console.trace(err);
			return false;
		}
	}

	async update(
		id: Patron["id"],
		{ name, bio, chair, avatarUrl, academicId }: UpdatePatronDTO
	): Promise<boolean> {
		try {
			const patron: UpdatablePatron = {
				"metadata.updatedAt": Date.now(),
			};

			if (name && typeof name === "string") patron.name = name;
			if (bio && bio.content?.length) patron.bio = bio;
			if (chair && typeof chair === "number") patron["metadata.chair"] = chair;
			if (avatarUrl && typeof avatarUrl === "string") patron.avatarUrl = avatarUrl;
			if (academicId && typeof academicId === "string") patron["metadata.academicId"] = academicId;

			// Não atualiza o documento caso nenhum campo tenha mudado além da data de atualização
			if (Object.keys(patron).length <= 1) return false;

			await this.col.doc(id).update(patron);
			return true;
		} catch (err) {
			console.trace(err);
			return false;
		}
	}

	async delete(id: string): Promise<boolean> {
		if (!id) throw new Error("O ID é necessário para encontrar os dados.");

		try {
			await this.col.doc(id).delete();
			return true;
		} catch (err) {
			console.trace(err);
			return false;
		}
	}
}
