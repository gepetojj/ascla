import { Dropzone, FileItem, FullScreenPreview, FileValidated } from "@dropzone-ui/react";

import { Main } from "components/layout/Main";
import { HighlightView } from "components/view/Highlight";
import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import React, { useCallback, useState } from "react";

const AdminHighlight: NextPage = () => {
	const [files, setFiles] = useState<FileValidated[]>([]);

	const onUpdateFiles = useCallback((incomming: FileValidated[]) => {
		setFiles(incomming);
	}, []);

	return (
		<>
			<NextSeo title="Administração - Destaque" noindex nofollow />

			<Main title="Destaque">
				<h3 className="text-center text-sm italic">
					Destaque é o banner apresentado na página inicial, uma imagem de dimensões
					1050x240 px.
				</h3>
				<div className="flex flex-col mt-4 gap-2">
					<h2 className="text-center text-xl font-medium">Destaque atual:</h2>
					<HighlightView
						src={
							process.env.NODE_ENV === "development"
								? "http://localhost:3000/api/images/highlight"
								: "https://www.asclasi.com/api/images/highlight"
						}
					/>
				</div>
				<div className="flex flex-col mt-4 gap-2">
					<h2 className="text-center text-xl font-medium">Altere o destaque:</h2>
					<Dropzone
						value={files}
						onChange={onUpdateFiles}
						accept={"image/*"}
						maxFiles={1}
						maxFileSize={5 * 1024 * 1024}
						label="Solte um arquivo aqui ou clique para escolher"
						localization="PT-pt"
						method="POST"
						url="/api/images/upload?dest=hl"
						behaviour="replace"
						color="#83CB89"
						disableScroll
						footer={false}
					>
						{files.map(file => (
							<FileItem
								key={file.id}
								{...file}
								alwaysActive
								localization="PT-pt"
								preview
								hd
								elevation={2}
								resultOnTooltip
							/>
						))}
						<FullScreenPreview />
					</Dropzone>
				</div>
			</Main>
		</>
	);
};

export default AdminHighlight;
