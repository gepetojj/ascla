import { AcademicView } from "components/view/Academic";
import type { Academic as EAcademic } from "entities/Academic";
import { firestore } from "myFirebase/server";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import Head from "next/head";
import React from "react";

interface Props {
	academic: EAcademic;
}

const Academic: NextPage<Props> = ({ academic }) => {
	return (
		<>
			<NextSeo title={`Acadêmicos - ${academic.name || "Não encontrado"}`} />
			<Head>
				<title>ASCLA - Acadêmicos - {academic.name}</title>
			</Head>

			<main>
				<AcademicView {...academic} />
			</main>
		</>
	);
};

export default Academic;

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
	const col = firestore.collection("academics");
	const urlId = params?.urlId;

	if (!urlId || typeof urlId !== "string") return { notFound: true };

	try {
		const query = await col.where("metadata.urlId", "==", urlId).get();
		const academic = query.docs[0];
		if (query.empty || !academic) return { notFound: true };

		return { props: { academic: academic.data() as EAcademic } };
	} catch (err) {
		console.error(err);
		return { notFound: true };
	}
};

export const getStaticPaths: GetStaticPaths = async () => {
	const col = firestore.collection("academics");
	const paths: { params: { urlId: string } }[] = [];

	try {
		const { empty, docs } = await col.get();
		if (!empty && docs.length) {
			docs.forEach(doc => {
				const { metadata } = doc.data() as EAcademic;
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
