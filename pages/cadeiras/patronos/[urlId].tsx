import { Main } from "components/layout/Main";
import { ChairOccupantView } from "components/view/ChairOccupant";
import type { Academic } from "entities/Academic";
import type { Patron as EPatron } from "entities/Patron";
import { useJSON } from "hooks/useJSON";
import { Collections } from "myFirebase/enums";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

interface Props {
	patron: EPatron;
}

const Patron: NextPage<Props> = ({ patron }) => {
	const { data, error } = useSWR(
		`/api/academics/read?id=${patron.metadata.academicId}`,
		(...args) => fetch(...args).then(res => res.json())
	);
	const [academic, setAcademic] = useState<Academic>();
	const bioHTML = useJSON(patron.bio);

	useEffect(() => {
		data && !error && setAcademic(data.academic);
		!data && error && console.error(error);
	}, [data, error]);

	return (
		<>
			<NextSeo
				title={`Patronos - ${patron.name || "Não encontrado"}`}
				description={`Conheça mais sobre o patrono ${patron.name} da ASCLA.`}
			/>

			<Main title={patron.name} className="p-6 pb-12">
				<ChairOccupantView
					{...patron}
					chair={patron.metadata.chair}
					bioHTML={bioHTML}
					oppositeType="academic"
					oppositeName={academic?.name}
					oppositeUrlId={academic?.metadata.urlId}
				/>
			</Main>
		</>
	);
};

export default Patron;

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
	const col = Collections.patrons;
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
	const col = Collections.patrons;
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
