import type { Academic, UpdatableAcademic } from "entities/Academic";
import { Collections } from "myFirebase/enums";
import type {
	AcademicsRepository,
	CreateAcademicDTO,
	UpdateAcademicDTO,
} from "repositories/AcademicsRepository";
import { v4 as uuid } from "uuid";

export class FirebaseAcademicsRepository implements AcademicsRepository {
	private readonly col: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;

	constructor() {
		this.col = Collections.academics;
	}

	async getById(id: string): Promise<Academic | undefined> {
		if (!id) throw new Error("O ID é necessário para encontrar os dados.");

		try {
			const query = await this.col.doc(id).get();
			const data = query.data() as Academic | undefined;
			return data;
		} catch (err) {
			console.trace(err);
			return undefined;
		}
	}

	async getBySlug(slug: string): Promise<Academic | undefined> {
		if (!slug) throw new Error("O slug é necessário para encontrar os dados.");

		try {
			const query = await this.col.where("metadata.urlId", "==", slug).get();
			if (query.empty || !query.docs) return undefined;
			const data = query.docs[0].data() as Academic | undefined;
			return data;
		} catch (err) {
			console.trace(err);
			return undefined;
		}
	}

	async getAll(): Promise<Academic[] | undefined> {
		try {
			const query = await this.col.orderBy("metadata.chair", "asc").get();
			if (query.empty || !query.docs) return undefined;

			const academics: Academic[] = [];
			for (const academic of query.docs) {
				const data = academic.data() as Academic;
				academics.push(data);
			}
			return academics;
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
		patronId,
	}: CreateAcademicDTO): Promise<boolean> {
		try {
			const data: Academic = {
				id: id || uuid(),
				name,
				bio,
				avatarUrl,
				metadata: {
					patronId: patronId || "nenhum",
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
		id: Academic["id"],
		{ name, bio, chair, avatarUrl, patronId }: UpdateAcademicDTO
	): Promise<boolean> {
		try {
			const academic: UpdatableAcademic = {
				"metadata.updatedAt": Date.now(),
			};

			if (name && typeof name === "string") academic.name = name;
			if (bio && bio.content?.length) academic.bio = bio;
			if (chair && typeof chair === "number") academic["metadata.chair"] = chair;
			if (avatarUrl && typeof avatarUrl === "string") academic.avatarUrl = avatarUrl;
			if (patronId && typeof patronId === "string") academic["metadata.patronId"] = patronId;

			// Não atualiza o documento caso nenhum campo tenha mudado além da data de atualização
			if (Object.keys(academic).length <= 1) return false;

			await this.col.doc(id).update(academic);
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
