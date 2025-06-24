import { useEffect, useState } from 'react';
import './App.css';

import Search from './components/search.jsx';
import Spinner from './components/Spinner.jsx';
import Moviecard from './components/Moviecard.jsx';

import { useDebounce } from 'react-use';

// API base URL for your ASP.NET Core backend
const API_BASE_URL = 'http://localhost:5275/api';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query
        ? `${API_BASE_URL}/movies/search?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/movies/popular`;

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Failed to fetch movies');

      const data = await response.json();
      setMovieList(data || []);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/trending`);
      if (response.ok) {
        const movies = await response.json();
        setTrendingMovies(movies);
      }
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
    <main className="min-h-screen bg-black text-white">
      <div className="pattern fixed inset-0 z-0" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10">
        <header className="text-center mb-12">
          <img src="./hero.png" alt="Hero Banner" className="mx-auto h-32 mb-4" />
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Find <span className="text-gradient text-blue-400">Movies</span> You'll Enjoy Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="mb-12">
            <h2 className="text-4xl font-semibold mb-4 text-white"> Trending Movies</h2>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trendingMovies.slice(0, 4).map((movie, index) => (
                <Moviecard
                  key={movie.id || index}
                  movie={{
                    ...movie,
                    rank: index + 1,
                    voteAverage: movie.voteAverage ?? 0,
                    releaseDate: movie.releaseDate || '',
                    overview: movie.overview || 'No description available.',
                    title: movie.title || 'Untitled',
                  }}
                />
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2 className="text-4xl font-semibold mb-4">All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : movieList.length === 0 ? (
            <p className="text-gray-400">No results found.</p>
          ) : (
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {movieList.map((movie) => (
                <Moviecard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
