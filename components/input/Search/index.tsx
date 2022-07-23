import Fuse from "fuse.js";
import { useRouter } from "next/router";
import React, {
	ChangeEvent,
	FC,
	memo,
	ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { MdClear, MdSearch } from "react-icons/md";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SearchDataType = Record<string, any>;

export interface SearchProps {
	data: SearchDataType[];
	options: Fuse.IFuseOptions<SearchDataType>;
	matchComponent: (match: Fuse.FuseResult<SearchDataType>) => ReactNode;
	initialSearch?: string;
	placeholder?: string;
	disabled?: boolean;
	width?: string;
}

const SearchComponent: FC<SearchProps> = ({
	data,
	options,
	matchComponent,
	initialSearch,
	placeholder,
	disabled,
	width,
}) => {
	const { push, pathname } = useRouter();
	const fuse = useMemo(() => {
		return new Fuse(data, {
			includeScore: true,
			threshold: 0.4,
			useExtendedSearch: true,
			...options,
		});
	}, [data, options]);

	const [search, setSearch] = useState(initialSearch || "");
	const [matches, setMatches] = useState<Fuse.FuseResult<SearchDataType>[]>([]);

	const onSearchChange = useCallback(
		({ target }: ChangeEvent<HTMLInputElement>) => {
			if (target.value.length > 70) return;
			setSearch(target.value);
			push({ pathname, query: { search: encodeURI(target.value) } }, undefined, {
				shallow: true,
			});
		},
		[push, pathname]
	);

	const onClearSearch = useCallback(() => {
		setSearch("");
		push({ pathname, query: { search: "" } }, undefined, {
			shallow: true,
		});
	}, [push, pathname]);

	useEffect(() => {
		const results = fuse.search(initialSearch || search);
		setMatches(results);
	}, [fuse, search, initialSearch]);

	return (
		<>
			<div
				className={`flex relative ${
					width ? width : "max-w-3xl"
				} w-full h-fit justify-center items-center ${
					matches.length > 0 || search.length > 0 ? "mb-0" : "mb-4"
				}`}
			>
				<input
					className="w-full px-2 py-1 rounded duration-200 outline-none border border-black-300/10 focus:border-black-300/50"
					type="text"
					placeholder={placeholder || "Pesquise:"}
					value={initialSearch || search}
					onChange={onSearchChange}
					disabled={disabled}
				/>
				<div className="flex justify-center items-center absolute right-1 px-2 py-1 bg-cream-100/5 backdrop-blur-[2px]">
					{initialSearch || search ? (
						<MdClear className="text-xl cursor-pointer" onClick={onClearSearch} />
					) : (
						<MdSearch className="text-xl" />
					)}
				</div>
			</div>
			{(matches.length > 0 || search.length > 0) && (
				<div
					className={`w-full ${
						width ? width : "max-w-3xl"
					} h-fit m-4 mb-6 divide-y divide-black-300/40 divide-y-reverse`}
				>
					<span className="text-sm">
						Resultados da sua pesquisa:{" "}
						<span className="text-xs italic">({matches.length} resultados)</span>
					</span>
					<ul className="flex flex-wrap justify-center items-center pt-2 pb-6 gap-4">
						{matches.map(match => matchComponent(match))}
					</ul>
				</div>
			)}
		</>
	);
};

export const Search = memo(SearchComponent);
