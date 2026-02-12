/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useEffect, useState } from "react";
import Search from "./components/search";
import MovieCard from "./components/movieCard";
import Spinner from "./components/spinner";
import { useDebounce } from "react-use";
import axios from "axios";

interface movie {
	id: number;
	title: string;
	vote_average: number;
	poster_path: string;
	release_date: string;
	original_language: string;
}
interface trendingMovie {
	movie_id: number;
	poster_url: string;
}

declare global {
	interface ImportMetaEnv {
		readonly VITE_TMDB_API_KEY: string;
		readonly VITE_MODE: string;
	}
	interface ImportMeta {
		readonly env: ImportMetaEnv;
	}
}
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_BASE_URL = "https://api.themoviedb.org/3";

const BASE_URL = import.meta.env.VITE_MODE === "development" ? "http://localhost:3001/api" : "/api";

const API_OPTIONS = {
	method: "GET",
	headers: {
		accept: "application/json",
		Authorization: `Bearer ${API_KEY}`,
	},
};

function App() {
	const [searchTerm, setSearchTerm] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [movieList, setMovieList] = useState([]);
	const [trendingMovies, setTrendingMovies] = useState<trendingMovie[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

	//Debounce the searchTerm to prevent making too many api requests by waiting for the user to stop typing for 1s.
	useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm]);

	const fetchMovies = async (query = "") => {
		setIsLoading(true);
		setErrorMessage("");

		try {
			const endpoint = query
				? `${API_BASE_URL}/search/movie?query=${encodeURI(query)}`
				: `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

			const response = await fetch(endpoint, API_OPTIONS);
			if (!response.ok) throw new Error("Error Fetching Movies");
			const movieData = await response.json();

			if (movieData.status_code) {
				setErrorMessage(movieData.status_message || "Failed to fetch movies");
				setMovieList([]);
				return;
			}
			setMovieList(movieData.results || []);

			// Update search count for trending movies only if there's a search query
			if (query && movieData.results.length > 0) {
				const firstMovie = movieData.results[0];

				try {
					await axios.post(`${BASE_URL}/movies/searchcount`, { query, firstMovie });
				} catch (error) {
					console.error(error);
					setErrorMessage("Error updating trending movies search count");
				}
			}
		} catch (err) {
			console.error("Error Fetching Movies", err);
			setErrorMessage("Error Fetching Movies. Please Try Again Later");
		} finally {
			setIsLoading(false);
		}
	};

	const loadTrendingMovies = async () => {
		try {
			const movies = await axios.get(`${BASE_URL}/movies/trending`);

			if (!movies.data || movies.data.length === 0) throw new Error("No trending movies found");

			setTrendingMovies(movies.data);
		} catch (error) {
			console.error(`Error fetching trending movies: ${error}`);
		}
	};

	useEffect(() => {
		fetchMovies(debouncedSearchTerm);
	}, [debouncedSearchTerm]);

	useEffect(() => {
		loadTrendingMovies();
	}, []);

	return (
		<main>
			<div className="fixed bg-cover bg-center inset-0 bg-[url('/hero-bg.png')] -z-3" />

			<div className="">
				<header className="mt-15 mx-5 flex flex-col items-center justify-center">
					<img src="hero.png" className="w-full max-w-lg m-auto" alt="hero banner" />
					<h1 className=" text-white text-4xl text-center font-bold my-10 mx-5 max-w-md">
						Find&nbsp;
						<span className="bg-linear-to-r from-amber-100 to-purple-600 bg-clip-text text-transparent">
							Movies&nbsp;
						</span>
						You'll Enjoy Without Any Hassle
					</h1>
					<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
				</header>

				{trendingMovies.length > 0 && (
					<section className="mt-20">
						<h2 className="text-2xl font-bold text-white sm:text-3xl">Trending Movies</h2>

						{isLoading ? (
							<Spinner />
						) : errorMessage ? (
							<h3 className="text-red-500 text-2xl">{errorMessage}</h3>
						) : (
							<ul className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
								{trendingMovies.map((trendingMovie: trendingMovie, index) => (
									<li key={trendingMovie.movie_id}>
										<p className="text-white text-4xl">{index + 1}</p>
										<img src={trendingMovie.poster_url} alt="Movie Poster" />
									</li>
								))}
							</ul>
						)}
					</section>
				)}

				<section className="space-y-9">
					<h2 className="text-2xl font-bold text-white sm:text-3xl mt-20">All Movies</h2>

					{isLoading ? (
						<Spinner />
					) : errorMessage ? (
						<h3 className="text-red-500 text-2xl">{errorMessage}</h3>
					) : (
						<ul className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
							{movieList.map((movie: movie) => (
								<MovieCard key={movie.id} movie={movie} />
							))}
						</ul>
					)}
				</section>
			</div>
		</main>
	);
}

export default App;
