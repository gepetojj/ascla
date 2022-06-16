import { Listbox } from "@headlessui/react";

import type { Academic } from "entities/Academic";
import type { Patron } from "entities/Patron";
import React, { FC, memo } from "react";

export interface SelectProps<I = { id: string; name: string } | Academic | Patron> {
	label: string;
	options: I[];
	selected: I | undefined;
	onChange: (selected: I) => void;
}

const SelectComponent: FC<SelectProps> = ({ label, options, selected, onChange }) => {
	return (
		<Listbox
			value={selected}
			onChange={onChange}
			as="div"
			className="flex flex-col w-full gap-1 relative sm:w-fit"
		>
			<Listbox.Label className="text-xs text-black-300 font-medium ml-1">
				{label}
			</Listbox.Label>
			<Listbox.Button className="w-full text-left px-2 py-1 bg-cream-100 border border-black-200/10 rounded outline-none duration-200 focus:border-black-200/20 sm:w-80">
				{selected?.name || "Escolha uma opção"}
			</Listbox.Button>
			<Listbox.Options className="flex flex-col absolute w-full top-16 p-2 gap-1 bg-gray-100 border border-black-200/10 rounded z-10">
				{options.length > 0 ? (
					options.map(option => (
						<Listbox.Option key={option.id} value={option}>
							{({ selected }) => (
								<button
									className={`w-full p-1 bg-cream-100 duration-200 ${
										selected
											? "brightness-95 hover:brightness-90"
											: "hover:brightness-95"
									}`}
								>
									{option.name}
								</button>
							)}
						</Listbox.Option>
					))
				) : (
					<p className="w-full p-2 text-center">Não há opções agora.</p>
				)}
			</Listbox.Options>
		</Listbox>
	);
};

export const Select = memo(SelectComponent);
