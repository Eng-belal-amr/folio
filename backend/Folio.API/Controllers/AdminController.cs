using Folio.API.Data;
using Folio.API.DTOs;
using Folio.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Folio.API.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize]
public class AdminController(AppDbContext db) : ControllerBase
{
    private bool IsAdmin() => User.FindFirst("isAdmin")?.Value == "true";

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        if (!IsAdmin()) return Forbid();
        var totalUsers = await db.Users.CountAsync();
        var proUsers = await db.Subscriptions.CountAsync(s => s.Plan != PlanType.Free && s.Status == SubscriptionStatus.Active);
        var totalAnalyses = await db.Analyses.CountAsync();
        var payments = await db.Payments.Where(p => p.Status == PaymentStatus.Success).ToListAsync();
        return Ok(new AdminStatsDto(totalUsers, proUsers, totalAnalyses, payments.Count, payments.Sum(p => p.Amount)));
    }

    [HttpGet("analytics")]
    public async Task<IActionResult> GetAnalytics()
    {
        if (!IsAdmin()) return Forbid();

        var since = DateTime.UtcNow.AddDays(-30);

        // Load raw data into memory first, then group (avoids MySQL .Date translation issues)
        var rawUsers = await db.Users
            .Where(u => u.CreatedAt >= since)
            .Select(u => u.CreatedAt)
            .ToListAsync();
        var signups = rawUsers
            .GroupBy(d => d.Date)
            .Select(g => new { date = g.Key.ToString("yyyy-MM-dd"), count = g.Count() })
            .OrderBy(x => x.date)
            .ToList();

        var rawPayments = await db.Payments
            .Where(p => p.Status == PaymentStatus.Success && p.CreatedAt >= since)
            .Select(p => new { p.CreatedAt, p.Amount })
            .ToListAsync();
        var revenue = rawPayments
            .GroupBy(p => p.CreatedAt.Date)
            .Select(g => new { date = g.Key.ToString("yyyy-MM-dd"), amount = g.Sum(p => p.Amount) })
            .OrderBy(x => x.date)
            .ToList();

        var rawAnalyses = await db.Analyses
            .Where(a => a.CreatedAt >= since)
            .Select(a => a.CreatedAt)
            .ToListAsync();
        var analyses = rawAnalyses
            .GroupBy(d => d.Date)
            .Select(g => new { date = g.Key.ToString("yyyy-MM-dd"), count = g.Count() })
            .OrderBy(x => x.date)
            .ToList();

        // Popular templates
        var templates = await db.Analyses
            .Where(a => a.SelectedTemplateId != null)
            .GroupBy(a => a.SelectedTemplateId)
            .Select(g => new { template = g.Key, count = g.Count() })
            .OrderByDescending(x => x.count)
            .Take(5)
            .ToListAsync();

        return Ok(new { signups, revenue, analyses, templates });
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null)
    {
        if (!IsAdmin()) return Forbid();
        var q = db.Users.Include(u => u.Subscription).Include(u => u.Analyses).AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
            q = q.Where(u => u.Email.Contains(search) || u.Username.Contains(search));

        var total = await q.CountAsync();
        var users = await q.OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .Select(u => new AdminUserDto(u.Id, u.Username, u.Email, u.IsAdmin, u.IsActive,
                u.Subscription != null ? u.Subscription.Plan.ToString() : "Free",
                u.Analyses.Count, u.CreatedAt))
            .ToListAsync();

        return Ok(new { users, total, page, pageSize });
    }

    [HttpPut("users/{id}/toggle-active")]
    public async Task<IActionResult> ToggleUserActive(int id)
    {
        if (!IsAdmin()) return Forbid();
        var user = await db.Users.FindAsync(id);
        if (user == null) return NotFound();
        user.IsActive = !user.IsActive;
        await db.SaveChangesAsync();
        return Ok(new { isActive = user.IsActive });
    }

    [HttpPut("users/{id}/toggle-admin")]
    public async Task<IActionResult> ToggleAdmin(int id)
    {
        if (!IsAdmin()) return Forbid();
        var user = await db.Users.FindAsync(id);
        if (user == null) return NotFound();
        user.IsAdmin = !user.IsAdmin;
        await db.SaveChangesAsync();
        return Ok(new { isAdmin = user.IsAdmin });
    }

    [HttpGet("payments")]
    public async Task<IActionResult> GetPayments([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        if (!IsAdmin()) return Forbid();
        var payments = await db.Payments.Include(p => p.User)
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .Select(p => new {
                p.Id,
                p.Amount,
                p.Currency,
                p.Plan,
                p.Status,
                p.PaymobTransactionId,
                p.CreatedAt,
                User = new { p.User.Id, p.User.Email, p.User.Username }
            })
            .ToListAsync();
        var total = await db.Payments.CountAsync();
        return Ok(new { payments, total });
    }
}
