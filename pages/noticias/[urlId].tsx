import { Main } from "components/layout/Main";
import { PostView } from "components/view/Post";
import type { BlogPost as EBlogPost } from "entities/BlogPost";
import { Collections } from "myFirebase/enums";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import React from "react";

interface Props {
	news: EBlogPost;
}

const NewsPost: NextPage<Props> = ({ news }) => {
	return (
		<>
			<NextSeo title={`Notícias - ${news.title || "Não encontrado"}`} />

			<Main title={news.title} className="p-6 pb-12">
				<PostView {...news} />
			</Main>
		</>
	);
};

export default NewsPost;

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
	const col = Collections.news;
	const urlId = params?.urlId;

	if (!urlId || typeof urlId !== "string") return { notFound: true };

	try {
		const query = await col.where("metadata.urlId", "==", urlId).get();
		const news = query.docs[0];
		if (query.empty || !news.exists) return { notFound: true };

		return { props: { news: news.data() as EBlogPost } };
	} catch (err) {
		console.error(err);
		return { notFound: true };
	}
};

export const getStaticPaths: GetStaticPaths = async () => {
	const col = Collections.news;
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
