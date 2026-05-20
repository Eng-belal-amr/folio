namespace Folio.API.DTOs;

public record AdminUserDto(
    int Id,
    string Username,
    string Email,
    bool IsAdmin,
    bool IsActive,
    string Plan,
    int TotalAnalyses,
    DateTime CreatedAt
);

public record AdminStatsDto(
    int TotalUsers,
    int ProUsers,
    int TotalAnalyses,
    int TotalPayments,
    decimal TotalRevenue
);
