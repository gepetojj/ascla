import { Main } from "components/layout/Main";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { MdMap, MdCall, MdEmail } from "react-icons/md";

const Contact: NextPage = () => {
	return (
		<>
			<Head>
				<title>ASCLA - Contato</title>
			</Head>

			<Main title="Contato" className="flex flex-col justify-center items-center p-6 pb-10">
				<div className="flex flex-col max-w-5xl gap-3 text-black-100">
					<div className="flex flex-col gap-1">
						<h3 className="text-xl font-semibold">Endereço</h3>
						<span className="flex items-center gap-2">
							<div>
								<MdMap className="text-xl" />
							</div>
							<p>
								Rua Lorem ipsum dolor, número, bairro, CEP - Santana do Ipanema/AL
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
							<p>(82) 90000-0000</p>
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
								<a className="hover:underline" href="mailto:email@provedor.com">
									email@provedor.com
								</a>
							</p>
						</span>
						<span className="flex items-center gap-2">
							<div>
								<MdEmail className="text-xl" />
							</div>
							<p>
								Outra pessoa -{" "}
								<a className="hover:underline" href="mailto:email@provedor.com">
									email@provedor.com
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
