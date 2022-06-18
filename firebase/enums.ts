import { firestore } from "./server";

/** Nomes das coleções do banco de dados em tipo. */
export type CollectionName = "blogPosts" | "news" | "patrons" | "academics" | "users";

/** Nomes das coleções do banco de dados em enum. */
export enum CollectionsNames {
	blogPosts = "blogPosts",
	news = "news",
	patrons = "patrons",
	academics = "academics",
	users = "users",
}

/**
 * Coleções do banco de dados.
 *
 * @see {@link CollectionsNames}
 */
export const Collections = {
	/** Coleção de postagens do blog. */
	blogPosts: firestore.collection(CollectionsNames.blogPosts),
	/** Coleção de postagens das notícias. */
	news: firestore.collection(CollectionsNames.news),
	/** Coleção dos patronos. */
	patrons: firestore.collection(CollectionsNames.patrons),
	/** Coleção dos acadêmicos. */
	academics: firestore.collection(CollectionsNames.academics),
	/** Coleção dos usuários. */
	users: firestore.collection(CollectionsNames.users),
};
