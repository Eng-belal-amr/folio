using Folio.API.Data;
using Folio.API.DTOs;
using Folio.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Folio.API.Controllers;

[ApiController]
[Route("api/templates")]
public class TemplateController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetTemplates()
    {
        var templates = await db.Templates
            .Where(t => t.IsActive)
            .OrderBy(t => t.SortOrder)
            .Select(t => new TemplateDto(t.Id, t.Slug, t.Name, t.Style, t.Description, t.IsFree,
                t.IsActive, t.PreviewBg, t.PreviewHeader, t.PreviewSkill, t.PreviewTag, t.SortOrder))
            .ToListAsync();
        return Ok(templates);
    }

    // Admin only
    [HttpGet("admin/all")]
    [Authorize]
    public async Task<IActionResult> GetAllTemplates()
    {
        if (!IsAdmin()) return Forbid();
        var templates = await db.Templates.OrderBy(t => t.SortOrder)
            .Select(t => new TemplateDto(t.Id, t.Slug, t.Name, t.Style, t.Description, t.IsFree,
                t.IsActive, t.PreviewBg, t.PreviewHeader, t.PreviewSkill, t.PreviewTag, t.SortOrder))
            .ToListAsync();
        return Ok(templates);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateTemplate(CreateTemplateRequest req)
    {
        if (!IsAdmin()) return Forbid();
        if (await db.Templates.AnyAsync(t => t.Slug == req.Slug))
            return BadRequest(new { message = "Slug already exists." });

        var t = new Template
        {
            Slug = req.Slug, Name = req.Name, Style = req.Style,
            Description = req.Description, IsFree = req.IsFree,
            PreviewBg = req.PreviewBg, PreviewHeader = req.PreviewHeader,
            PreviewSkill = req.PreviewSkill, PreviewTag = req.PreviewTag,
            SortOrder = req.SortOrder
        };
        db.Templates.Add(t);
        await db.SaveChangesAsync();
        return Ok(new { id = t.Id });
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateTemplate(int id, UpdateTemplateRequest req)
    {
        if (!IsAdmin()) return Forbid();
        var t = await db.Templates.FindAsync(id);
        if (t == null) return NotFound();

        t.Name = req.Name; t.Style = req.Style; t.Description = req.Description;
        t.IsFree = req.IsFree; t.IsActive = req.IsActive;
        t.PreviewBg = req.PreviewBg; t.PreviewHeader = req.PreviewHeader;
        t.PreviewSkill = req.PreviewSkill; t.PreviewTag = req.PreviewTag;
        t.SortOrder = req.SortOrder;
        await db.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteTemplate(int id)
    {
        if (!IsAdmin()) return Forbid();
        var t = await db.Templates.FindAsync(id);
        if (t == null) return NotFound();
        db.Templates.Remove(t);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private bool IsAdmin()
    {
        var claim = User.FindFirst("isAdmin")?.Value;
        return claim == "true";
    }
}
