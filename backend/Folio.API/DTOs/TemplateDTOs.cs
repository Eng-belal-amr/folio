namespace Folio.API.DTOs;

public record TemplateDto(
    int Id,
    string Slug,
    string Name,
    string Style,
    string Description,
    bool IsFree,
    bool IsActive,
    string PreviewBg,
    string PreviewHeader,
    string PreviewSkill,
    string PreviewTag,
    int SortOrder
);

public record CreateTemplateRequest(
    string Slug,
    string Name,
    string Style,
    string Description,
    bool IsFree,
    string PreviewBg,
    string PreviewHeader,
    string PreviewSkill,
    string PreviewTag,
    int SortOrder
);

public record UpdateTemplateRequest(
    string Name,
    string Style,
    string Description,
    bool IsFree,
    bool IsActive,
    string PreviewBg,
    string PreviewHeader,
    string PreviewSkill,
    string PreviewTag,
    int SortOrder
);
