import { Button } from "components/input/Button";
import { Main } from "components/layout/Main";
import { config } from "config";
import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import type { PDFDocumentProxy } from "pdfjs-dist/types/src/pdf";
import React, { useCallback, useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";
import { Store } from "react-notifications-component";
import { Document, Page, pdfjs } from "react-pdf";

const AboutStatute: NextPage = () => {
	const { reload, pathname } = useRouter();
	const [pages, setPages] = useState<number | null>(null);
	const [page, setPage] = useState(1);

	useEffect(() => {
		pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;
	}, []);

	const onDocumentLoad = useCallback((pdf: PDFDocumentProxy) => {
		setPages(pdf.numPages);
	}, []);

	const onDocumentLoadError = useCallback((err: Error) => {
		let message = "Não foi possível carregar o arquivo PDF.";
		if (err.name === "MissingPDFException") message = "O arquivo PDF não foi encontrado.";

		Store.addNotification({
			title: "Erro",
			message,
			type: "danger",
			container: "bottom-right",
			dismiss: {
				duration: 10000,
				onScreen: true,
			},
		});
	}, []);

	const onNextPage = useCallback(() => {
		pages && page < pages && setPage(page => page + 1);
	}, [page, pages]);

	const onPreviousPage = useCallback(() => {
		pages && page > 1 && setPage(page => page - 1);
	}, [page, pages]);

	return (
		<>
			<NextSeo
				title="Sobre - Estatuto"
				description={`Conheça o estatuto da ${config.fullName}.`}
				canonical={`${config.basePath}${pathname}`}
			/>

			<Main
				title={`Estatuto da ${config.shortName}`}
				className="flex flex-col justify-center items-center p-6 pb-10"
			>
				<div className="flex justify-center items-center">
					<Document
						className="flex justify-center items-center flex-col w-full h-full bg-cream-100 rounded"
						file="/assets/estatuto-ascla.pdf"
						renderMode="svg"
						onLoadSuccess={onDocumentLoad}
						onLoadError={onDocumentLoadError}
						error={() => {
							return (
								<div className="flex flex-col justify-center items-center w-full h-full gap-4 p-4">
									<span className="text-lg font-medium">
										Não foi possível carregar o PDF.
									</span>
									<Button className="bg-primary-main" onClick={() => reload()}>
										Recarregar página
									</Button>
								</div>
							);
						}}
						loading={() => {
							return (
								<div className="flex justify-center items-center w-full h-full gap-4 p-4">
									<span className="text-lg font-medium">
										O arquivo está carregando.
									</span>
									<CgSpinner className="text-xl text-current animate-spin" />
								</div>
							);
						}}
						noData={() => {
							return (
								<div className="flex flex-col justify-center items-center w-full h-full gap-4 p-4">
									<span className="text-lg font-medium">
										Nenhum arquivo PDF foi selecionado.
									</span>
								</div>
							);
						}}
					>
						<Page
							className="flex flex-col justify-center items-center"
							pageNumber={page}
							onLoadError={onDocumentLoadError}
							renderAnnotationLayer={false}
							loading={() => {
								return (
									<div className="flex justify-center items-center w-full h-full gap-4 p-4">
										<span className="text-lg font-medium">
											Carregando a página, aguarde.
										</span>
										<CgSpinner className="text-xl text-current animate-spin" />
									</div>
								);
							}}
							noData={() => {
								return (
									<div className="flex flex-col justify-center items-center w-full h-full gap-4 p-4">
										<span className="text-lg font-medium">
											Nenhuma página foi selecionado.
										</span>
									</div>
								);
							}}
						/>
						<div className="flex justify-center items-center relative bottom-10">
							<div className="flex items-center w-fit gap-2 px-1 bg-black-100/30 backdrop-blur-sm rounded">
								<button
									className="text-black-main disabled:text-black-300/70 disabled:cursor-not-allowed"
									onClick={onPreviousPage}
									disabled={pages ? page <= 1 : true}
								>
									<MdArrowLeft className="text-3xl" />
								</button>
								<span>
									{page} de {pages || "?"}
								</span>
								<button
									className="text-black-main disabled:text-black-300 disabled:cursor-not-allowed"
									onClick={onNextPage}
									disabled={pages ? page >= pages : true}
								>
									<MdArrowRight className="text-3xl" />
								</button>
							</div>
						</div>
					</Document>
				</div>
			</Main>
		</>
	);
};

export default AboutStatute;

// Solução temporária para erro em deploy de páginas estáticas na netlify
export const getServerSideProps: GetServerSideProps = async () => {
	return { props: {} };
};
