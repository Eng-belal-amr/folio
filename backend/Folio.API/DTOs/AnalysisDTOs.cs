namespace Folio.API.DTOs;

public record SaveAnalysisRequest(
    string CandidateName,
    string CandidateTitle,
    int OverallScore,
    string ResultJson,
    string? SelectedTemplateId
);

public record AnalysisSummaryDto(
    int Id,
    string CandidateName,
    string CandidateTitle,
    int OverallScore,
    string? SelectedTemplateId,
    DateTime CreatedAt
);

public record AnalysisDetailDto(
    int Id,
    string CandidateName,
    string CandidateTitle,
    int OverallScore,
    string ResultJson,
    string? SelectedTemplateId,
    DateTime CreatedAt
);
