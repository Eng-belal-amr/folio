using Folio.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Folio.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Subscription> Subscriptions => Set<Subscription>();
    public DbSet<Analysis> Analyses => Set<Analysis>();
    public DbSet<Template> Templates => Set<Template>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<PasswordResetToken> PasswordResetTokens => Set<PasswordResetToken>();
    public DbSet<Coupon> Coupons => Set<Coupon>();
    public DbSet<SharedPortfolio> SharedPortfolios => Set<SharedPortfolio>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<User>().HasIndex(u => u.Username).IsUnique();
        modelBuilder.Entity<Template>().HasIndex(t => t.Slug).IsUnique();
        modelBuilder.Entity<Coupon>().HasIndex(c => c.Code).IsUnique();
        modelBuilder.Entity<SharedPortfolio>().HasIndex(s => s.Slug).IsUnique();

        modelBuilder.Entity<User>()
            .HasOne(u => u.Subscription)
            .WithOne(s => s.User)
            .HasForeignKey<Subscription>(s => s.UserId);

        modelBuilder.Entity<User>()
            .HasMany(u => u.Analyses)
            .WithOne(a => a.User)
            .HasForeignKey(a => a.UserId);

        modelBuilder.Entity<Template>().HasData(
            new Template { Id=1,  Slug="lumiere",  Name="Lumière",   Style="Minimal & Editorial",   Description="Clean, typographic, and timeless.",                    IsFree=true,  IsActive=true, PreviewBg="#fafaf8", PreviewHeader="#1c1a16", PreviewSkill="#d4a843", PreviewTag="#f5edd8", SortOrder=1 },
            new Template { Id=2,  Slug="verdant",  Name="Verdant",   Style="Creative & Bold",        Description="Nature-inspired with strong teal accents.",            IsFree=true,  IsActive=true, PreviewBg="#f0fafa", PreviewHeader="#2a7c7c", PreviewSkill="#3da8a8", PreviewTag="#d4eded", SortOrder=2 },
            new Template { Id=3,  Slug="nova",     Name="Nova",      Style="Dark & Futuristic",      Description="Deep dark with electric blue highlights.",             IsFree=true,  IsActive=true, PreviewBg="#0d1117", PreviewHeader="#58a6ff", PreviewSkill="#388bfd", PreviewTag="#161b22", SortOrder=3 },
            new Template { Id=4,  Slug="gilded",   Name="Gilded",    Style="Luxury & Refined",       Description="Gold accents with floating 3D crystals.",             IsFree=false, IsActive=true, PreviewBg="#1a1814", PreviewHeader="#d4a843", PreviewSkill="#e8c96b", PreviewTag="#3a3220", SortOrder=4 },
            new Template { Id=5,  Slug="aurora",   Name="Aurora",    Style="Vibrant & Modern",       Description="Violet gradients with morphing 3D blob.",             IsFree=false, IsActive=true, PreviewBg="#f7f5ff", PreviewHeader="#6b4fa8", PreviewSkill="#8e72c4", PreviewTag="#ede8f8", SortOrder=5 },
            new Template { Id=6,  Slug="blush",    Name="Blush",     Style="Warm & Approachable",    Description="Rose tones with 3D torus.",                           IsFree=false, IsActive=true, PreviewBg="#fff8f9", PreviewHeader="#c24b6e", PreviewSkill="#e06d8a", PreviewTag="#fce8ef", SortOrder=6 },
            new Template { Id=7,  Slug="slate",    Name="Slate",     Style="Bold & Structured",      Description="Blue steel with rotating 3D box.",                   IsFree=false, IsActive=true, PreviewBg="#f8fafc", PreviewHeader="#334155", PreviewSkill="#64748b", PreviewTag="#e2e8f0", SortOrder=7 },
            new Template { Id=8,  Slug="terra",    Name="Terra",     Style="Earthy & Authentic",     Description="Warm amber with 3D dodecahedron.",                   IsFree=false, IsActive=true, PreviewBg="#fdf6f0", PreviewHeader="#8b4513", PreviewSkill="#cd853f", PreviewTag="#f5e6d3", SortOrder=8 },
            new Template { Id=9,  Slug="arctic",   Name="Arctic",    Style="Ice-Cold Precision",     Description="Icy blue with 3D icosahedron.",                      IsFree=false, IsActive=true, PreviewBg="#f0f8ff", PreviewHeader="#1e3a5f", PreviewSkill="#4a90d9", PreviewTag="#ddeeff", SortOrder=9 },
            new Template { Id=10, Slug="obsidian", Name="Obsidian",  Style="Premium Dark Mode",      Description="Deep purple with 3D torus knot.",                    IsFree=false, IsActive=true, PreviewBg="#111118", PreviewHeader="#a78bfa", PreviewSkill="#7c3aed", PreviewTag="#1e1b4b", SortOrder=10 }
        );
    }
}
