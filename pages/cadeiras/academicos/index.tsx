import { CardChairOccupant } from "components/card/ChairOccupant";
import { Main } from "components/layout/Main";
import type { Academic } from "entities/Academic";
import { gSSPHandler } from "helpers/gSSPHandler";
import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import React from "react";

interface Props {
	academics: Academic[];
}

const Patrons: NextPage<Props> = ({ academics }) => {
	return (
		<>
			<NextSeo title="Acadêmicos" />

			<Main
				title="Acadêmicos"
				className="flex flex-col justify-center items-center p-6 pb-10"
			>
				<div className="flex justify-center items-center flex-wrap max-w-5xl">
					{academics?.length ? (
						academics.map((academic, index) => (
							<CardChairOccupant
								key={academic.id}
								number={index + 1 > 9 ? String(index + 1) : `0${index + 1}`}
								name={academic.name}
								href={`/cadeiras/academicos/${academic.metadata.urlId}`}
							/>
						))
					) : (
						<span className="text-xl">Não há acadêmicos registrados.</span>
					)}
				</div>
			</Main>
		</>
	);
};

export default Patrons;

export const getServerSideProps: GetServerSideProps<Props> = ctx =>
	gSSPHandler<Props>(ctx, { col: "academics", autoTry: true }, async col => {
		const academics: Academic[] = [];

		const query = await col.get();
		if (!query.empty && query.docs.length) {
			for (const doc of query.docs) academics.push(doc.data() as Academic);
		}

		return { props: { academics } };
	});
