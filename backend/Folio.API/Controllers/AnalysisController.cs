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
[Route("api/analyses")]
[Authorize]
public class AnalysisController(AppDbContext db, EmailService email) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    [HttpGet]
    public async Task<IActionResult> GetMyAnalyses()
    {
        var user = await db.Users.Include(u => u.Subscription).FirstOrDefaultAsync(u => u.Id == UserId);
        var isPro = IsProActive(user?.Subscription);
        var query = db.Analyses.Where(a => a.UserId == UserId).OrderByDescending(a => a.CreatedAt);
        var analyses = isPro ? await query.ToListAsync() : await query.Take(3).ToListAsync();
        return Ok(analyses.Select(a => new AnalysisSummaryDto(a.Id, a.CandidateName, a.CandidateTitle, a.OverallScore, a.SelectedTemplateId, a.CreatedAt)));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAnalysis(int id)
    {
        var analysis = await db.Analyses.FirstOrDefaultAsync(a => a.Id == id && a.UserId == UserId);
        if (analysis == null) return NotFound();
        return Ok(new AnalysisDetailDto(analysis.Id, analysis.CandidateName, analysis.CandidateTitle, analysis.OverallScore, analysis.ResultJson, analysis.SelectedTemplateId, analysis.CreatedAt));
    }

    [HttpPost]
    public async Task<IActionResult> SaveAnalysis(SaveAnalysisRequest req)
    {
        var user = await db.Users.Include(u => u.Subscription).FirstOrDefaultAsync(u => u.Id == UserId);
        if (user == null) return NotFound();

        var sub = user.Subscription;
        var isPro = IsProActive(sub);

        if (!isPro)
        {
            if (sub != null && sub.AnalysesResetDate <= DateTime.UtcNow)
            {
                sub.AnalysesUsedThisMonth = 0;
                sub.AnalysesResetDate = DateTime.UtcNow.AddMonths(1);
            }
            if (sub != null && sub.AnalysesUsedThisMonth >= 3)
                return BadRequest(new { message = "Free plan limit reached (3/month). Upgrade to Pro for unlimited analyses." });
        }

        var analysis = new Analysis
        {
            UserId = UserId,
            CandidateName = req.CandidateName,
            CandidateTitle = req.CandidateTitle,
            OverallScore = req.OverallScore,
            ResultJson = req.ResultJson,
            SelectedTemplateId = req.SelectedTemplateId,
        };
        db.Analyses.Add(analysis);
        if (sub != null) sub.AnalysesUsedThisMonth++;
        await db.SaveChangesAsync();

        // Send email notification
        _ = email.SendAnalysisReadyAsync(user.Email, user.Username, req.CandidateName, req.OverallScore);

        return Ok(new { id = analysis.Id });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAnalysis(int id)
    {
        var analysis = await db.Analyses.FirstOrDefaultAsync(a => a.Id == id && a.UserId == UserId);
        if (analysis == null) return NotFound();
        db.Analyses.Remove(analysis);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static bool IsProActive(Subscription? sub) =>
        sub != null && sub.Plan != PlanType.Free &&
        sub.Status == SubscriptionStatus.Active &&
        (sub.EndDate == null || sub.EndDate > DateTime.UtcNow);
}
