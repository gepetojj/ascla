import { CardChairOccupant } from "components/card/ChairOccupant";
import { Main } from "components/layout/Main";
import type { Patron } from "entities/Patron";
import { Collections } from "myFirebase/enums";
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
						patrons.map((patron, index) => (
							<CardChairOccupant
								key={patron.id}
								number={index + 1 > 9 ? String(index + 1) : `0${index + 1}`}
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

export const getServerSideProps: GetServerSideProps<Props> = async () => {
	const col = Collections.patrons;
	const patrons: Patron[] = [];

	try {
		const query = await col.get();
		if (query.empty || !query.docs.length) return { props: { patrons } };

		query.docs.forEach(doc => patrons.push({ ...(doc.data() as Patron), bio: {} }));
		return { props: { patrons } };
	} catch (err) {
		console.error(err);
		return { props: { patrons } };
	}
};
