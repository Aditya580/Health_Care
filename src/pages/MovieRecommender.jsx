import {useEffect, useState} from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MovieModal from "./MovieModal";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";

// genre IDs: Action=28, Comedy=35, Animation=16, Drama=18
const genres = [
    {id: 28, name: "Action"},
    {id: 35, name: "Comedy"},
    {id: 16, name: "Animation"},
    {id: 18, name: "Drama"},
];

function MovieRecommender() {
    const [trending, setTrending] = useState(null);
    const [genreMovies, setGenreMovies] = useState({});
    const [selectedMovie, setSelectedMovie] = useState(null);

    // fetch trending movie
    useEffect(() => {
        fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.results && data.results.length > 0) {
                setTrending(data.results[0]); // top trending movie
            }
        });
    }, []);

    // fetch movies by genre
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const responses = await Promise.all(
                    genres.map((genre) =>
                        fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genre.id}`)
                        .then((res) => res.json())
                        .then((data) => ({id: genre.id, results: data.results || []}))
                    )
                );
                const genreData = {};
                responses.forEach(({id, results}) => {
                    genreData[id] = results;
                });
                setGenreMovies(genreData);
            } catch (err) {
                console.error("Error fetching genre movies:", err);
            }
        };
        fetchGenres();
    }, []);

    // carousel settings
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 5,
        responsive: [
            {breakpoint: 1024, settings: {slidesToShow: 3, slidesToScroll: 3}},
            {breakpoint: 640, settings: {slidesToShow: 2, slidesToScroll: 2}},
        ],
    };

    return (
        <div className="w-full h-full p-6 bg-black text-white">
            <h2 className="text-3xl font-bold mb-10">Movie Recommendations</h2>

            {/* Trending Movie */}
            {trending && (
                <div className="flex gap-6 px-10 mb-12 mx-20 p-4 bg-gray-900 rounded-lg">
                    <div className="flex-1 flex flex-col gap-6 mx-10 justify-center">
                        <div className="flex gap-2 w-fit p-2 bg-[#d40301] items-center">
                            <i className="fa-solid fa-fire-flame-curved"></i>
                            <p className="text-lg font-semibold">Trending Now</p>
                        </div>
                        <h3 className="text-2xl font-bold mt-4">{trending.title}</h3>
                        <p className="text-gray-300 mb-4">{trending.overview}</p>

                        <button
                            className="w-fit bg-blue-500 text-white px-4 py-2 rounded-lg
                        font-bold hover:bg-blue-600 cursor-pointer"
                            onClick={() => setSelectedMovie(trending)}
                        >
                            Watch Trailer
                        </button>
                    </div>
                    <div className="w-[250px] aspect-[2/3]">
                        <img
                            src={`${IMG_BASE}${trending.poster_path}`}
                            alt={trending.title}
                            className="rounded-lg shadow-lg w-full h-full object-cover"
                        />
                    </div>
                </div>
            )}

            {/* Rows by Genre */}
            <div className="space-y-12 px-10">
                {genres.map((genre) => (
                    <div key={genre.id} className="mb-8 group">
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-xl font-bold">{genre.name} Movies</h3>

                            {/* Sliding container */}
                            <div className="flex items-center gap-2 overflow-hidden">
                                {/* View All (hidden by default, slides in on hover) */}
                                <a
                                    href={`/movies/genre/${genre.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#0079ff] text-sm font-bold opacity-0 translate-x-[-20px] transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0  cursor-pointer"
                                >
                                    View All
                                </a>

                                {/* Arrow */}
                                <div className="text-xl font-bold font-[Comfortaa] text-[#0079ff] text-[#0079ff] text-sm font-semibold -translate-x-16 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
                                    &gt;
                                </div>
                            </div>
                        </div>

                        <Slider {...settings}>
                            {(genreMovies[genre.id] || []).map((movie) => (
                                <div key={movie.id} className="px-2" onClick={() => setSelectedMovie(movie)}>
                                    <div className="bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg cursor-pointer">
                                        <img
                                            src={`${IMG_BASE}${movie.poster_path}`}
                                            alt={movie.title}
                                            className="w-full h-64 object-cover"
                                        />
                                        <div className="p-2">
                                            <h4 className="text-sm font-bold truncate">{movie.title}</h4>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                        {selectedMovie && (
                            <MovieModal
                                movie={selectedMovie}
                                onClose={() => setSelectedMovie(null)}
                                IMG_BASE={IMG_BASE}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MovieRecommender;
