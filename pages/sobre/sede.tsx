import { Main } from "components/layout/Main";
import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import React from "react";

const AboutOffice: NextPage = () => {
	return (
		<>
			<NextSeo
				title="Sobre - Sede"
				description="Conheça a sede da Academia Santanense de Ciências, Letras e Artes."
			/>

			<Main
				title="Sede da ASCLA"
				className="flex flex-col justify-center items-center p-6 pb-10"
			>
				<div className="prose max-w-5xl text-justify">
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
						tempor incididunt ut labore et dolore magna aliqua. In mollis nunc sed id
						semper risus in hendrerit. Placerat in egestas erat imperdiet sed euismod
						nisi porta lorem. Velit sed ullamcorper morbi tincidunt ornare. Dui accumsan
						sit amet nulla. Consectetur a erat nam at lectus. Duis ut diam quam nulla
						porttitor. Pharetra vel turpis nunc eget lorem dolor sed viverra. Dictum
						fusce ut placerat orci nulla pellentesque. Aenean et tortor at risus viverra
						adipiscing at in tellus. Scelerisque fermentum dui faucibus in ornare quam
						viverra orci. Amet commodo nulla facilisi nullam vehicula ipsum a arcu.
						Interdum consectetur libero id faucibus nisl tincidunt. Eget nullam non nisi
						est sit amet facilisis magna etiam. Purus sit amet volutpat consequat mauris
						nunc congue nisi. Quam vulputate dignissim suspendisse in. Sagittis purus
						sit amet volutpat consequat mauris nunc congue. At erat pellentesque
						adipiscing commodo elit at imperdiet dui accumsan.
					</p>
					<p>
						Consequat ac felis donec et odio pellentesque diam volutpat commodo.
						Ultrices eros in cursus turpis massa tincidunt dui. Porta lorem mollis
						aliquam ut porttitor. Odio euismod lacinia at quis risus. Et malesuada fames
						ac turpis egestas integer eget aliquet. Mi eget mauris pharetra et ultrices
						neque ornare. Fermentum dui faucibus in ornare. Ullamcorper sit amet risus
						nullam eget. Eget felis eget nunc lobortis mattis aliquam faucibus purus in.
						Aliquam malesuada bibendum arcu vitae elementum. Nunc congue nisi vitae
						suscipit tellus mauris. Elit ut aliquam purus sit. Mi ipsum faucibus vitae
						aliquet. Vitae auctor eu augue ut lectus arcu. Porttitor leo a diam
						sollicitudin tempor id eu nisl. Pellentesque id nibh tortor id aliquet
						lectus. Eget egestas purus viverra accumsan in.
					</p>
					<p>
						Viverra mauris in aliquam sem fringilla ut. Odio facilisis mauris sit amet.
						Turpis massa tincidunt dui ut ornare. Vehicula ipsum a arcu cursus vitae
						congue mauris rhoncus aenean. Mi tempus imperdiet nulla malesuada. Id neque
						aliquam vestibulum morbi blandit cursus. Sed faucibus turpis in eu mi.
						Scelerisque mauris pellentesque pulvinar pellentesque habitant morbi
						tristique senectus. Orci a scelerisque purus semper. Vel pharetra vel turpis
						nunc eget. Tempus quam pellentesque nec nam aliquam sem et tortor. Congue
						quisque egestas diam in arcu cursus euismod quis. Enim ut tellus elementum
						sagittis vitae et leo duis. Mauris commodo quis imperdiet massa tincidunt
						nunc pulvinar sapien. Vitae proin sagittis nisl rhoncus mattis rhoncus urna
						neque viverra. Duis convallis convallis tellus id interdum velit laoreet.
						Elementum eu facilisis sed odio morbi. Ut lectus arcu bibendum at varius vel
						pharetra. Tempus imperdiet nulla malesuada pellentesque elit eget. Sed
						egestas egestas fringilla phasellus faucibus scelerisque eleifend.
					</p>
					<p>
						Amet nisl suscipit adipiscing bibendum est ultricies integer. Sit amet est
						placerat in egestas erat imperdiet. Nibh cras pulvinar mattis nunc.
						Consectetur adipiscing elit ut aliquam purus. Quis imperdiet massa tincidunt
						nunc pulvinar sapien et ligula ullamcorper. Nisi porta lorem mollis aliquam
						ut porttitor. Nullam non nisi est sit amet facilisis magna etiam. Sed
						vulputate mi sit amet mauris commodo quis imperdiet massa. Id faucibus nisl
						tincidunt eget nullam non nisi est sit. At consectetur lorem donec massa
						sapien faucibus et molestie. Eget gravida cum sociis natoque penatibus et
						magnis dis. Dui nunc mattis enim ut tellus. Dictum varius duis at
						consectetur lorem donec massa sapien faucibus. Leo integer malesuada nunc
						vel risus commodo viverra maecenas.
					</p>
				</div>
			</Main>
		</>
	);
};

export default AboutOffice;
