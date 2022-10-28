import { CardChairOccupant } from "components/card/ChairOccupant";
import { Search } from "components/input/Search";
import { Main } from "components/layout/Main";
import { config } from "config";
import type { OptimizedPatron, Patron } from "entities/Patron";
import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import useSWR from "swr";

const Patrons: NextPage = () => {
	const { query, pathname } = useRouter();
	const { data, error } = useSWR("/api/patrons/list?optimized=true", (...args: [string]) =>
		fetch(...args).then(res => res.json())
	);

	const patrons = useMemo(() => {
		if (data && !error) return data.patrons as OptimizedPatron[];
		return [];
	}, [data, error]);

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
				<ul className="flex justify-center items-center flex-wrap max-w-5xl gap-4">
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

// Solução temporária para erro em deploy de páginas estáticas na netlify
export const getServerSideProps: GetServerSideProps = async () => {
	return { props: {} };
};

