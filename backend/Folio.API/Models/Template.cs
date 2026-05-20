namespace Folio.API.Models;

public class Template
{
    public int Id { get; set; }
    public string Slug { get; set; } = string.Empty;  // e.g. "lumiere"
    public string Name { get; set; } = string.Empty;
    public string Style { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsFree { get; set; } = true;
    public bool IsActive { get; set; } = true;
    public string PreviewBg { get; set; } = "#fafaf8";
    public string PreviewHeader { get; set; } = "#1c1a16";
    public string PreviewSkill { get; set; } = "#d4a843";
    public string PreviewTag { get; set; } = "#f5edd8";
    public int SortOrder { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
