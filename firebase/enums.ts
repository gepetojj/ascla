import { firestore } from "./server";

export type CollectionName = "posts" | "patrons" | "academics" | "users";

export enum CollectionsNames {
	posts = "posts",
	patrons = "patrons",
	academics = "academics",
	users = "users",
}

export const Collections = {
	posts: firestore.collection(CollectionsNames.posts),
	patrons: firestore.collection(CollectionsNames.patrons),
	academics: firestore.collection(CollectionsNames.academics),
	users: firestore.collection(CollectionsNames.users),
};
