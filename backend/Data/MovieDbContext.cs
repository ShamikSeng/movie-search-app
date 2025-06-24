// Data/MovieDbContext.cs
using Microsoft.EntityFrameworkCore;
using MovieApp.API.Models;

namespace MovieApp.API.Data
{
    public class MovieDbContext : DbContext
    {
        public MovieDbContext(DbContextOptions<MovieDbContext> options) : base(options)
        {
        }

        public DbSet<SearchHistory> SearchHistories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SearchHistory>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.SearchTerm).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Title).HasMaxLength(500);
                entity.Property(e => e.PosterUrl).HasMaxLength(500);
                entity.HasIndex(e => e.SearchTerm);
            });
        }
    }
}