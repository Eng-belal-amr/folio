using Folio.API.Data;
using Folio.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Security.Cryptography;

namespace Folio.API.Controllers;

[ApiController]
[Route("api/portfolio")]
public class PortfolioController(AppDbContext db) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    [HttpPost("share")]
    [Authorize]
    public async Task<IActionResult> SharePortfolio([FromBody] ShareRequest req)
    {
        var analysis = await db.Analyses.FirstOrDefaultAsync(a => a.Id == req.AnalysisId && a.UserId == UserId);
        if (analysis == null) return NotFound();

        // Check if template is Pro and user has access
        var template = await db.Templates.FirstOrDefaultAsync(t => t.Slug == req.TemplateSlug);
        if (template != null && !template.IsFree)
        {
            var sub = await db.Subscriptions.FirstOrDefaultAsync(s => s.UserId == UserId);
            var isPro = sub != null &&
                        sub.Plan != PlanType.Free &&
                        sub.Status == SubscriptionStatus.Active &&
                        (sub.EndDate == null || sub.EndDate > DateTime.UtcNow);
            if (!isPro)
                return BadRequest(new { message = "This template requires a Pro subscription. Upgrade to share with Pro templates." });
        }

        // Check if already shared with same template — return existing link
        var existing = await db.SharedPortfolios.FirstOrDefaultAsync(s =>
            s.AnalysisId == req.AnalysisId && s.UserId == UserId && s.TemplateSlug == req.TemplateSlug);
        if (existing != null)
            return Ok(new { slug = existing.Slug, url = $"/p/{existing.Slug}" });

        var slugBytes = new byte[8];
        RandomNumberGenerator.Fill(slugBytes);
        var slug = Convert.ToHexString(slugBytes).ToLower();

        db.SharedPortfolios.Add(new SharedPortfolio
        {
            UserId = UserId,
            AnalysisId = req.AnalysisId,
            Slug = slug,
            TemplateSlug = req.TemplateSlug,
        });
        await db.SaveChangesAsync();
        return Ok(new { slug, url = $"/p/{slug}" });
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetShared(string slug)
    {
        var shared = await db.SharedPortfolios
            .Include(s => s.Analysis)
            .FirstOrDefaultAsync(s => s.Slug == slug && s.IsPublic);

        if (shared == null) return NotFound();
        shared.ViewCount++;
        await db.SaveChangesAsync();

        return Ok(new
        {
            templateSlug = shared.TemplateSlug,
            resultJson = shared.Analysis.ResultJson,
            viewCount = shared.ViewCount,
            candidateName = shared.Analysis.CandidateName,
        });
    }

    [HttpDelete("{slug}")]
    [Authorize]
    public async Task<IActionResult> DeleteShared(string slug)
    {
        var shared = await db.SharedPortfolios.FirstOrDefaultAsync(s => s.Slug == slug && s.UserId == UserId);
        if (shared == null) return NotFound();
        db.SharedPortfolios.Remove(shared);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("my-shares")]
    [Authorize]
    public async Task<IActionResult> MyShares()
    {
        var shares = await db.SharedPortfolios
            .Where(s => s.UserId == UserId)
            .OrderByDescending(s => s.CreatedAt)
            .Select(s => new { s.Slug, s.TemplateSlug, s.ViewCount, s.CreatedAt, s.Analysis.CandidateName })
            .ToListAsync();
        return Ok(shares);
    }
}

public record ShareRequest(int AnalysisId, string TemplateSlug);
