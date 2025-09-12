import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

const MovieModal = ({ movie, onClose, IMG_BASE }) => {
  const [providers, setProviders] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    if (!movie) return;

    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      try {
        const [provRes, trailerRes] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${apiKey}`,
            { signal: controller.signal }
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}&language=en-US`,
            { signal: controller.signal }
          ),
        ]);

        const provData = await provRes.json();
        const trailerData = await trailerRes.json();

        // Providers
        const countryData = provData.results?.["IN"];
        if (countryData?.flatrate) {
          setProviders(countryData.flatrate);
        }

        // Trailer
        const trailer = trailerData.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        if (trailer) setTrailerKey(trailer.key);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching modal data:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [movie?.id, apiKey]);

  // Lock scroll when modal opens
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!movie) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 text-white rounded-xl shadow-lg w-[80%] max-w-3xl p-8 relative">
        {/* Close button */}
        <button
          className="absolute top-2 right-3 text-white text-xl font-bold hover:text-red-400 cursor-pointer"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Loading or Trailer */}
        {loading ? (
          <p className="text-center text-gray-400">Loading trailer...</p>
        ) : trailerKey ? (
          <iframe
            className="w-full h-64 rounded-lg mb-4"
            src={`https://www.youtube.com/embed/${trailerKey}`}
            title="Movie Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <img
            src={`${IMG_BASE.replace("w500", "w780")}${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-64 rounded-lg mb-4 object-cover"
            loading="lazy"
          />
        )}

        {/* Movie Info */}
        <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
        <p className="text-gray-300 text-sm mb-4">{movie.overview}</p>

        {/* Providers */}
        {providers.length > 0 ? (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Where to Watch:</h3>
            <ul className="flex gap-3 flex-wrap">
              {providers.map((prov, i) => (
                <li
                  key={i}
                  className="px-3 py-1 bg-blue-600 rounded-lg text-sm"
                >
                  {prov.provider_name}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-400">Streaming info not available</p>
        )}
      </div>
    </div>,
    document.body
  );
};

export default MovieModal;
