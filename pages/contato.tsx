import { Main } from "components/layout/Main";
import { config } from "config";
import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import React from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { CgInstagram } from "react-icons/cg";
import { MdMap, MdCall, MdEmail } from "react-icons/md";

const Contact: NextPage = () => {
	return (
		<>
			<NextSeo
				title="Contato"
				description={`Entre em contato com a ${config.shortName} a partir dos meios informados nesta página.`}
			/>

			<Main title="Contato" className="flex flex-col justify-center items-center p-6 pb-10">
				<div className="flex flex-col max-w-2xl gap-3 text-black-100">
					<div className="flex flex-col gap-1">
						<h3 className="text-xl font-semibold">Endereço</h3>
						<span className="flex items-center gap-2">
							<div>
								<MdMap className="text-xl" />
							</div>
							<p>
								Rua Coronel Lucena, 196, Centro - Casa da Cultura de Santana do
								Ipanema, 57500-000 - Santana do Ipanema/AL
							</p>
						</span>
					</div>
					<div className="flex flex-col gap-1">
						<h3 className="text-xl font-semibold">Horário de funcionamento</h3>
						<span className="flex items-center gap-2">
							<div>
								<AiOutlineClockCircle className="text-xl" />
							</div>
							<p>2ª a 6ª-feiras, de 9:00h às 13:00h</p>
						</span>
					</div>
					<div className="flex flex-col gap-1">
						<h3 className="text-xl font-semibold">Telefone</h3>
						<span className="flex items-center gap-2">
							<div>
								<MdCall className="text-xl" />
							</div>
							<p>(82) 99928-2412</p>
						</span>
					</div>
					<div className="flex flex-col gap-1">
						<h3 className="text-xl font-semibold">Instagram</h3>
						<span className="flex items-center gap-2">
							<div>
								<CgInstagram className="text-xl" />
							</div>
							<a
								href="https://www.instagram.com/asclasi"
								target="_blank"
								rel="noreferrer"
								className="hover:underline"
							>
								@asclasi
							</a>
						</span>
					</div>
					<div className="flex flex-col gap-1">
						<h3 className="text-xl font-semibold">Correio eletrônico</h3>
						<span className="flex items-center gap-2">
							<div>
								<MdEmail className="text-xl" />
							</div>
							<p>
								Presidente -{" "}
								<a className="hover:underline" href="mailto:maltafneto@gmail.com">
									maltafneto@gmail.com
								</a>
							</p>
						</span>
						<span className="flex items-center gap-2">
							<div>
								<MdEmail className="text-xl" />
							</div>
							<p>
								Administrador -{" "}
								<a
									className="hover:underline"
									href="mailto:aslca.contato@gmail.com"
								>
									aslca.contato@gmail.com
								</a>
							</p>
						</span>
					</div>
				</div>
			</Main>
		</>
	);
};

export default Contact;
