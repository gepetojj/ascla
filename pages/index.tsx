import { Main } from "components/layout/Main";
import { HighlightView } from "components/view/Highlight";
import { config } from "config";
import { Post } from "entities/Post";
import { IKImage } from "imagekitio-react";
import type { NextPage } from "next";
import Link from "next/link";
import React from "react";
import { GoQuote } from "react-icons/go";
import useSWR from "swr";

const Home: NextPage = () => {
	const latestNews = useSWR<{ posts: Post<true>[] }>(
		"/api/posts/list?latest=true&author=true&type=news",
		(...args: [string]) => fetch(...args).then(res => res.json())
	);
	const latestBlogPost = useSWR<{ posts: Post<true>[] }>(
		"/api/posts/list?latest=true&author=true&type=blogPosts",
		(...args: [string]) => fetch(...args).then(res => res.json())
	);

	return (
		<Main title={config.fullName}>
			<HighlightView />
			<div
				className={`flex flex-col justify-center items-center px-6 py-20 gap-16 lg:flex-row ${
					latestNews.data && latestBlogPost.data ? "pt-16" : ""
				}`}
			>
				<div className="flex flex-col gap-6">
					{latestNews.data?.posts &&
						latestNews.data.posts.length > 0 &&
						!latestNews.error && (
							<div>
								<h3 className="text-xl font-medium">Última notícia:</h3>
								<div className="flex flex-col items-center gap-4 mt-5 max-w-lg sm:flex-row sm:items-start sm:mt-3">
									<IKImage
										urlEndpoint={process.env.NEXT_PUBLIC_IK_URL}
										path={
											latestNews.data.posts[0].thumbnailUrl ||
											"https://dummyimage.com/150x75/000/fff.png&text=Imagem"
										}
										transformation={[{ width: 150, height: 75 }]}
										lqip={{ active: true }}
										loading="lazy"
										width={150}
										height={75}
										alt="Imagem da notícia"
										className="rounded"
									/>
									<p>
										<Link
											href={`/noticias/${latestNews.data.posts[0].metadata.urlId}`}
										>
											<a className="font-bold hover:underline">
												{latestNews.data.posts[0].title}
											</a>
										</Link>
										,{" "}
										<span className="text-xs">
											por {latestNews.data.posts[0].metadata.author?.name}.
										</span>
									</p>
								</div>
							</div>
						)}
					{latestBlogPost.data?.posts &&
						latestBlogPost.data.posts.length > 0 &&
						!latestBlogPost.error && (
							<div>
								<h3 className="text-xl font-medium">Última postagem do blog:</h3>
								<div className="flex flex-col items-center gap-4 mt-5 max-w-lg sm:flex-row sm:items-start sm:mt-3">
									<IKImage
										urlEndpoint={process.env.NEXT_PUBLIC_IK_URL}
										path={
											latestBlogPost.data.posts[0].thumbnailUrl ||
											"https://dummyimage.com/150x75/000/fff.png&text=Imagem"
										}
										transformation={[{ width: 150, height: 75 }]}
										lqip={{ active: true }}
										loading="lazy"
										width={150}
										height={75}
										alt="Imagem do post"
										className="rounded"
									/>
									<p>
										<Link
											href={`/blog/${latestBlogPost.data.posts[0].metadata.urlId}`}
										>
											<a className="font-bold hover:underline">
												{latestBlogPost.data.posts[0].title}
											</a>
										</Link>
										,{" "}
										<span className="text-xs">
											por {latestBlogPost.data.posts[0].metadata.author?.name}
											.
										</span>
									</p>
								</div>
							</div>
						)}
				</div>
				<blockquote className="px-8 pt-6">
					<div className="flex">
						<div className="w-fit pr-3">
							<GoQuote className="text-2xl" />
						</div>
						<p className="max-w-md">
							Um povo sem memória é um povo sem história. Um povo sem história está
							fadado a cometer, no presente e no futuro, os mesmos erros do passado.
						</p>
					</div>
					<p className="text-right font-bold pt-2">
						Emilia Viotti da Costa, historiadora.
					</p>
				</blockquote>
			</div>
		</Main>
	);
};

export default Home;
