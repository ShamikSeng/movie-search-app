// Controllers/MoviesController.cs
using Microsoft.AspNetCore.Mvc;
using MovieApp.API.Models;
using MovieApp.API.Services;

namespace MovieApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly IMovieService _movieService;
        private readonly ILogger<MoviesController> _logger;

        public MoviesController(IMovieService movieService, ILogger<MoviesController> logger)
        {
            _movieService = movieService;
            _logger = logger;
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<Movie>>> SearchMovies([FromQuery] string query)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(query))
                {
                    return await GetPopularMovies();
                }

                var movies = await _movieService.SearchMoviesAsync(query);

                // Update search count for the first movie in results
                if (movies.Count > 0)
                {
                    await _movieService.UpdateSearchCountAsync(query, movies[0]);
                }

                return Ok(movies);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching movies with query: {Query}", query);
                return StatusCode(500, "An error occurred while searching movies");
            }
        }

        [HttpGet("popular")]
        public async Task<ActionResult<List<Movie>>> GetPopularMovies()
        {
            try
            {
                var movies = await _movieService.GetPopularMoviesAsync();
                return Ok(movies);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching popular movies");
                return StatusCode(500, "An error occurred while fetching popular movies");
            }
        }

        [HttpGet("trending")]
        public async Task<ActionResult<List<SearchHistory>>> GetTrendingMovies()
        {
            try
            {
                var trending = await _movieService.GetTrendingMoviesAsync();
                return Ok(trending);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching trending movies");
                return StatusCode(500, "An error occurred while fetching trending movies");
            }
        }

        [HttpPost("search-count")]
        public async Task<ActionResult> UpdateSearchCount([FromBody] UpdateSearchCountRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.SearchTerm) || request.Movie == null)
                {
                    return BadRequest("Search term and movie are required");
                }

                await _movieService.UpdateSearchCountAsync(request.SearchTerm, request.Movie);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating search count");
                return StatusCode(500, "An error occurred while updating search count");
            }
        }
    }

    public class UpdateSearchCountRequest
    {
        public string SearchTerm { get; set; } = string.Empty;
        public Movie Movie { get; set; } = new();
    }
}