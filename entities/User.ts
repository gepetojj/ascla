/** Cargos existentes para um usuário. */
export type UserRole = "common" | "academic" | "admin";

/**
 * Metadados de um usuário.
 *
 * @see {@link User}
 */
export interface UserMetadata {
	/** Provedor do serviço de login do usuário. */
	provider: string;
	/**
	 * Cargo do usuário.
	 *
	 * @see {@link UserRole}
	 */
	role: UserRole;
	/** @deprecated URLs personalizadas para usuários estão descontinuadas nesta versão. */
	urlId: string;
}

/**
 * Estrutura dos dados de um usuário.
 */
export interface User {
	/** ID do usuário. */
	id: string;
	/** Metadados do usuário. */
	metadata: UserMetadata;
	/** Email do usuário. */
	email: string;
	/** Link do avatar do usuário. */
	avatarUrl: string;
	/** Nome do usuário. */
	name: string;
}
