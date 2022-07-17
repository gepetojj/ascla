import { CardChairOccupant } from "components/card/ChairOccupant";
import { Search } from "components/input/Search";
import { Main } from "components/layout/Main";
import { config } from "config";
import type { Academic } from "entities/Academic";
import { gSSPHandler } from "helpers/gSSPHandler";
import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React from "react";

interface Props {
	academics: Academic[];
}

const Patrons: NextPage<Props> = ({ academics }) => {
	const { query } = useRouter();

	return (
		<>
			<NextSeo
				title="Acadêmicos"
				description={`Veja a lista de acadêmicos da ${config.shortName}.`}
			/>

			<Main
				title="Acadêmicos"
				className="flex flex-col justify-center items-center p-6 pb-10"
			>
				<Search
					data={academics}
					options={{
						keys: ["name", "metadata.chair"],
					}}
					matchComponent={match => {
						const item = match.item as Academic;
						return (
							<CardChairOccupant
								key={item.id}
								name={item.name}
								number={item.metadata.chair}
								href={`/cadeiras/academicos/${item.metadata.urlId}`}
							/>
						);
					}}
					initialSearch={typeof query.search === "string" ? query.search : undefined}
					placeholder="Procure acadêmicos:"
				/>
				<ul className="flex justify-center items-center flex-wrap max-w-5xl">
					{academics?.length ? (
						academics
							.sort((a, b) => a.metadata.chair - b.metadata.chair)
							.map(academic => (
								<CardChairOccupant
									key={academic.id}
									name={academic.name}
									number={academic.metadata.chair}
									href={`/cadeiras/academicos/${academic.metadata.urlId}`}
								/>
							))
					) : (
						<span className="text-xl">Não há acadêmicos registrados.</span>
					)}
				</ul>
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
