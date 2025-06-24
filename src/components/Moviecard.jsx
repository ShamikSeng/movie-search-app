const Moviecard = ({ movie }) => {
  const getPosterUrl = () => {
    if (movie.posterPath) {
      return `https://image.tmdb.org/t/p/w500${movie.posterPath}`;
    }
    if (movie.posterUrl?.startsWith('http')) {
      return movie.posterUrl;
    }
    return '/placeholder-movie.png';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // dd/mm/yyyy
  };

  return (
    <li className="relative group bg-zinc-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
      {/* Optional: show rank if passed */}
      {movie.rank && (
        <span className="absolute top-2 left-2 z-10 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded">
          #{movie.rank}
        </span>
      )}

      {/* Poster */}
      <div className="movie-poster">
        <img
          src={getPosterUrl()}
          alt={movie.title}
          className="w-full h-auto object-cover"
          onError={(e) => {
            e.target.src = '/placeholder-movie.png';
          }}
        />
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-between p-4 text-white">
        {/* Description Centered */}
        <div className="flex-grow flex items-center justify-center text-sm text-center px-2">
          <p className="line-clamp-6">{movie.overview || 'No description available.'}</p>
        </div>

        {/* Bottom Info */}
        <div className="flex justify-between items-center text-xs mt-4 pt-2 border-t border-white/20">
          <span className="text-yellow-400 font-semibold">
            ⭐ {movie.voteAverage?.toFixed(1) ?? 'N/A'}
          </span>
          <span className="text-white/80">{formatDate(movie.releaseDate)}</span>
        </div>
      </div>
    </li>
  );
};

export default Moviecard;
