import { Main } from "components/layout/Main";
import { HighlightView } from "components/view/Highlight";
import { IKContext, IKUpload } from "imagekitio-react";
import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import React, { useCallback } from "react";
import { Store } from "react-notifications-component";

const AdminHighlight: NextPage = () => {
	const onError = useCallback(() => {
		Store.addNotification({
			title: "Erro",
			message: "A imagem não pôde ser enviada. Tente novamente.",
			type: "danger",
			container: "bottom-right",
			dismiss: {
				duration: 5000,
				onScreen: true,
			},
		});
	}, []);

	const onSuccess = useCallback(() => {
		Store.addNotification({
			title: "Sucesso",
			message: "Imagem enviada com sucesso.",
			type: "success",
			container: "bottom-right",
			dismiss: {
				duration: 5000,
				onScreen: true,
			},
		});
	}, []);

	return (
		<>
			<NextSeo title="Administração - Destaque" noindex nofollow />

			<Main title="Destaque">
				<h3 className="text-center text-sm italic">
					Destaque é o banner apresentado na página inicial, uma imagem de dimensões
					1050x240px. Pode demorar até 2 minutos para atualizar após uma alteração.
				</h3>
				<div className="flex flex-col mt-4 gap-2">
					<h2 className="text-center text-xl font-medium">Destaque atual:</h2>
					<HighlightView />
				</div>
				<div className="flex flex-col mt-4 gap-4">
					<h2 className="text-center text-xl font-medium">Altere o destaque:</h2>
					<div className="flex justify-center items-center w-full">
						<IKContext
							urlEndpoint={process.env.NEXT_PUBLIC_IK_URL}
							publicKey={process.env.NEXT_PUBLIC_IK_KEY}
							authenticationEndpoint={`/api/images/auth`}
						>
							<IKUpload
								fileName="highlight"
								useUniqueFileName={false}
								onError={onError}
								onSuccess={onSuccess}
							/>
						</IKContext>
					</div>
				</div>
			</Main>
		</>
	);
};

export default AdminHighlight;
