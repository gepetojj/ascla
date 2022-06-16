import { Button } from "components/input/Button";
import Link from "next/link";
import React, { FC, memo } from "react";
import { MdMode, MdDelete } from "react-icons/md";

export interface EditableItemProps {
	title: string;
	editUrl: string;
	deleteAction: () => void;

	loading?: boolean;
	deleteLabel?: string;
}

const EditableItemComponent: FC<EditableItemProps> = ({
	title,
	editUrl,
	deleteAction,
	loading,
	deleteLabel,
}) => {
	return (
		<div className="flex justify-between items-center w-full bg-secondary-400 px-2 py-1 gap-3 rounded-sm">
			<span className="max-w-full break-words">{title}</span>
			<div className="flex items-center gap-2">
				<Link href={editUrl} shallow>
					<a>
						<MdMode className="text-xl cursor-pointer" />
					</a>
				</Link>

				<Button title={deleteLabel} onDoubleClick={deleteAction} loading={loading}>
					<MdDelete className="text-xl" />
				</Button>
			</div>
		</div>
	);
};

export const EditableItem = memo(EditableItemComponent);
