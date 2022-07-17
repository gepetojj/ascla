import { Main } from "components/layout/Main";
import { PostView } from "components/view/Post";
import { config } from "config";
import type { BlogPost } from "entities/BlogPost";
import { gSSPHandler } from "helpers/gSSPHandler";
import { GetServerSideProps, NextPage } from "next";
import { ArticleJsonLd, NextSeo } from "next-seo";
import React from "react";

interface Props {
	post: BlogPost;
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
				authorName={post.metadata.authorId}
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
		async col => {
			const query = await col
				.where("metadata.urlId", "==", (ctx.query.urlId as string) || "")
				.get();
			if (query.empty || !query.docs) return { notFound: true };

			const post = query.docs[0].data() as BlogPost;
			return { props: { post } };
		}
	);
