import { Main } from "components/layout/Main";
import { PostView } from "components/view/Post";
import type { BlogPost as EBlogPost } from "entities/BlogPost";
import { Collections } from "myFirebase/enums";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ArticleJsonLd, NextSeo } from "next-seo";
import React from "react";

interface Props {
	post: EBlogPost;
}

const BlogPost: NextPage<Props> = ({ post }) => {
	return (
		<>
			<NextSeo
				title={`Blog - ${post.title || "Não encontrado"}`}
				description={post.description}
				openGraph={{
					title: post.title,
					description: post.description,
					url: `https://www.asclasi.com/blog/${post.metadata.urlId}`,
					article: {
						publishedTime: new Date(post.metadata.createdAt).toISOString(),
						modifiedTime: new Date(post.metadata.updatedAt).toDateString(),
						section: "blog",
					},
				}}
			/>
			<ArticleJsonLd
				type="Blog"
				url={`https://www.asclasi.com/blog/${post.metadata.urlId}`}
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

export default BlogPost;

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
	const col = Collections.blogPosts;
	const urlId = params?.urlId;

	if (!urlId || typeof urlId !== "string") return { notFound: true };

	try {
		const query = await col.where("metadata.urlId", "==", urlId).get();
		const post = query.docs[0];
		if (query.empty || !post.exists) return { notFound: true };

		return { props: { post: post.data() as EBlogPost } };
	} catch (err) {
		console.error(err);
		return { notFound: true };
	}
};

export const getStaticPaths: GetStaticPaths = async () => {
	const col = Collections.blogPosts;
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
