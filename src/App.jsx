import { useEffect, useState } from 'react'
import './App.css'

import Search from './components/search.jsx';
import Spinner from './components/Spinner.jsx';
import Moviecard from './components/Moviecard.jsx';

import { useDebounce } from 'react-use';

import { updateSearchCount } from './appwrite.js';
import { getTrendingMovies } from './appwrite.js';


//api key fetch and related operations
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {

  //send usestate as props to component
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm,setDebouncedSearchTerm] = useState('');

  const [movieList,setMovieList] = useState([]);
  const [TrendingMovies, setTrendingMovies] = useState([]);

  const [isLoading,setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  //debounce search term to prevent making too many API requests by waiting for user to stop typing for 500ms
  useDebounce( () => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  //fetching data from api asynchronously inside try catch block
  const fetchMovies = async ( query = '' ) => { 

    // console.log('fetchMovies called');
    // console.log('API Key:', API_KEY);

    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      // console.log('Making request to:', endpoint);
      
      const response = await fetch(endpoint, API_OPTIONS);
      // console.log('Response status:', response.status);
      
      if(!response.ok){
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      //populate movie list with data fetched from api (stored in variable data)
      setMovieList(data.results || []);

      //calls appwrite.js
      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0]);
      }

    } catch(error){
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async () => {
    try {

      const movies = await getTrendingMovies();
      setTrendingMovies(movies);


    } catch(error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }

  //fetch movie list for each debounced search
  useEffect( () => {
    fetchMovies(debouncedSearchTerm);
  },[debouncedSearchTerm]);

  //fetch trending movie list for first render
  useEffect( () => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className='pattern' />
      <div className='wrapper'>

        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        {TrendingMovies.length > 0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>
            <ul>
              {TrendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className='all-movies'>
          <h2>All Movies</h2>

          {isLoading ? (
            <Spinner/>
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : movieList.length === 0 ? (
            <p>No results found.</p>
          ) : (
            <ul>
              {movieList.map( (movie) => (
                <Moviecard key={movie.id} movie={movie}/>
              ))}
            </ul>
          )}
          
        </section>

      </div>
    </main>
  )
}

export default App;