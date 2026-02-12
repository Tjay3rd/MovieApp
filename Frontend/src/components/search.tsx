interface Props {
	searchTerm: string;
	setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

function Search({ searchTerm, setSearchTerm }: Props) {
	return (
		<div className="text-white w-full">
			<div className="flex mx-auto justify-center align-center  bg-blue-950/30 rounded-lg px-4 w-3/4 max-w-xl">
				<img src="search.svg" alt="search icon" className="pr-2" />
				<input
					className="grow h-10 outline-none"
					type="text"
					placeholder="Search Through Tons of Movies"
					value={searchTerm}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
				/>
			</div>
		</div>
	);
}

export default Search;
