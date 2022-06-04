import { CardChairOccupant } from "components/card/ChairOccupant";
import { Main } from "components/layout/Main";
import type { Academic } from "entities/Academic";
import { Collections } from "myFirebase/enums";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import React from "react";

interface Props {
	academics: Academic[];
}

const Patrons: NextPage<Props> = ({ academics }) => {
	return (
		<>
			<Head>
				<title>ASCLA - Acadêmicos</title>
			</Head>

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

export const getServerSideProps: GetServerSideProps<Props> = async () => {
	const col = Collections.academics;
	const academics: Academic[] = [];

	try {
		const query = await col.get();
		if (query.empty || !query.docs.length) return { props: { academics } };

		query.docs.forEach(doc => academics.push({ ...(doc.data() as Academic), bio: {} }));
		return { props: { academics } };
	} catch (err) {
		console.error(err);
		return { props: { academics } };
	}
};
