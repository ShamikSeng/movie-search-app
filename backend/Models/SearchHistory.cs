namespace MovieApp.API.Models
{
    public class SearchHistory
    {
        public int Id { get; set; }
        public string SearchTerm { get; set; } = string.Empty;
        public int Count { get; set; }
        public int MovieId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string PosterUrl { get; set; } = string.Empty;
        public DateTime LastSearched { get; set; }
    }
}