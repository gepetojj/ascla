import { CollectionName, Collections } from "myFirebase/enums";

export const getData = async <I>(id: string, colName: CollectionName): Promise<I | null> => {
	const col = Collections[colName];

	try {
		const query = await col.doc(id).get();
		if (!query.exists || !query.data()) return null;
		return query.data() as I;
	} catch (err) {
		console.trace(err);
		return null;
	}
};
