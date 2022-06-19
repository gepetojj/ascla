import { Main } from "components/layout/Main";
import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import React from "react";

const Members: NextPage = () => {
	return (
		<>
			<NextSeo title="Sócios" description="Veja a lista de sócios da ASCLA." />

			<Main title="Sócios" className="p-6 pb-10">
				<div className="flex justify-center">
					<div className="grid grid-cols-1 grid-rows-2 items-start gap-6 sm:grid-cols-2">
						<div>
							<h3 className="text-xl font-medium mb-2">Beneméritos</h3>
							<p>Maria Verônica de Araújo</p>
							<p>Renilde Silva Bulhões Barros</p>
						</div>
						<div>
							<h3 className="text-xl font-medium mb-2">Honorários</h3>
							<p>Pe. José Neto de França</p>
							<p>Remi Bastos Silva</p>
							<p>Virgílio Wanderley Nepomuceno Agra</p>
						</div>
						<div>
							<h3 className="text-xl font-medium mb-2">Correspondentes</h3>
							<p>Maria Goretti Brandão Porfírio Santos</p>
							<p>Carlindo de Lira Pereira</p>
						</div>
						<div>
							<h3 className="text-xl font-medium italic mb-2">In Memoriam</h3>
							<p>Claudio Antônio Jucá Santos</p>
							<p>José Marques de Melo</p>
							<p>José Peixoto Noya</p>
							<p>Isnaldo Bulhões Barros</p>
						</div>
					</div>
				</div>
			</Main>
		</>
	);
};

export default Members;
