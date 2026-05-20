namespace Folio.API.Models;

public enum PaymentStatus { Pending, Success, Failed }

public class Payment
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "EGP";
    public PlanType Plan { get; set; }
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
    public string? PaymobOrderId { get; set; }
    public string? PaymobTransactionId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User User { get; set; } = null!;
}
