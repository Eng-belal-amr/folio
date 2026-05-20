namespace Folio.API.Models;

public class Coupon
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public int DiscountPercent { get; set; }
    public int MaxUses { get; set; } = 100;
    public int UsedCount { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public DateTime? ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
