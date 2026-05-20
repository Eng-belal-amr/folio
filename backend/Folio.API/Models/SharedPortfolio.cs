namespace Folio.API.Models;

public class SharedPortfolio
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int AnalysisId { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string TemplateSlug { get; set; } = string.Empty;
    public bool IsPublic { get; set; } = true;
    public int ViewCount { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public User User { get; set; } = null!;
    public Analysis Analysis { get; set; } = null!;
}
