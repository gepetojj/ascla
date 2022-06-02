import { firestore } from "./server";

export type CollectionName = "posts" | "patrons" | "academics";

export enum CollectionsNames {
	posts = "posts",
	patrons = "patrons",
	academics = "academics",
}

export const Collections = {
	posts: firestore.collection(CollectionsNames.posts),
	patrons: firestore.collection(CollectionsNames.patrons),
	academics: firestore.collection(CollectionsNames.academics),
};
