using MovieApp.API.Models;

namespace MovieApp.API.Services
{
    public interface IMovieService
    {
        Task<List<Movie>> SearchMoviesAsync(string query);
        Task<List<Movie>> GetPopularMoviesAsync();
        Task<List<SearchHistory>> GetTrendingMoviesAsync();
        Task UpdateSearchCountAsync(string searchTerm, Movie movie);
    }
}