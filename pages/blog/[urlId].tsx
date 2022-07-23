import { Main } from "components/layout/Main";
import { PostView } from "components/view/Post";
import { config } from "config";
import type { Post } from "entities/Post";
import { gSSPHandler } from "helpers/gSSPHandler";
import { GetServerSideProps, NextPage } from "next";
import { ArticleJsonLd, NextSeo } from "next-seo";
import React from "react";

interface Props {
	post: Post<true>;
}

const ViewBlogPost: NextPage<Props> = ({ post }) => {
	return (
		<>
			<NextSeo
				title={`Blog - ${post.title || "Não encontrado"}`}
				description={post.description}
				canonical={`${config.basePath}/blog/${post.metadata.urlId}`}
				openGraph={{
					title: post.title,
					description: post.description,
					url: `${config.basePath}/blog/${post.metadata.urlId}`,
					article: {
						publishedTime: new Date(post.metadata.createdAt).toISOString(),
						modifiedTime: new Date(post.metadata.updatedAt).toDateString(),
						section: "blog",
					},
				}}
			/>
			<ArticleJsonLd
				type="Blog"
				url={`${config.basePath}/blog/${post.metadata.urlId}`}
				title={post.title}
				description={post.description}
				datePublished={new Date(post.metadata.createdAt).toISOString()}
				dateModified={new Date(post.metadata.updatedAt).toISOString()}
				images={[]}
				authorName={post.metadata.author?.name || ""}
			/>

			<Main title={post.title} className="p-6 pb-12">
				<PostView {...post} />
			</Main>
		</>
	);
};

export default ViewBlogPost;

export const getServerSideProps: GetServerSideProps<Props> = ctx =>
	gSSPHandler<Props>(
		ctx,
		{ col: "blogPosts", ensure: { query: ["urlId"] }, autoTry: true },
		async () => {
			const res = await fetch(
				`${config.basePath}/api/posts/read?urlId=${ctx.query.urlId}&author=true&type=blogPosts`
			);
			if (!res.ok) return { notFound: true };

			const data: { post: Post<true> } = await res.json();
			const post = data.post;
			return { props: { post } };
		}
	);
