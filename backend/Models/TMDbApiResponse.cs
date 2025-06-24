namespace MovieApp.API.Models
{
    public class TMDbApiResponse
    {
        public int Page { get; set; }
        public List<TMDbMovie> Results { get; set; } = new();
        public int TotalPages { get; set; }
        public int TotalResults { get; set; }
    }

    public class TMDbMovie
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Overview { get; set; } = string.Empty;
        public string Poster_Path { get; set; } = string.Empty;
        public string Backdrop_Path { get; set; } = string.Empty;
        public string Release_Date { get; set; } = string.Empty;
        public double Vote_Average { get; set; }
        public int Vote_Count { get; set; }
        public bool Adult { get; set; }
        public string Original_Language { get; set; } = string.Empty;
        public double Popularity { get; set; }
    }
}