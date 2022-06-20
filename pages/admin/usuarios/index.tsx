import { EditableItem } from "components/card/EditableItem";
import { Main } from "components/layout/Main";
import { User } from "entities/User";
import { gSSPHandler } from "helpers/gSSPHandler";
import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import React from "react";

interface Props {
	users: User[];
}

const AdminUsers: NextPage<Props> = ({ users }) => {
	return (
		<>
			<NextSeo title="Administração - Usuários" noindex nofollow />

			<Main title="Usuários">
				<div className="flex flex-col justify-center items-center gap-4">
					<div className="flex justify-between items-center max-w-xl w-full">
						<h1 className="text-2xl font-semibold">Registro</h1>
					</div>
					<div className="flex flex-col justify-center items-center max-w-xl w-full gap-2">
						{users?.length ? (
							users.map(user => (
								<EditableItem
									key={user.id}
									title={user.name}
									editUrl={`/admin/usuarios/${user.id}`}
								/>
							))
						) : (
							<p>Não há usuários ainda.</p>
						)}
					</div>
				</div>
			</Main>
		</>
	);
};

export default AdminUsers;

export const getServerSideProps: GetServerSideProps<Props> = ctx =>
	gSSPHandler<Props>(ctx, { col: "users", autoTry: true }, async col => {
		const query = await col.get();
		const users: User[] = [];

		if (!query.empty) for (const doc of query.docs) users.push(doc.data() as User);

		return { props: { users } };
	});
