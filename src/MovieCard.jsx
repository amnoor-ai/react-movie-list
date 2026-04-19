function MovieCard({ id, title, poster, rating, onSelect }) {
  const imageUrl = poster
    ? `https://image.tmdb.org/t/p/w500${poster}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <div className="movie-card" onClick={() => onSelect(id)}>
      <img src={imageUrl} alt={title} />

      <div className="overlay">
        <h3>{title}</h3>
        <p>⭐ {rating}</p>
      </div>
    </div>
  );
}

export default MovieCard;
