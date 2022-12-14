import { CardChairOccupant } from "components/card/ChairOccupant";
import { Search } from "components/input/Search";
import { Main } from "components/layout/Main";
import { config } from "config";
import { AcademicTypes, OptimizedAcademic } from "entities/Academic";
import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import useSWR from "swr";

const Patrons: NextPage = () => {
	const { query, pathname } = useRouter();
	const { data, error } = useSWR("/api/academics/list?optimized=true", (...args) =>
		fetch(...args).then(res => res.json())
	);

	const academics = useMemo(() => {
		if (data && !error) return data.academics as OptimizedAcademic[];
		return [];
	}, [data, error]);

	return (
		<>
			<NextSeo
				title="Acadêmicos"
				description={`Veja a lista de acadêmicos da ${config.shortName}.`}
				canonical={`${config.basePath}${pathname}`}
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
						const item = match.item as OptimizedAcademic;
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
					disabled={academics?.length <= 0}
				/>
				<div className="flex flex-col gap-6 max-w-[49rem] w-full">
					{academics?.length ? (
						AcademicTypes.map(({ id, name }) => (
							<div key={id} className="flex flex-col gap-2 max-w-5xl w-full">
								<h2 className="font-medium">
									{name === "In Memoriam" ? (
										<span className="italic">{name}</span>
									) : (
										name + "s"
									)}
								</h2>
								<ul className="flex justify-center items-center flex-wrap w-full gap-4">
									{academics
										.filter(academic => academic.metadata.type === id)
										.sort((a, b) => a.metadata.chair - b.metadata.chair)
										.length > 0 ? (
										academics
											.filter(academic => academic.metadata.type === id)
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
										<p className="text-center">
											Não há acadêmicos desta categoria ainda.
										</p>
									)}
								</ul>
							</div>
						))
					) : (
						<p className="text-xl text-center">Não há acadêmicos registrados.</p>
					)}
				</div>
			</Main>
		</>
	);
};

export default Patrons;

// Solução temporária para erro em deploy de páginas estáticas na netlify
export const getServerSideProps: GetServerSideProps = async () => {
	return { props: {} };
};
