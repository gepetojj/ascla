import { Button } from "components/input/Button";
import Link from "next/link";
import propTypes from "prop-types";
import React, { FC, memo } from "react";
import { MdMode, MdDelete } from "react-icons/md";

export interface EditableItemProps {
	/** Título do item. */
	title: string;
	/** Link para a página de edição do item. */
	editUrl: string;
	/** Callback para deletar o item. */
	deleteAction?: () => void;

	/** Determina se o estado de carregamento está ativado. */
	loading?: boolean;
	/** Texto no tooltip de deletar o item. */
	deleteLabel?: string;
}

/**
 * Renderiza uma "chamada" para editar ou deletar um item.
 *
 * @see {@link EditableItemProps}
 *
 * @param {EditableItemProps} ...props Props do componente, desestruturados
 * @returns {FC<EditableItemProps>} Componente
 */
const EditableItemComponent: FC<EditableItemProps> = ({
	title,
	editUrl,
	deleteAction,
	loading,
	deleteLabel,
}) => {
	return (
		<div className="flex justify-between items-center w-full bg-secondary-400 px-2 py-1 gap-3 rounded-sm animate-appear">
			<span className="max-w-full break-words">{title}</span>
			<div className="flex items-center gap-2">
				<Button title="Clique para editar o item">
					<Link href={editUrl}>
						<a className="duration-200 hover:text-black-200">
							<MdMode className="text-xl cursor-pointer" />
						</a>
					</Link>
				</Button>

				{deleteAction && (
					<Button title={deleteLabel} onDoubleClick={deleteAction} loading={loading}>
						<MdDelete className="text-xl duration-200 hover:text-black-200" />
					</Button>
				)}
			</div>
		</div>
	);
};

EditableItemComponent.propTypes = {
	title: propTypes.string.isRequired,
	editUrl: propTypes.string.isRequired,
	deleteAction: propTypes.func,
	loading: propTypes.bool,
	deleteLabel: propTypes.string,
};

export const EditableItem = memo(EditableItemComponent);
