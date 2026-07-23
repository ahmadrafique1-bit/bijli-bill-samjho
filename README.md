<div align="center">

# ⚡ Bijli Bill Samjho

**Pakistan ke bijli bills — ab Roman Urdu mein samajh aayeinge.**

[![Lovable](https://img.shields.io/badge/Built%20with-Lovable-FF6B6B?logo=lovable&logoColor=white)](https://lovable.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Gemini API](https://img.shields.io/badge/Gemini%20API-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

</div>

---

## Why I built this

Every month, ghar ke bills aate hain aur har koi yahi kehta hai: "Yeh FPA kya hai? Quarterly adjustment kyun itna zyada hai? Slab ka kya scene hai?" IESCO, LESCO, K-Electric — har company ka format alag hai, lekin confusion same hai.

I made this because I was tired of watching family members squint at electricity bills and still not understand what they were paying for. **Bijli Bill Samjho** bas itna karta hai: aap photo upload karein, aur AI aapko dost ki tarah Roman Urdu mein samjha de.

No signup. No data collection. No "please create an account first." Sirf photo, sirf samajh.

## What it actually does

- Drag ya click se bill ki photo upload karein — JPG, PNG, WebP, max 5MB.
- Thumbnail preview dikhti hai, taake confirm ho ke sahi image select hui.
- "Bill Samjhao" pe click karein, AI bill parhta hai.
- Result 5 sections mein aata hai: summary, har charge ka matlab, aap ki slab, warnings, aur bill kam karne ki tips.
- Agar photo blurry hai ya bill hi nahi hai, AI seedha kehta hai — guess nahi karta.
- Ek click se naya bill upload karein.

## How it works

1. Aap browser mein bill ki photo select karte hain.
2. Frontend image ko base64 mein convert karke server function ko bhejta hai.
3. Server function Google Gemini Flash ko image + system prompt bhejta hai.
4. Gemini Roman Urdu mein structured markdown jawab banata hai.
5. Frontend us jawab ko readable cards mein dikhata hai.

## Tech stack

- **Frontend:** TanStack Start, React, TypeScript, Tailwind CSS v4
- **AI:** Google Gemini Flash
- **Backend/Secrets:** Supabase (server function + secrets)

## Setup

You need Node 18+, npm/bun, and a Supabase project.

```bash
git clone <repo-url>
cd bijli-bill-samjho
npm install
npm run dev
```

App runs at `http://localhost:8080`.

## Supabase + Gemini setup

The AI key is kept server-side only. Yeh zaroori hai because repo public hai — API key kabhi bhi frontend ya GitHub pe nahi hona chahiye.

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase secrets set GEMINI_API_KEY=<your-gemini-api-key>
```

Then deploy the function:

```bash
supabase functions deploy explain-bill
```

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `GEMINI_API_KEY` | Yes | Gemini API key. Set as a Supabase secret, not in `.env`. |
| `SUPABASE_URL` | Yes | Supabase project URL for the frontend client. |
| `SUPABASE_ANON_KEY` | Yes | Supabase anon key for frontend Edge Function calls. |

## Known limitations

- **Image quality matters.** Blurry, crumpled, ya screenshot-of-screenshot wali photos pe AI thik se parh nahi paata.
- **Pakistani bills only.** Model ko specifically Pakistani companies ke bills ke liye train kiya gaya prompt diya hai, so international utility bills pe results weird aa sakte hain.
- **No history.** Har upload fresh hoti hai. Agar previous months compare karna ho, abhi aapko manually karna padta hai.

## License

MIT. Use it, break it, improve it — just don't blame me if your bill still shocks you.
