import { CardChairOccupant } from "components/card/ChairOccupant";
import { Search } from "components/input/Search";
import { Main } from "components/layout/Main";
import { config } from "config";
import type { Patron } from "entities/Patron";
import { gSSPHandler } from "helpers/gSSPHandler";
import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React from "react";

interface Props {
	patrons: Patron[];
}

const Patrons: NextPage<Props> = ({ patrons }) => {
	const { query, pathname } = useRouter();

	return (
		<>
			<NextSeo
				title="Patronos"
				description={`Veja a lista de patronos da ${config.shortName}.`}
				canonical={`${config.basePath}${pathname}`}
			/>

			<Main title="Patronos" className="flex flex-col justify-center items-center p-6 pb-10">
				<Search
					data={patrons}
					options={{
						keys: ["name", "metadata.chair"],
					}}
					matchComponent={match => {
						const item = match.item as Patron;
						return (
							<CardChairOccupant
								key={item.id}
								name={item.name}
								number={item.metadata.chair}
								href={`/cadeiras/patronos/${item.metadata.urlId}`}
							/>
						);
					}}
					initialSearch={typeof query.search === "string" ? query.search : undefined}
					placeholder="Procure patronos:"
					disabled={patrons?.length <= 0}
				/>
				<ul className="flex justify-center items-center flex-wrap max-w-5xl">
					{patrons?.length ? (
						patrons
							.sort((a, b) => a.metadata.chair - b.metadata.chair)
							.map(patron => (
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
				</ul>
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
