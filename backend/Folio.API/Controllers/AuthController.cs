using Folio.API.Data;
using Folio.API.DTOs;
using Folio.API.Models;
using Folio.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Security.Cryptography;

namespace Folio.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(AppDbContext db, TokenService tokens, EmailService email) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest req)
    {
        if (await db.Users.AnyAsync(u => u.Email == req.Email))
            return BadRequest(new { message = "Email already registered." });
        if (await db.Users.AnyAsync(u => u.Username == req.Username))
            return BadRequest(new { message = "Username already taken." });

        var user = new User { Username = req.Username, Email = req.Email, PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password) };
        db.Users.Add(user);
        await db.SaveChangesAsync();
        db.Subscriptions.Add(new Subscription { UserId = user.Id, Plan = PlanType.Free });
        await db.SaveChangesAsync();

        _ = email.SendWelcomeAsync(user.Email, user.Username);
        return Ok(BuildAuthResponse(user));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest req)
    {
        var user = await db.Users.Include(u => u.Subscription).FirstOrDefaultAsync(u => u.Email == req.Email);
        if (user == null || user.PasswordHash == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password." });
        if (!user.IsActive) return Unauthorized(new { message = "Account is disabled." });
        return Ok(BuildAuthResponse(user));
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest req)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
        if (user == null) return Ok(new { message = "If that email exists, a reset link has been sent." });

        // Expire old tokens
        var old = await db.PasswordResetTokens.Where(t => t.UserId == user.Id && !t.Used).ToListAsync();
        old.ForEach(t => t.Used = true);

        var tokenBytes = new byte[32];
        RandomNumberGenerator.Fill(tokenBytes);
        var token = Convert.ToHexString(tokenBytes).ToLower();

        db.PasswordResetTokens.Add(new PasswordResetToken
        {
            UserId = user.Id,
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddHours(1),
        });
        await db.SaveChangesAsync();

        _ = email.SendPasswordResetAsync(user.Email, token, user.Username);
        return Ok(new { message = "Reset link sent." });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest req)
    {
        var record = await db.PasswordResetTokens.Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Token == req.Token && !t.Used && t.ExpiresAt > DateTime.UtcNow);

        if (record == null) return BadRequest(new { message = "Invalid or expired reset link." });

        record.User.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
        record.Used = true;
        await db.SaveChangesAsync();
        return Ok(new { message = "Password updated successfully." });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var user = await db.Users.Include(u => u.Subscription).FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return NotFound();
        return Ok(ToUserDto(user));
    }

    [HttpPut("profile")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest req)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var user = await db.Users.FindAsync(userId);
        if (user == null) return NotFound();

        if (!string.IsNullOrWhiteSpace(req.Username) && req.Username != user.Username)
        {
            if (await db.Users.AnyAsync(u => u.Username == req.Username))
                return BadRequest(new { message = "Username already taken." });
            user.Username = req.Username;
        }

        if (!string.IsNullOrWhiteSpace(req.CurrentPassword) && !string.IsNullOrWhiteSpace(req.NewPassword))
        {
            if (user.PasswordHash == null || !BCrypt.Net.BCrypt.Verify(req.CurrentPassword, user.PasswordHash))
                return BadRequest(new { message = "Current password is incorrect." });
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
        }

        await db.SaveChangesAsync();
        return Ok(new { message = "Profile updated." });
    }

    private AuthResponse BuildAuthResponse(User user)
    {
        return new AuthResponse(tokens.GenerateAccessToken(user), tokens.GenerateRefreshToken(), ToUserDto(user));
    }

    private static UserDto ToUserDto(User user)
    {
        var plan = user.Subscription?.Plan.ToString() ?? "Free";
        var isPro = user.Subscription != null &&
                    user.Subscription.Plan != PlanType.Free &&
                    user.Subscription.Status == SubscriptionStatus.Active &&
                    (user.Subscription.EndDate == null || user.Subscription.EndDate > DateTime.UtcNow);
        return new UserDto(user.Id, user.Username, user.Email, user.AvatarUrl, user.IsAdmin, plan, isPro);
    }
}
