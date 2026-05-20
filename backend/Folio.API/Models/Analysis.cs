namespace Folio.API.Models;

public class Analysis
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string CandidateName { get; set; } = string.Empty;
    public string CandidateTitle { get; set; } = string.Empty;
    public int OverallScore { get; set; }
    public string ResultJson { get; set; } = string.Empty; // full JSON blob
    public string? SelectedTemplateId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User User { get; set; } = null!;
}
