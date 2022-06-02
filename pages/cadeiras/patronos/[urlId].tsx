import { PatronView } from "components/view/Patron";
import type { Patron as EPatron } from "entities/Patron";
import { firestore } from "myFirebase/server";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import React from "react";

interface Props {
	patron: EPatron;
}

const Patron: NextPage<Props> = ({ patron }) => {
	return (
		<>
			<Head>
				<title>ASCLA - Patronos - {patron.name}</title>
			</Head>

			<main>
				<PatronView {...patron} />
			</main>
		</>
	);
};

export default Patron;

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
	const col = firestore.collection("patrons");
	const urlId = params?.urlId;

	if (!urlId || typeof urlId !== "string") return { notFound: true };

	try {
		const query = await col.where("metadata.urlId", "==", urlId).get();
		const patron = query.docs[0];
		if (query.empty || !patron) return { notFound: true };

		return { props: { patron: patron.data() as EPatron } };
	} catch (err) {
		console.error(err);
		return { notFound: true };
	}
};

export const getStaticPaths: GetStaticPaths = async () => {
	const col = firestore.collection("patrons");
	const paths: { params: { urlId: string } }[] = [];

	try {
		const { empty, docs } = await col.get();
		if (!empty && docs.length) {
			docs.forEach(doc => {
				const { metadata } = doc.data() as EPatron;
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
