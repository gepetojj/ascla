import { FirebaseAcademicsRepository } from "./FirebaseAcademicsRepository";
import { FirebasePatronsRepository } from "./FirebasePatronsRepository";
import { FirebasePostsRepository } from "./FirebasePostsRepository";

export const academicsRepo = new FirebaseAcademicsRepository();
export const patronsRepo = new FirebasePatronsRepository();
export const postsRepo = new FirebasePostsRepository();
