# Folio — CV to Portfolio Generator

Turn any PDF CV into a beautiful personal portfolio website in minutes.

## Setup

1. **Get a free Groq API key**
   - Go to https://console.groq.com
   - Sign in with Google
   - Click **API Keys** → **Create API Key**
   - No credit card required, works worldwide

2. **Add your key to .env**
   ```
   VITE_GROQ_API_KEY=your-key-here
   ```

3. **Install and run**
   ```bash
   npm install
   npm run dev
   ```

## Free Tier Limits (Groq)
- 30 requests / minute
- 14,400 requests / day
- Completely free, no billing required
- Works in all countries including Egypt

## Tech Stack
- React 18 + Vite
- Tailwind CSS
- Groq API (Llama 3.3 70B)
- PDF.js for text extraction
- React Router, React Dropzone, React Hot Toast
