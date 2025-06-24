namespace MovieApp.API.Models
{
    public class Movie
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Overview { get; set; } = string.Empty;
        public string PosterPath { get; set; } = string.Empty;
        public string BackdropPath { get; set; } = string.Empty;
        public DateTime ReleaseDate { get; set; }
        public double VoteAverage { get; set; }
        public int VoteCount { get; set; }
        public bool Adult { get; set; }
        public string OriginalLanguage { get; set; } = string.Empty;
        public double Popularity { get; set; }
    }
}