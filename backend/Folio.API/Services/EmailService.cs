using System.Net;
using System.Net.Mail;

namespace Folio.API.Services;

public class EmailService(IConfiguration config)
{
    private readonly string _from    = config["Email:From"]    ?? "noreply@folio.app";
    private readonly string _host    = config["Email:Host"]    ?? "smtp.gmail.com";
    private readonly int    _port    = int.Parse(config["Email:Port"] ?? "587");
    private readonly string _user    = config["Email:User"]    ?? "";
    private readonly string _pass    = config["Email:Pass"]    ?? "";
    private readonly bool   _enabled = bool.Parse(config["Email:Enabled"] ?? "false");

    public async Task SendAsync(string to, string subject, string htmlBody)
    {
        if (!_enabled) { Console.WriteLine($"[EMAIL DISABLED] To:{to} Subject:{subject}"); return; }
        using var client = new SmtpClient(_host, _port)
        {
            Credentials = new NetworkCredential(_user, _pass),
            EnableSsl = true,
        };
        var msg = new MailMessage(_from, to, subject, htmlBody) { IsBodyHtml = true };
        await client.SendMailAsync(msg);
    }

    public Task SendWelcomeAsync(string to, string username) => SendAsync(to, "Welcome to Folio! 🎉",
        $"""
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:2rem;background:#fafaf8">
          <h1 style="font-size:2rem;color:#1a1814">Welcome, {username}! ✦</h1>
          <p style="color:#7a7568;line-height:1.8">Your Folio account is ready. Upload your CV and generate a stunning portfolio in minutes.</p>
          <a href="{config["Frontend:Url"]}/upload" style="display:inline-block;margin-top:1.5rem;padding:.9rem 2rem;background:#1a1814;color:#fafaf8;text-decoration:none;border-radius:8px;font-weight:600">Upload your CV →</a>
          <p style="color:#b0ab99;font-size:.8rem;margin-top:2rem">Built with Folio · Unsubscribe anytime</p>
        </div>
        """);

    public Task SendPasswordResetAsync(string to, string token, string username) => SendAsync(to, "Reset your Folio password",
        $"""
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:2rem;background:#fafaf8">
          <h1 style="font-size:1.8rem;color:#1a1814">Reset your password</h1>
          <p style="color:#7a7568;line-height:1.8">Hi {username}, click the button below to reset your password. This link expires in 1 hour.</p>
          <a href="{config["Frontend:Url"]}/reset-password?token={token}" style="display:inline-block;margin-top:1.5rem;padding:.9rem 2rem;background:#d4a843;color:#1a1814;text-decoration:none;border-radius:8px;font-weight:700">Reset Password →</a>
          <p style="color:#b0ab99;font-size:.8rem;margin-top:2rem">If you didn't request this, ignore this email.</p>
        </div>
        """);

    public Task SendProActivatedAsync(string to, string username, string plan) => SendAsync(to, "Folio Pro activated! 🚀",
        $"""
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:2rem;background:#0a0904;color:#f5f0e8">
          <h1 style="font-size:2rem;color:#d4a843">You're now Pro ✦</h1>
          <p style="color:#8a8070;line-height:1.8">Hi {username}, your <strong style="color:#d4a843">{plan}</strong> plan is now active. All 10 templates are unlocked.</p>
          <a href="{config["Frontend:Url"]}/templates" style="display:inline-block;margin-top:1.5rem;padding:.9rem 2rem;background:#d4a843;color:#0a0904;text-decoration:none;border-radius:8px;font-weight:700">Browse Templates →</a>
          <p style="color:#47433b;font-size:.8rem;margin-top:2rem">Built with Folio</p>
        </div>
        """);

    public Task SendAnalysisReadyAsync(string to, string username, string candidateName, int score) => SendAsync(to, $"Your CV analysis is ready — Score: {score}/100",
        $"""
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:2rem;background:#fafaf8">
          <h1 style="font-size:1.8rem;color:#1a1814">Analysis complete ✦</h1>
          <p style="color:#7a7568">Hi {username}, the analysis for <strong>{candidateName}</strong> scored <strong style="color:#d4a843;font-size:1.2rem">{score}/100</strong>.</p>
          <a href="{config["Frontend:Url"]}/dashboard" style="display:inline-block;margin-top:1.5rem;padding:.9rem 2rem;background:#1a1814;color:#fafaf8;text-decoration:none;border-radius:8px;font-weight:600">View Results →</a>
        </div>
        """);
}
