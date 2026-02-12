interface Props {
	movie: {
		title: string;
		vote_average: number;
		poster_path: string;
		release_date: string;
		original_language: string;
	};
}

const MovieCard = ({ movie: { title, vote_average, poster_path, release_date, original_language } }: Props) => {
	return (
		<div className="bg-dark-100 p-5 rounded-2xl shadow-inner shadow-light-100/10">
			<img
				className="rounded-lg"
				src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : "/no-movie.png"}
				alt={title}
			/>
			<div className="mt-4">
				<h3 className="text-white font-bold text-base line-clamp-1">{title}</h3>

				<section className="mt-2 flex flex-row items-center flex-wrap gap-2">
					<div className="flex flex-row items-center gap-1">
						<img className="size-4 object-contain" src="star.svg" alt="Star Icon" />
						<p className="font-bold text-base text-white">{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
					</div>

					<span className="text-sm text-gray-100">•</span>
					<p className="capitalize text-gray-100 font-medium text-base">{original_language}</p>

					<span className="text-sm text-gray-100">•</span>
					<p className="text-gray-100 font-medium text-base">{release_date ? release_date.split("-")[0] : "N/A"}</p>
				</section>
			</div>
		</div>
	);
};

export default MovieCard;
