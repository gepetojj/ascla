import { PostView } from "components/view/Post";
import { BlogPost as EBlogPost } from "entities/BlogPost";
import { firestore } from "myFirebase/server";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import React from "react";

interface Props {
	post: EBlogPost;
}

const BlogPost: NextPage<Props> = ({ post }) => {
	return (
		<>
			<Head>
				<title>ASCLA - Blog - {post.title}</title>
			</Head>

			<main>
				<PostView {...post} showUserInteractions />
			</main>
		</>
	);
};

export default BlogPost;

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
	const col = firestore.collection("posts");
	const urlId = params?.urlId;

	if (!urlId || typeof urlId !== "string") return { notFound: true };

	try {
		const query = await col.where("metadata.urlId", "==", urlId).get();
		const post = query.docs[0];
		if (query.empty || !post) return { notFound: true };

		return { props: { post: post.data() as EBlogPost } };
	} catch (err) {
		console.error(err);
		return { notFound: true };
	}
};

export const getStaticPaths: GetStaticPaths = async () => {
	const col = firestore.collection("posts");
	const paths: { params: { urlId: string } }[] = [];

	try {
		const { empty, docs } = await col.get();
		if (!empty && docs.length) {
			docs.forEach(doc => {
				const { metadata } = doc.data() as EBlogPost;
				paths.push({ params: { urlId: metadata.urlId } });
			});
		}
	} catch (err) {
		console.error(err);
	}

	return {
		paths,
		fallback: "blocking",
	};
};
