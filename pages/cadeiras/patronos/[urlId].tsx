import { Main } from "components/layout/Main";
import { ChairOccupantView } from "components/view/ChairOccupant";
import type { Academic } from "entities/Academic";
import type { Patron } from "entities/Patron";
import { gSSPHandler } from "helpers/gSSPHandler";
import { useJSON } from "hooks/useJSON";
import { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

interface Props {
	patron: Patron;
}

const ViewPatron: NextPage<Props> = ({ patron }) => {
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
					avatarUrl={patron.avatar}
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
