import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import MovieModal from "./MovieModal";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";

// Map genre IDs to names (same as in MovieRecommender)
const genreMap = {
    28: "Action",
    35: "Comedy",
    16: "Animation",
    18: "Drama",
};

function MovieGenreList() {
    const {genreId} = useParams(); // genre is the ID from the route
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState(null); // to show the trailer onClick

    useEffect(() => {
        if (movies.length > 0) {
            document.title = `${genreMap[genreId]} - Movies`;
        } else {
            document.title = "All Movies";
        }
    }, [movies]);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);

        fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`, {
            signal: controller.signal,
        })
        .then((res) => res.json())
        .then((data) => setMovies(data.results || []))
        .catch((err) => {
            if (err.name !== "AbortError") console.error(err);
        })
        .finally(() => setLoading(false));

        return () => controller.abort();
    }, [genreId]);

    return (
        <div className="w-full min-h-screen bg-black text-white p-6">
            <h2 className="text-3xl font-bold mb-6">{genreMap[genreId] || "Movies"} Movies</h2>

            {loading ? (
                <p className="text-gray-400">Loading...</p>
            ) : movies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 p-10">
                    {movies.map((movie) => (
                        <div
                            key={movie.id}
                            className="bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg cursor-pointer"
                            onClick={() => setSelectedMovie(movie)}
                        >
                            <img
                                src={`${IMG_BASE}${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full h-72 object-cover"
                                loading="lazy"
                            />

                            <div className="p-2">
                                <h4 className="text-sm font-bold truncate">{movie.title}</h4>
                            </div>
                        </div>
                    ))}
                    {selectedMovie && (
                        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} IMG_BASE={IMG_BASE} />
                    )}
                </div>
            ) : (
                <p className="text-gray-400">No movies found.</p>
            )}
        </div>
    );
}

export default MovieGenreList;
