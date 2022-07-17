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
}

const SearchComponent: FC<SearchProps> = ({
	data,
	options,
	matchComponent,
	initialSearch,
	placeholder,
}) => {
	const { push, pathname } = useRouter();
	const fuse = useMemo(() => {
		return new Fuse(data, {
			...options,
			includeScore: true,
			threshold: 0.5,
			useExtendedSearch: true,
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
		const results = fuse.search(search);
		setMatches(results);
	}, [fuse, search]);

	return (
		<>
			<div
				className={`flex relative max-w-3xl w-full h-fit justify-center items-center ${
					matches.length > 0 || search.length > 0 ? "mb-0" : "mb-4"
				}`}
			>
				<input
					className="w-full px-2 py-1 rounded duration-200 outline-none border border-black-300/10 focus:border-black-300/50"
					type="text"
					placeholder={placeholder || "Pesquise:"}
					value={search}
					onChange={onSearchChange}
				/>
				<div className="flex justify-center items-center absolute right-1 px-2 py-1 bg-cream-100/5 backdrop-blur-[2px]">
					{search ? (
						<MdClear className="text-xl cursor-pointer" onClick={onClearSearch} />
					) : (
						<MdSearch className="text-xl" />
					)}
				</div>
			</div>
			{(matches.length > 0 || search.length > 0) && (
				<div className="w-full max-w-3xl h-fit m-4 divide-y divide-black-300/40 divide-y-reverse">
					<span className="text-sm">
						Resultados da sua pesquisa:{" "}
						<span className="text-xs italic">({matches.length} resultados)</span>
					</span>
					<ul className="flex flex-wrap justify-center items-center pt-2 pb-4">
						{matches.map(match => matchComponent(match))}
					</ul>
				</div>
			)}
		</>
	);
};

export const Search = memo(SearchComponent);
