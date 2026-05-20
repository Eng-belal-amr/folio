using Folio.API.Data;
using Folio.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Folio.API.Controllers;

[ApiController]
[Route("api/coupons")]
public class CouponController(AppDbContext db) : ControllerBase
{
    private bool IsAdmin() => User.FindFirst("isAdmin")?.Value == "true";

    [HttpPost("validate")]
    public async Task<IActionResult> Validate([FromBody] ValidateCouponRequest req)
    {
        var coupon = await db.Coupons.FirstOrDefaultAsync(c =>
            c.Code.ToLower() == req.Code.ToLower() &&
            c.IsActive &&
            c.UsedCount < c.MaxUses &&
            (c.ExpiresAt == null || c.ExpiresAt > DateTime.UtcNow));

        if (coupon == null)
            return BadRequest(new { message = "Invalid or expired coupon code." });

        return Ok(new { discount = coupon.DiscountPercent, code = coupon.Code });
    }

    // Admin endpoints
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll()
    {
        if (!IsAdmin()) return Forbid();
        var coupons = await db.Coupons.OrderByDescending(c => c.CreatedAt).ToListAsync();
        return Ok(coupons);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateCouponRequest req)
    {
        if (!IsAdmin()) return Forbid();
        if (await db.Coupons.AnyAsync(c => c.Code.ToLower() == req.Code.ToLower()))
            return BadRequest(new { message = "Coupon code already exists." });

        var coupon = new Coupon
        {
            Code = req.Code.ToUpper(),
            DiscountPercent = req.DiscountPercent,
            MaxUses = req.MaxUses,
            ExpiresAt = req.ExpiresAt,
        };
        db.Coupons.Add(coupon);
        await db.SaveChangesAsync();
        return Ok(coupon);
    }

    [HttpPut("{id}/toggle")]
    [Authorize]
    public async Task<IActionResult> Toggle(int id)
    {
        if (!IsAdmin()) return Forbid();
        var c = await db.Coupons.FindAsync(id);
        if (c == null) return NotFound();
        c.IsActive = !c.IsActive;
        await db.SaveChangesAsync();
        return Ok(new { isActive = c.IsActive });
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        if (!IsAdmin()) return Forbid();
        var c = await db.Coupons.FindAsync(id);
        if (c == null) return NotFound();
        db.Coupons.Remove(c);
        await db.SaveChangesAsync();
        return NoContent();
    }
}

public record ValidateCouponRequest(string Code);
public record CreateCouponRequest(string Code, int DiscountPercent, int MaxUses, DateTime? ExpiresAt);
