import { Main } from "components/layout/Main";
import { PostView } from "components/view/Post";
import type { BlogPost as EBlogPost } from "entities/BlogPost";
import { useJSON } from "hooks/useJSON";
import { Collections } from "myFirebase/enums";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { NewsArticleJsonLd, NextSeo } from "next-seo";
import React from "react";

interface Props {
	news: EBlogPost;
}

const NewsPost: NextPage<Props> = ({ news }) => {
	const htmlString = useJSON(news.content);

	return (
		<>
			<NextSeo
				title={`Notícias - ${news.title || "Não encontrado"}`}
				description={news.description}
				openGraph={{
					title: news.title,
					description: news.description,
					url: `https://www.asclasi.com/noticias/${news.metadata.urlId}`,
					article: {
						publishedTime: new Date(news.metadata.createdAt).toISOString(),
						modifiedTime: new Date(news.metadata.updatedAt).toISOString(),
						section: "notícias",
					},
				}}
			/>
			<NewsArticleJsonLd
				url={`https://www.asclasi.com/noticias/${news.metadata.urlId}`}
				title={news.title}
				description={news.description}
				dateCreated={new Date(news.metadata.createdAt).toISOString()}
				datePublished={new Date(news.metadata.createdAt).toISOString()}
				dateModified={new Date(news.metadata.updatedAt).toISOString()}
				images={[]}
				authorName={news.metadata.authorId}
				section="culture"
				keywords={news.title.replaceAll(" ", ",").toLowerCase()}
				body={htmlString}
				publisherName="Notícias da Academia Santanense de Ciências, Letras e Artes"
				publisherLogo="https://www.asclasi.com/images/logo-ascla.webp"
			/>

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
