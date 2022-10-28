import { Main } from "components/layout/Main";
import { config } from "config";
import { IKImage } from "imagekitio-react";
import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React from "react";

const AboutHistory: NextPage = () => {
	const { pathname } = useRouter();

	return (
		<>
			<NextSeo
				title="Sobre - História"
				description={`Conheça a história da ${config.fullName}.`}
				canonical={`${config.basePath}${pathname}`}
			/>

			<Main
				title={`História da ${config.shortName}`}
				className="flex flex-col justify-center items-center p-6 pb-10"
			>
				<div className="prose max-w-5xl text-justify">
					<p>
						O Portal Maltanet, do jornalista José Malta Fontes Neto, teve um papel
						fundamental na expansão das produções literárias no sertão na década de
						1990. Muito mais que isso! Empresa digital voltada à produção de conteúdo
						informativo e comercial, inovou ao abrir espaço de interação entre os
						santanenses, encurtando distância e promovendo ideias e congraçamento entre
						conterrâneos espalhados pelo Brasil afora. Não tardou para que o grupo
						pedisse a abertura de espaço para divulgação e promoção da cultura e, em
						especial, a produção literária local.
					</p>
					<p>
						Deu tão certo que não tardou em noticiar ao mundo digital que brotava uma
						fonte de ideias que não parou de jorrar até os dias atuais, inspirada e
						guiada nos exemplos de Tadeu Rocha, Breno Accioly, José Marques Melo, Oscar
						Silva, Raul Pereira Monteiro, Clerisvaldo Braga das Chagas e Djalma
						Carvalho, despontando uma geração de novos escritores que resultou na
						publicação da série de livros coletivos: À Sombra do Umbuzeiro(2006), À
						Sombra do Juazeiro (2008) e À Sombra da Quixabeira(2010). Uma das
						escritoras, Maria do Socorro Farias Ricardo, nomeou a terra natal como a
						“Terra dos Escritores”.
					</p>
					<p>
						Os participantes do movimento literário se uniram para fortalecer o
						movimento de incentivo à leitura entre os jovens estudantes da rede
						municipal de ensino e reeditar obras relevantes, como por exemplo, “Escorço
						Biográfico do Missionário Apostólico Dr. Francisco José Correia de
						Albuquerque”, do Padre Theotônio Ribeiro, 2012, lançado pela primeira
						editora do sertão alagoano SWA Instituto Educacional Ltda, que também surgiu
						com a motivação e o impulso das demandas dos sertanejos sedentos em
						concretizar os sonhos literários em livros.
					</p>
					<p>
						Por ocasião da realização da I FELISI - Feira Literária de Santana do
						Ipanema, realizada na secretaria de educação municipal, no período de 29 de
						Maio a 01 de junho de 2012, aconteceu o marco histórico de homenagem aos
						escritores santanenses e a fundação da ASLCA - Academia Santanense de
						Letras, Ciências e Artes.
					</p>
					<p>
						Na FELISI aconteceu exposição de fotografias, telas e árvores literárias,
						contação de histórias, homenagens das escolas municipais a escritores,
						pinturas e tatuagens infantis, fantoches, oficina de pinturas, participação
						dos cordelistas, cantoria de repentistas, sussurradores de poesia, shows
						artísticos; oficinas informática, oficina de cordel, mostra de cinema, roda
						de conversa, cordel para gente miúda, reciclagem, oficina de poesia, oficina
						de produção literária, origami, matemática em cordel, mesas redondas,
						palestras e shows artísticos.
					</p>
					<p>
						Presente no evento Dr. Jucá Santos, jornalista, advogado, presidente da
						Academia Maceioense de Letras - AML por várias décadas, ocupante da cadeira
						nº 32 da Academia Alagoana de Letras - AAL. Conhecido no meio literário como
						o Príncipe dos Poetas de Maceió, maçom integrante da Loja Maçônica Virtude e
						Bondade do Grande Oriente do Brasil de Maceió entusiasta das letras e
						apoiador das Academias Literárias na Terra dos Marechais, presente na
						reunião que homenageou os escritores santanenses na I FELISI conclamou a
						então prefeita Renilde Bulhões para fundar a Academia de Letras e conseguiu,
						naquele momento estava fundada a Academia Santanense de Letras, Ciências e
						Artes.
					</p>
					<div className="flex justify-center items-center">
						<figure>
							<IKImage
								urlEndpoint={process.env.NEXT_PUBLIC_IK_URL}
								path="/fundacao-ascla.webp"
								transformation={[{ width: 450, height: 250 }]}
								lqip={{ active: true }}
								loading="lazy"
								width={450}
								height={250}
								alt="Imagem do evento da fundação (29/05/2012)"
							/>
							<figcaption className="text-center">
								Evento da fundação (29/05/2012)
							</figcaption>
						</figure>
					</div>
					<div className="flex">
						<strong className="w-full text-right">
							José Malta Fontes Neto, presidente da ASLCA, 29.05.2012
						</strong>
					</div>
				</div>
			</Main>
		</>
	);
};

export default AboutHistory;

// Solução temporária para erro em deploy de páginas estáticas na netlify
export const getServerSideProps: GetServerSideProps = async () => {
	return { props: {} };
};
