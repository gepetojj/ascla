import { Main } from "components/layout/Main";
import { ChairOccupantView } from "components/view/ChairOccupant";
import type { Academic as EAcademic } from "entities/Academic";
import type { Patron } from "entities/Patron";
import { useJSON } from "hooks/useJSON";
import { Collections } from "myFirebase/enums";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

interface Props {
	academic: EAcademic;
}

const Academic: NextPage<Props> = ({ academic }) => {
	const { data, error } = useSWR(
		`/api/patrons/read?id=${academic.metadata.patronId}`,
		(...args) => fetch(...args).then(res => res.json())
	);
	const [patron, setPatron] = useState<Patron>();
	const bioHTML = useJSON(academic.bio);

	useEffect(() => {
		data && !error && setPatron(data.patron);
		!data && error && console.error(error);
	}, [data, error]);

	return (
		<>
			<NextSeo title={`Acadêmicos - ${academic.name || "Não encontrado"}`} />

			<Main title={academic.name} className="p-6 pb-12">
				<ChairOccupantView
					{...academic}
					chair={academic.metadata.chair}
					bioHTML={bioHTML}
					oppositeType="patron"
					oppositeName={patron?.name}
					oppositeUrlId={patron?.metadata.urlId}
				/>
			</Main>
		</>
	);
};

export default Academic;

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
	const col = Collections.academics;
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
	const col = Collections.academics;
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
