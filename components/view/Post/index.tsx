import type { BlogPost } from "entities/BlogPost";
import type { User } from "entities/User";
import { useJSON } from "hooks/useJSON";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { FC, memo, useEffect, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { MdShare, MdUpdate } from "react-icons/md";
import { Store } from "react-notifications-component";
import useSWR from "swr";

export interface PostViewProps extends Omit<BlogPost, "id"> {
	showUserInteractions?: boolean;
}

const PostViewComponent: FC<PostViewProps> = ({ metadata, content, title, description }) => {
	const { data, error } = useSWR(`/api/users/read?id=${metadata.authorId}`, (...args) =>
		fetch(...args).then(res => res.json())
	);
	const [author, setAuthor] = useState<User>();
	const contentHTML = useJSON(content);
	const { pathname } = useRouter();

	useEffect(() => {
		data && !error && setAuthor(data.user);
		!data && error && console.error(error);
	}, [data, error]);

	return (
		<section className="flex flex-col-reverse justify-center w-full h-full gap-10 md:flex-row">
			<article className="flex justify-center max-w-2xl w-full">
				<div
					className="prose max-w-full"
					dangerouslySetInnerHTML={{ __html: contentHTML }}
				></div>
			</article>
			<aside className="flex flex-row justify-center items-center gap-4 md:flex-col md:justify-start md:gap-0">
				<div>
					<Image
						src={author?.avatarUrl || "/usuario-padrao.webp"}
						alt="Avatar do usuário"
						width={74}
						height={74}
						className="rounded-full"
					/>
				</div>
				<div>
					<h3 className="text-lg text-center text-black-main font-medium break-words">
						{author?.name || "Nome do autor"}
					</h3>
					<div className="flex justify-center gap-2">
						<div className="flex items-center gap-1 text-xs">
							<AiOutlineClockCircle className="text-xl" />
							<span>{new Date(metadata.createdAt).toLocaleDateString()}</span>
						</div>
						{metadata.updatedAt > 0 && (
							<div className="flex items-center gap-1 text-xs">
								<MdUpdate className="text-xl" />
								<span>{new Date(metadata.updatedAt).toLocaleDateString()}</span>
							</div>
						)}
					</div>
					<div className="flex justify-center mt-4">
						<button
							className="flex justify-center items-center gap-2 p-1 bg-cream-main rounded-sm duration-200 hover:brightness-95"
							onClick={() => {
								try {
									navigator.share({
										title: `ASCLA - ${title}`,
										text: description,
										url: `https://asclasi.com/${pathname.split("/")[1]}/${
											metadata.urlId
										}`,
									});
								} catch {
									navigator.clipboard.writeText(
										`https://asclasi.com/${pathname.split("/")[1]}/${
											metadata.urlId
										}`
									);
									Store.addNotification({
										title: "Sucesso",
										message: "Link copiado para a área de transferência.",
										type: "success",
										container: "bottom-right",
										dismiss: {
											duration: 5000,
											onScreen: true,
										},
									});
								}
							}}
						>
							<MdShare className="text-xl" />
							<span>Compartilhar</span>
						</button>
					</div>
				</div>
			</aside>
		</section>
	);
};

export const PostView = memo(PostViewComponent);
