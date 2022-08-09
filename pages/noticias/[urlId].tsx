import { Main } from "components/layout/Main";
import { PostView } from "components/view/Post";
import { config } from "config";
import type { Post } from "entities/Post";
import { gSSPHandler } from "helpers/gSSPHandler";
import { useJSON } from "hooks/useJSON";
import { GetServerSideProps, NextPage } from "next";
import { NewsArticleJsonLd, NextSeo } from "next-seo";
import React from "react";

interface Props {
	news: Post<true>;
}

const NewsPost: NextPage<Props> = ({ news }) => {
	const htmlString = useJSON(news.content);

	return (
		<>
			<NextSeo
				title={`Notícias - ${news.title || "Não encontrado"}`}
				description={news.description}
				canonical={`${config.basePath}/noticias/${news.metadata.urlId}`}
				openGraph={{
					title: news.title,
					description: news.description,
					url: `${config.basePath}/noticias/${news.metadata.urlId}`,
					article: {
						publishedTime: new Date(news.metadata.createdAt).toISOString(),
						modifiedTime: new Date(news.metadata.updatedAt).toISOString(),
						section: "notícias",
					},
					images: [
						{
							url: `https://ik.imagekit.io/gepetojj/ascla/tr:w-1200,h-628/${news.thumbnailUrl}`,
							width: 1200,
							height: 628,
							alt: "Imagem de capa da notícia.",
							type: "image/webp",
						},
					],
				}}
			/>
			<NewsArticleJsonLd
				url={`${config.basePath}/noticias/${news.metadata.urlId}`}
				title={news.title}
				description={news.description}
				dateCreated={new Date(news.metadata.createdAt).toISOString()}
				datePublished={new Date(news.metadata.createdAt).toISOString()}
				dateModified={new Date(news.metadata.updatedAt).toISOString()}
				images={[
					`https://ik.imagekit.io/gepetojj/ascla/tr:w-1200,h-628/${news.thumbnailUrl}`,
				]}
				authorName={news.metadata.author?.name || ""}
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
		async () => {
			const res = await fetch(
				`${config.basePath}/api/posts/read?urlId=${ctx.query.urlId}&author=true&type=news`
			);
			if (!res.ok) return { notFound: true };

			const data: { post: Post<true> } = await res.json();
			const news = data.post;
			return { props: { news } };
		}
	);
