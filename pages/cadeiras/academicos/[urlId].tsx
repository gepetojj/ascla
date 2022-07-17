import { Main } from "components/layout/Main";
import { ChairOccupantView } from "components/view/ChairOccupant";
import { config } from "config";
import type { Academic } from "entities/Academic";
import type { Patron } from "entities/Patron";
import { gSSPHandler } from "helpers/gSSPHandler";
import { useJSON } from "hooks/useJSON";
import { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

interface Props {
	academic: Academic;
}

const ViewAcademic: NextPage<Props> = ({ academic }) => {
	const { data, error } = useSWR(
		`/api/patrons/read?id=${academic.metadata.patronId}`,
		(...args) => fetch(...args).then(res => res.json())
	);
	const [patron, setPatron] = useState<Patron>();
	const bioHTML = useJSON(academic.bio);

	useEffect(() => {
		data && !error && setPatron(data.patron);
	}, [data, error]);

	return (
		<>
			<NextSeo
				title={`Acadêmicos - ${academic.name || "Não encontrado"}`}
				description={`Conheça mais sobre o acadêmico ${academic.name} da ${config.shortName}.`}
				canonical={`${config.basePath}/cadeiras/academicos/${academic.metadata.urlId}`}
			/>

			<Main title={academic.name} className="p-6 pb-12">
				<ChairOccupantView
					{...academic}
					chair={academic.metadata.chair}
					bioHTML={bioHTML}
					urlId={academic.metadata.urlId}
					oppositeType="patron"
					oppositeName={patron?.name}
					oppositeUrlId={patron?.metadata.urlId}
				/>
			</Main>
		</>
	);
};

export default ViewAcademic;

export const getServerSideProps: GetServerSideProps<Props> = ctx =>
	gSSPHandler<Props>(
		ctx,
		{ col: "academics", ensure: { query: ["urlId"] }, autoTry: true },
		async col => {
			const query = await col
				.where("metadata.urlId", "==", (ctx.query.urlId as string) || "")
				.get();
			if (query.empty || !query.docs) return { notFound: true };

			const academic = query.docs[0].data() as Academic;
			return { props: { academic } };
		}
	);
