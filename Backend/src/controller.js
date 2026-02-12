import { Search } from "./model.js";

// Find a search term document and increment its count. If the document is not found, create a new one (upsert).
const updateSearchCountFn = async (searchTerm, movie) => {
	try {
		const searchQuery = { searchTerm: searchTerm };
		const update = {
			$inc: { count: 1 },
			$setOnInsert: {
				// Set these fields if a new document is created (upsert)
				movie_id: movie.id,
				poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
			},
		};

		const options = {
			new: true, // Return the document AFTER the update is applied.
			upsert: true, // If no document matches the query, create a new one.
		};
		// Execute the atomic upsert operation
		const updatedDocument = await Search.findOneAndUpdate(searchQuery, update, options);
		return updatedDocument; // Optionally, return the updated document
	} catch (error) {
		console.error("Error updating search count in MongoDB:", error);
		throw error;
	}
};

export async function updateSearchCount(req, res) {
	console.log(req.body);
	const { query, firstMovie } = req.body;
	try {
		await updateSearchCountFn(query, firstMovie);
		res.status(200).json({
			message: "Search updated successfully",
		});
	} catch (error) {
		console.error(error);
		res.status(500).send("Intenal Server Error");
	}
}

// Fetch the top 5 trending search documents based on the 'count' field. return An array of the top 5 documents.
const getTrendingMovies = async () => {
	try {
		// Mongoose provides a simple, chainable interface for queries:
		const trendingMovies = await Search.find({}) // selects all documents
			.sort({ count: "desc" })
			.limit(5)
			.exec(); // executes the query and returns a Promise

		if (trendingMovies.length === 0) {
			throw new Error("No trending movies found");
		}
		return trendingMovies; // Mongoose models return the data directly (not wrapped in a 'documents' object)
	} catch (error) {
		console.error("Error fetching trending movies from Database", error);
		throw new Error("Error fetching trending movies from Database");
	}
};

export async function trendingMovies(req, res) {
	try {
		const trending = await getTrendingMovies();
		return res.status(200).json(trending);
	} catch (error) {
		console.error(error);
		res.status(500).send("Intenal Server Error");
	}
}
