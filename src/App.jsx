import { useState, useEffect } from "react";
import "./App.css";
import MovieCard from "./MovieCard";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);

  const API_KEY = import.meta.env.VITE_API_KEY;

  // 🔥 Fetch popular movies
  const fetchPopularMovies = () => {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => setMovies(data.results))
      .catch((err) => console.log(err));
  };

  // 🔍 Search movies
  const searchMovies = (query) => {
    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`,
    )
      .then((res) => res.json())
      .then((data) => setMovies(data.results));
  };

  // 🎬 Fetch trailer
  const fetchTrailer = async (movieId) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`,
      );
      const data = await res.json();

      const trailer = data.results.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube",
      );

      if (trailer) {
        setTrailerKey(trailer.key);
        setSelectedMovie(movieId);
      } else {
        alert("No trailer available");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 🚀 Initial load
  useEffect(() => {
    fetchPopularMovies();
  }, []);

  // ⏱️ Debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchTerm.trim() === "") {
        fetchPopularMovies();
      } else {
        searchMovies(searchTerm);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  return (
    <div className="app">
      <h1>Movie App 🎬</h1>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search movies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* 🎬 Movies */}
      {movies.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="movie-container">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              poster={movie.poster_path}
              rating={movie.vote_average}
              onSelect={fetchTrailer}
            />
          ))}
        </div>
      )}

      {/* 🎥 Trailer Modal */}
      {selectedMovie && (
        <div className="modal" onClick={() => setSelectedMovie(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title="Trailer"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
