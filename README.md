# 🗂️ Folio — CV to Portfolio Generator

Full-stack app: ASP.NET Core backend + React frontend.

---

## 📁 Project Structure

```
folio/
├── backend/   → ASP.NET Core 8 + MySQL
└── frontend/  → React + Vite + Tailwind
```

---

## ⚙️ BACKEND SETUP

### 1. Install requirements
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- MySQL Server (or use Railway/PlanetScale)

### 2. Configure appsettings.json
Edit `backend/Folio.API/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=folio_db;User=root;Password=YOUR_PASSWORD;"
  },
  "Jwt": {
    "Secret": "generate-a-random-32+-char-string-here",
    "Issuer": "folio-api",
    "Audience": "folio-app"
  },
  "Paymob": {
    "ApiKey": "your-paymob-api-key",
    "IntegrationId": "your-integration-id",
    "IframeId": "your-iframe-id",
    "HmacSecret": "your-hmac-secret"
  },
  "Google": {
    "ClientId": "your-google-client-id.apps.googleusercontent.com"
  },
  "Frontend": {
    "Url": "http://localhost:5173"
  }
}
```

### 3. Run migrations & start
```bash
cd backend/Folio.API
dotnet restore
dotnet ef migrations add Init
dotnet ef database update
dotnet run
```
API runs at: http://localhost:5000

### 4. Create first admin user
Register normally at http://localhost:5173/register, then run this SQL:
```sql
UPDATE Users SET IsAdmin = 1 WHERE Email = 'your@email.com';
```

---

## 🖥️ FRONTEND SETUP

### 1. Create .env file
```
VITE_API_URL=http://localhost:5000
VITE_GROQ_API_KEY=your-groq-key
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### 2. Install & run
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: http://localhost:5173

---

## 🔑 API KEYS SETUP

### Groq (AI analysis — FREE)
1. Go to https://console.groq.com
2. Sign in with Google → API Keys → Create API Key
3. Add to frontend `.env` as `VITE_GROQ_API_KEY`

---

## 🚀 DEPLOYMENT (FREE)

### Backend → Railway
1. Go to https://railway.app → sign in with GitHub
2. New Project → Deploy from GitHub repo
3. Select your repo → set root to `backend/Folio.API`
4. Add MySQL plugin (Railway provides it free)
5. Add environment variables from appsettings.json
6. Railway auto-detects .NET and deploys
7. Copy your backend URL (e.g. https://folio-api.railway.app)

### Frontend → Vercel
1. Go to https://vercel.com → sign in with GitHub
2. Import your repo → set root to `frontend`
3. Add environment variables:
   - `VITE_API_URL` = your Railway backend URL
   - `VITE_GROQ_API_KEY` = your Groq key
   - `VITE_GOOGLE_CLIENT_ID` = your Google client ID
4. Deploy → Vercel gives you a free `.vercel.app` URL

---

## 💰 HOW TO EARN

### Pricing model (already set up)
| Plan | Price | What users get |
|------|-------|----------------|
| Free | 0 | 3 analyses/month, 3 templates |
| Monthly | EGP 199/mo | Unlimited everything |
| Annual | EGP 1,499/yr | Same + 37% saving |
| Pay-Per-Use | EGP 29 | 1 analysis + 30 days access |

### Revenue streams
1. **Paymob subscriptions** — automatic, handled in the app
2. **Portfolio review service** — offer manual expert review for extra fee
3. **Custom templates** — design custom templates for clients
4. **White-label** — sell the whole platform to agencies

### To change prices
Edit `backend/Folio.API/Services/PaymobService.cs`:
```csharp
private static readonly Dictionary<string, (decimal Amount, string Name)> Plans = new()
{
    ["monthly"]   = (199_00m, "Folio Pro — Monthly"),   // 199 EGP in piasters
    ["annual"]    = (1499_00m, "Folio Pro — Annual"),
    ["payperuse"] = (29_00m, "Folio — Single Analysis"),
};
```
And update the display prices in `frontend/src/pages/dashboard/DashboardPage.jsx`.

---

## 🛠️ Admin Panel
Go to `/admin` (only works if your account has `IsAdmin = 1` in the DB).
- View stats: users, revenue, analyses
- Manage all users: disable, promote to admin
- Manage templates: add/edit/delete/toggle free or pro
- View all payments and transaction IDs

