import { Main } from "components/layout/Main";
import { ChairOccupantView } from "components/view/ChairOccupant";
import { config } from "config";
import type { Academic } from "entities/Academic";
import type { Patron } from "entities/Patron";
import { gSSPHandler } from "helpers/gSSPHandler";
import { useJSON } from "hooks/useJSON";
import { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import React, { useMemo } from "react";
import useSWR from "swr";

interface Props {
	patron: Patron;
}

const ViewPatron: NextPage<Props> = ({ patron }) => {
	const { data, error } = useSWR(
		`/api/academics/read?id=${patron.metadata.academicId}`,
		(...args) => fetch(...args).then(res => res.json())
	);
	const bioHTML = useJSON(patron.bio);

	const academic = useMemo(() => {
		if (data && !error) return data.academic as Academic;
		return undefined;
	}, [data, error]);

	return (
		<>
			<NextSeo
				title={`Patronos - ${patron.name || "Não encontrado"}`}
				description={`Conheça mais sobre o patrono ${patron.name} da ${config.shortName}.`}
				canonical={`${config.basePath}/cadeiras/patronos/${patron.metadata.urlId}`}
			/>

			<Main title={patron.name} className="p-6 pb-12">
				<ChairOccupantView
					{...patron}
					chair={patron.metadata.chair}
					bioHTML={bioHTML}
					urlId={patron.metadata.urlId}
					oppositeType="academic"
					oppositeName={academic?.name}
					oppositeUrlId={academic?.metadata.urlId}
				/>
			</Main>
		</>
	);
};

export default ViewPatron;

export const getServerSideProps: GetServerSideProps<Props> = ctx =>
	gSSPHandler<Props>(
		ctx,
		{ col: "patrons", ensure: { query: ["urlId"] }, autoTry: true },
		async col => {
			const query = await col
				.where("metadata.urlId", "==", (ctx.query.urlId as string) || "")
				.get();
			if (query.empty || !query.docs) return { notFound: true };

			const patron = query.docs[0].data() as Patron;
			return { props: { patron } };
		}
	);
