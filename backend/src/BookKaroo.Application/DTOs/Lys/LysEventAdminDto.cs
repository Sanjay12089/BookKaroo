namespace BookKaroo.Application.DTOs.Lys;

public class LysEventAdminDto
{
    public Guid    Id                   { get; set; }
    public string  Title                { get; set; } = string.Empty;
    public string  Slug                 { get; set; } = string.Empty;
    public string  Type                 { get; set; } = string.Empty;
    public string  Status               { get; set; } = string.Empty;
    public string  OrganizerName        { get; set; } = string.Empty;
    public string  OrganizerEmail       { get; set; } = string.Empty;
    public string  OrganizerPan         { get; set; } = string.Empty;
    public bool    IsOrganizerVerified  { get; set; }
    public string  VenueDisplay         { get; set; } = string.Empty;
    public string  EventDateLabel       { get; set; } = string.Empty;
    public string  EventTimeLabel       { get; set; } = string.Empty;
    public decimal LowestPrice          { get; set; }
    public int     TierCount            { get; set; }
    public string? PosterUrl            { get; set; }
    public DateTime? SubmittedAt        { get; set; }
    public DateTime? ReviewedAt         { get; set; }
    public string? ReviewNotes          { get; set; }
}
