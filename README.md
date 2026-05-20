
# Folio — CV to Portfolio Generator

> Upload your CV. Get a stunning portfolio website. No code required.

Folio is a full-stack SaaS platform that uses AI to analyze your CV, score it, suggest improvements, and generate a complete deployable portfolio website — all in under 5 minutes.

---

## What it does

1. **Upload your CV** (PDF) → AI extracts all your data
2. **Get your score** (0–100) with honest improvement suggestions
3. **Download an improved CV** rewritten by AI with stronger language
4. **Pick a template** from 10 professionally designed portfolios
5. **Preview it live** with your real data before downloading
6. **Download one HTML file** → open in browser or deploy to Netlify in 30 seconds
7. **Share a link** → get a public URL to share your portfolio online

---

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: ASP.NET Core 8, Entity Framework Core
- **Database**: MySQL
- **AI**: Groq API — Llama 3.3 70B (free)
- **Payments**: Paymob (Egyptian gateway)
- **3D Effects**: Three.js (Pro templates)

---

## Features

- JWT authentication with password reset
- 10 portfolio templates (3 free, 7 Pro with 3D Three.js effects)
- Live template preview with your real CV data
- CV improvement suggestions (critical / improvement / optional)
- Full AI-rewritten CV download
- Portfolio sharing with public links
- Compare two CV analyses side by side
- Subscription plans: Free / Monthly / Annual / Pay Per Use
- Coupon/discount code system
- Admin dashboard with analytics charts
- Email notifications (welcome, analysis ready, Pro activated, password reset)
- Mobile responsive with hamburger menu

---

## Plans & Pricing

| Plan | Price | Analyses | Templates |
|------|-------|---------|-----------|
| Free | EGP 0 | 3/month | 3 templates |
| Monthly | EGP 199/mo | Unlimited | All 10 |
| Annual | EGP 1,499/yr | Unlimited | All 10 |
| Pay Per Use | EGP 29 | 1 | All 10 (30 days) |

---

## Quick Start

### Requirements
- Node.js 18+
- .NET 8 SDK
- MySQL

### 1. Clone the repo
```bash
git clone https://github.com/Eng-belal-amr/folio.git
cd folio
```

### 2. Setup backend
```bash
cd backend/Folio.API
```

Create `appsettings.json` (copy from `appsettings.example.json`) and fill in:
- MySQL connection string
- JWT secret (any random string, min 32 chars)
- Paymob API keys
- Email SMTP settings (optional)

```bash
dotnet restore
dotnet ef migrations add Init --output-dir Data/Migrations
dotnet ef database update
dotnet run
```
Backend runs at `http://localhost:5132`

### 3. Setup frontend
```bash
cd frontend
```

Create `.env` file:
```
VITE_API_URL=http://localhost:5132
VITE_GROQ_API_KEY=your_groq_key_here
```

Get your free Groq key at [console.groq.com](https://console.groq.com)

```bash
npm install
npm run dev
```
Frontend runs at `http://localhost:3000`

### 4. Create admin account
Register at `http://localhost:3000/register` then run:
```sql
USE folio_db;
UPDATE Users SET IsAdmin = 1 WHERE Email = 'your@email.com';
```
Log out and back in — you will be redirected to `/admin`.

---

## API Keys Needed

| Key | Where to get | Cost |
|-----|-------------|------|
| `VITE_GROQ_API_KEY` | [console.groq.com](https://console.groq.com) | Free |
| Paymob keys | [accept.paymob.com](https://accept.paymob.com) | Free signup |
| Gmail app password | Google Account → Security → App passwords | Free |

---

## Deployment

- **Frontend**: Vercel (free) — set root to `frontend/`
- **Backend**: Railway or Render (free tier) — set root to `backend/Folio.API`
- **Database**: PlanetScale (free MySQL) or Railway MySQL

---

## Project Structure

```
folio/
├── frontend/          # React + Vite
│   └── src/
│       ├── pages/     # All page components
│       ├── templates/ # 10 HTML portfolio generators
│       ├── services/  # API calls + Groq AI service
│       └── context/   # Auth state
└── backend/           # ASP.NET Core 8
    └── Folio.API/
        ├── Controllers/
        ├── Models/
        ├── Services/
        └── Data/
```

---

## Admin Dashboard

Access at `/admin` (requires admin role).

- Overview stats and revenue charts
- User management (enable/disable, grant admin)
- Template management (add/edit/delete/toggle free-pro)
- Payment history
- Coupon code management

---

## License

MIT — built by Belal Amr

---

*Full project documentation available in `PROJECT_DOCUMENTATION.md`*
EOFILE
echo "README done"
