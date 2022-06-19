import { CardChairOccupant } from "components/card/ChairOccupant";
import { Main } from "components/layout/Main";
import type { Patron } from "entities/Patron";
import { gSSPHandler } from "helpers/gSSPHandler";
import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import React from "react";

interface Props {
	patrons: Patron[];
}

const Patrons: NextPage<Props> = ({ patrons }) => {
	return (
		<>
			<NextSeo title="Patronos" />

			<Main title="Patronos" className="flex flex-col justify-center items-center p-6 pb-10">
				<div className="flex justify-center items-center flex-wrap max-w-5xl">
					{patrons?.length ? (
						patrons.map(patron => (
							<CardChairOccupant
								key={patron.id}
								number={patron.metadata.chair}
								name={patron.name}
								href={`/cadeiras/patronos/${patron.metadata.urlId}`}
							/>
						))
					) : (
						<span className="text-xl">Não há patronos registrados.</span>
					)}
				</div>
			</Main>
		</>
	);
};

export default Patrons;

export const getServerSideProps: GetServerSideProps<Props> = ctx =>
	gSSPHandler<Props>(ctx, { col: "patrons", autoTry: true }, async col => {
		const patrons: Patron[] = [];

		const query = await col.get();
		if (!query.empty && query.docs.length) {
			for (const doc of query.docs) patrons.push(doc.data() as Patron);
		}

		return { props: { patrons } };
	});
