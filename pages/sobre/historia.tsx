import { Main } from "components/layout/Main";
import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import React from "react";

const AboutHistory: NextPage = () => {
	return (
		<>
			<NextSeo
				title="Sobre - História"
				description="Conheça a história da Academia Santanense de Ciências, Letras e Artes."
			/>

			<Main
				title="História da ASCLA"
				className="flex flex-col justify-center items-center p-6 pb-10"
			>
				<div className="prose max-w-5xl text-justify">
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
						tempor incididunt ut labore et dolore magna aliqua. Morbi tristique senectus
						et netus et malesuada fames ac. Ut sem nulla pharetra diam sit. Congue
						quisque egestas diam in. Purus viverra accumsan in nisl nisi scelerisque eu.
						A arcu cursus vitae congue mauris rhoncus aenean vel. Vel turpis nunc eget
						lorem dolor sed viverra. Vestibulum lorem sed risus ultricies tristique
						nulla. Convallis tellus id interdum velit laoreet id donec ultrices
						tincidunt. Tempor orci eu lobortis elementum nibh tellus molestie nunc non.
						Velit laoreet id donec ultrices tincidunt arcu non. Ac tortor vitae purus
						faucibus ornare suspendisse sed. Lacinia quis vel eros donec ac odio tempor
						orci. Aliquam malesuada bibendum arcu vitae elementum. Blandit libero
						volutpat sed cras ornare arcu dui. Cursus risus at ultrices mi tempus
						imperdiet nulla malesuada pellentesque. Proin sagittis nisl rhoncus mattis
						rhoncus. Mus mauris vitae ultricies leo integer malesuada nunc vel risus.
						Proin sagittis nisl rhoncus mattis rhoncus urna. Arcu non sodales neque
						sodales ut etiam sit. Tempus urna et pharetra pharetra massa massa ultricies
						mi. Ipsum suspendisse ultrices gravida dictum fusce. In iaculis nunc sed
						augue lacus viverra. Vitae turpis massa sed elementum tempus egestas sed.
						Duis ut diam quam nulla porttitor massa id neque aliquam. Tempor orci eu
						lobortis elementum. Aenean pharetra magna ac placerat vestibulum lectus
						mauris ultrices eros. Tortor posuere ac ut consequat semper.
					</p>
					<h2 className="text-center">Molestie Nunc</h2>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
						tempor incididunt ut labore et dolore magna aliqua. Fermentum posuere urna
						nec tincidunt praesent semper. Leo vel fringilla est ullamcorper eget nulla
						facilisi. Risus pretium quam vulputate dignissim suspendisse. Blandit libero
						volutpat sed cras ornare. Vulputate ut pharetra sit amet aliquam id diam
						maecenas ultricies. Vitae proin sagittis nisl rhoncus. Est ullamcorper eget
						nulla facilisi etiam dignissim diam quis enim. Sit amet est placerat in
						egestas erat imperdiet. Ultrices in iaculis nunc sed augue lacus viverra
						vitae. Rutrum quisque non tellus orci ac auctor augue mauris.
					</p>
				</div>
			</Main>
		</>
	);
};

export default AboutHistory;
