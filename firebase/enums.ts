import { firestore } from "./server";

export type CollectionName = "blogPosts" | "news" | "patrons" | "academics" | "users";

export enum CollectionsNames {
	blogPosts = "blogPosts",
	news = "news",
	patrons = "patrons",
	academics = "academics",
	users = "users",
}

export const Collections = {
	blogPosts: firestore.collection(CollectionsNames.blogPosts),
	news: firestore.collection(CollectionsNames.news),
	patrons: firestore.collection(CollectionsNames.patrons),
	academics: firestore.collection(CollectionsNames.academics),
	users: firestore.collection(CollectionsNames.users),
};
