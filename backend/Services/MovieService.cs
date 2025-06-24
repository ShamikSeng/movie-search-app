using Microsoft.EntityFrameworkCore;
using MovieApp.API.Data;
using MovieApp.API.Models;
using Newtonsoft.Json;

namespace MovieApp.API.Services
{
    public class MovieService : IMovieService
    {
        private readonly HttpClient _httpClient;
        private readonly MovieDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly string _apiKey;
        private const string API_BASE_URL = "https://api.themoviedb.org/3";

        public MovieService(HttpClient httpClient, MovieDbContext context, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _context = context;
            _configuration = configuration;
            _apiKey = _configuration["TMDb:ApiKey"] ?? throw new InvalidOperationException("TMDb API key not found");

            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
            _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
        }

        public async Task<List<Movie>> SearchMoviesAsync(string query)
        {
            try
            {
                var endpoint = $"{API_BASE_URL}/search/movie?query={Uri.EscapeDataString(query)}";
                var response = await _httpClient.GetStringAsync(endpoint);
                var apiResponse = JsonConvert.DeserializeObject<TMDbApiResponse>(response);

                return ConvertToMovies(apiResponse?.Results ?? new List<TMDbMovie>());
            }
            catch (Exception ex)
            {
                throw new Exception($"Error searching movies: {ex.Message}", ex);
            }
        }

        public async Task<List<Movie>> GetPopularMoviesAsync()
        {
            try
            {
                var endpoint = $"{API_BASE_URL}/discover/movie?sort_by=popularity.desc";
                var response = await _httpClient.GetStringAsync(endpoint);
                var apiResponse = JsonConvert.DeserializeObject<TMDbApiResponse>(response);

                return ConvertToMovies(apiResponse?.Results ?? new List<TMDbMovie>());
            }
            catch (Exception ex)
            {
                throw new Exception($"Error fetching popular movies: {ex.Message}", ex);
            }
        }

        public async Task<List<SearchHistory>> GetTrendingMoviesAsync()
        {
            return await _context.SearchHistories
                .OrderByDescending(s => s.Count)
                .Take(5)
                .ToListAsync();
        }

        public async Task UpdateSearchCountAsync(string searchTerm, Movie movie)
        {
            try
            {
                var existingSearch = await _context.SearchHistories
                    .FirstOrDefaultAsync(s => s.SearchTerm == searchTerm);

                if (existingSearch != null)
                {
                    existingSearch.Count++;
                    existingSearch.LastSearched = DateTime.UtcNow;
                }
                else
                {
                    var newSearch = new SearchHistory
                    {
                        SearchTerm = searchTerm,
                        Count = 1,
                        MovieId = movie.Id,
                        Title = movie.Title,
                        PosterUrl = $"https://image.tmdb.org/t/p/w500{movie.PosterPath}",
                        LastSearched = DateTime.UtcNow
                    };
                    _context.SearchHistories.Add(newSearch);
                }

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating search count: {ex.Message}", ex);
            }
        }

        private List<Movie> ConvertToMovies(List<TMDbMovie> tmdbMovies)
        {
            return tmdbMovies.Select(m => new Movie
            {
                Id = m.Id,
                Title = m.Title,
                Overview = m.Overview,
                PosterPath = m.Poster_Path,
                BackdropPath = m.Backdrop_Path,
                ReleaseDate = DateTime.TryParse(m.Release_Date, out var date) ? date : DateTime.MinValue,
                VoteAverage = m.Vote_Average,
                VoteCount = m.Vote_Count,
                Adult = m.Adult,
                OriginalLanguage = m.Original_Language,
                Popularity = m.Popularity
            }).ToList();
        }
    }
}