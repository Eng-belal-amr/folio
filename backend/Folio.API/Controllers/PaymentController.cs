using Folio.API.Data;
using Folio.API.DTOs;
using Folio.API.Models;
using Folio.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Folio.API.Controllers;

[ApiController]
[Route("api/payments")]
public class PaymentController(AppDbContext db, PaymobService paymob) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    [HttpPost("create-order")]
    [Authorize]
    public async Task<IActionResult> CreateOrder(CreateOrderRequest req)
    {
        if (!new[] { "monthly", "annual", "payperuse" }.Contains(req.Plan))
            return BadRequest(new { message = "Invalid plan." });

        var user = await db.Users.FindAsync(UserId);
        if (user == null) return NotFound();

        var nameParts = user.Username.Split(' ');
        var (paymentKey, iframeUrl) = await paymob.CreatePaymentOrder(
            req.Plan, user.Id, user.Email,
            nameParts[0], nameParts.Length > 1 ? nameParts[1] : nameParts[0]);

        // Save pending payment
        var payment = new Payment
        {
            UserId = UserId,
            Plan = PaymobService.PlanKeyToPlanType(req.Plan),
            Amount = req.Plan switch { "monthly" => 199, "annual" => 1499, _ => 29 },
            Status = PaymentStatus.Pending,
        };
        db.Payments.Add(payment);
        await db.SaveChangesAsync();

        return Ok(new CreateOrderResponse(paymentKey, iframeUrl, payment.Id));
    }

    // Paymob calls this webhook after payment
    [HttpPost("callback")]
    public async Task<IActionResult> Callback([FromQuery] Dictionary<string, string> query)
    {
        var hmac = query.GetValueOrDefault("hmac", "");
        if (!paymob.VerifyHmac(query, hmac))
            return BadRequest("Invalid HMAC");

        var success = query.GetValueOrDefault("success") == "true";
        var paymobOrderId = query.GetValueOrDefault("order", "");
        var transactionId = query.GetValueOrDefault("id", "");

        if (!success) return Ok();

        // Find pending payment by matching — in production match by merchant_order_id
        var payment = await db.Payments
            .Where(p => p.Status == PaymentStatus.Pending)
            .OrderByDescending(p => p.CreatedAt)
            .FirstOrDefaultAsync();

        if (payment == null) return Ok();

        payment.Status = PaymentStatus.Success;
        payment.PaymobTransactionId = transactionId;
        payment.PaymobOrderId = paymobOrderId;

        // Activate subscription
        var sub = await db.Subscriptions.FirstOrDefaultAsync(s => s.UserId == payment.UserId);
        if (sub == null)
        {
            sub = new Subscription { UserId = payment.UserId };
            db.Subscriptions.Add(sub);
        }

        sub.Plan = payment.Plan;
        sub.Status = SubscriptionStatus.Active;
        sub.StartDate = DateTime.UtcNow;
        sub.EndDate = payment.Plan switch
        {
            PlanType.Monthly => DateTime.UtcNow.AddMonths(1),
            PlanType.Annual => DateTime.UtcNow.AddYears(1),
            PlanType.PayPerUse => DateTime.UtcNow.AddDays(30),
            _ => null
        };

        await db.SaveChangesAsync();
        return Ok();
    }

    [HttpGet("my-payments")]
    [Authorize]
    public async Task<IActionResult> MyPayments()
    {
        var payments = await db.Payments
            .Where(p => p.UserId == UserId)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new { p.Id, p.Plan, p.Amount, p.Currency, p.Status, p.CreatedAt })
            .ToListAsync();
        return Ok(payments);
    }
}
