import { Main } from "components/layout/Main";
import { PostView } from "components/view/Post";
import { config } from "config";
import type { BlogPost } from "entities/BlogPost";
import { gSSPHandler } from "helpers/gSSPHandler";
import { useJSON } from "hooks/useJSON";
import { GetServerSideProps, NextPage } from "next";
import { NewsArticleJsonLd, NextSeo } from "next-seo";
import React from "react";

interface Props {
	news: BlogPost;
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
					url: `${config.basePath}/noticias/${news.metadata.urlId}`,
					article: {
						publishedTime: new Date(news.metadata.createdAt).toISOString(),
						modifiedTime: new Date(news.metadata.updatedAt).toISOString(),
						section: "notícias",
					},
				}}
			/>
			<NewsArticleJsonLd
				url={`${config.basePath}/noticias/${news.metadata.urlId}`}
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
				publisherName={`Notícias da ${config.fullName}`}
				publisherLogo={`${config.basePath}/images/logo-ascla.webp`}
			/>

			<Main title={news.title} className="p-6 pb-12">
				<PostView {...news} />
			</Main>
		</>
	);
};

export default NewsPost;

export const getServerSideProps: GetServerSideProps<Props> = ctx =>
	gSSPHandler<Props>(
		ctx,
		{ col: "news", ensure: { query: ["urlId"] }, autoTry: true },
		async col => {
			const query = await col
				.where("metadata.urlId", "==", (ctx.query.urlId as string) || "")
				.get();
			if (query.empty || !query.docs) return { notFound: true };

			const news = query.docs[0].data() as BlogPost;
			return { props: { news } };
		}
	);
