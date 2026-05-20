namespace Folio.API.DTOs;

public record RegisterRequest(string Username, string Email, string Password);
public record LoginRequest(string Email, string Password);

public record AuthResponse(
    string AccessToken,
    string RefreshToken,
    UserDto User
);

public record UserDto(
    int Id,
    string Username,
    string Email,
    string? AvatarUrl,
    bool IsAdmin,
    string Plan,
    bool IsProActive
);
public record ForgotPasswordRequest(string Email);
public record ResetPasswordRequest(string Token, string NewPassword);
public record UpdateProfileRequest(string? Username, string? CurrentPassword, string? NewPassword);
