namespace Folio.API.Models;

public enum PlanType { Free, Monthly, Annual, PayPerUse }
public enum SubscriptionStatus { Active, Expired, Cancelled }

public class Subscription
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public PlanType Plan { get; set; } = PlanType.Free;
    public SubscriptionStatus Status { get; set; } = SubscriptionStatus.Active;
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    public DateTime? EndDate { get; set; }
    public int AnalysesUsedThisMonth { get; set; } = 0;
    public DateTime AnalysesResetDate { get; set; } = DateTime.UtcNow.AddMonths(1);
    public string? PaymobOrderId { get; set; }

    // Navigation
    public User User { get; set; } = null!;
}
