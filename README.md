<div align="center">

# ⚡ Bijli Bill Samjho

**Apna bijli ka bill asaan Urdu mein samjhein**

[![Lovable](https://img.shields.io/badge/Built%20with-Lovable-FF6B6B?logo=lovable&logoColor=white)](https://lovable.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Gemini API](https://img.shields.io/badge/Gemini%20API-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

</div>

---

## 📑 Table of Contents

1. [Why This Exists](#why-this-exists)
2. [Features](#features)
3. [Demo Flow](#demo-flow)
4. [Tech Stack](#tech-stack)
5. [Architecture](#architecture)
6. [Project Structure](#project-structure)
7. [Getting Started](#getting-started)
8. [Environment Variables & Secrets](#environment-variables--secrets)
9. [Supabase Edge Function: explain-bill](#supabase-edge-function-explain-bill)
10. [AI System Prompt](#ai-system-prompt)
11. [Error Handling](#error-handling)
12. [Roadmap](#roadmap)
13. [Contributing](#contributing)
14. [License](#license)

---

## 🌏 Why This Exists

Pakistan mein bijli ke bills dekh kar har koi pareshan hota hai — **slabs**, **fuel price adjustment (FPA)**, **quarterly tariff adjustment**, **GST**, **electricity duty**, **TV license fee**, aur kai aur charges. Yeh terms aam aadmi ke liye bilkul samajh se bahar hain.

IESCO, LESCO, FESCO, GEPCO, MEPCO, PESCO, HESCO, QESCO, SEPCO, TESCO, ya K-Electric — har company ka bill alag format mein hota hai. Lekin masla wohi hai: **bill samajh nahi aata**.

**Bijli Bill Samjho** isi problem ko solve karta hai. Bas apne bill ki photo upload karein, aur AI aapko simple Roman Urdu mein poora bill samjha dega — kitne units use hue, total kitna banta hai, har charge ka kya matlab hai, aap kis slab mein hain, aur bill kam karne ke kya practical tareeqe hain.

No forms. No signup. No confusing paperwork. **Sirf photo upload karein, samajh jayein.**

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📤 Drag-and-Drop Upload | JPG, PNG, WebP images supported. 5MB max size. Live thumbnail preview before sending. |
| 🤖 AI-Powered Analysis | Google Gemini 2.5 Flash reads the bill and explains every charge in Roman Urdu. |
| 📱 Mobile-First Green/Teal UI | Clean, accessible interface designed for Pakistani users on phones first. |
| 🔄 Live Status Messages | Rotating friendly messages while the AI is processing your bill. |
| 📝 Structured Markdown Results | Results rendered as styled cards with clear sections and Urdu explanations. |
| 🔄 One-Tap Reset | Upload a new bill instantly with a single reset button. |
| 🔒 Secure API Key Handling | `GEMINI_API_KEY` is stored server-side only and never exposed to the frontend. |
| 🚫 No Login Required | No database, no accounts, no tracking — just a simple one-page tool. |
| 🙅 Honest AI | If a number is unreadable or the image is not a bill, the AI admits it politely instead of guessing. |

---

## 🎬 Demo Flow

```text
1. User drags or selects a photo of their electricity bill
2. Frontend validates file type and size, shows a preview
3. Image is sent as base64 to the Supabase Edge Function "explain-bill"
4. Edge Function calls Google Gemini 2.5 Flash with a fixed system prompt
5. Gemini returns a structured Roman Urdu markdown explanation
6. Frontend renders the result as clean, readable cards
7. User taps "Naya bill upload karein" to analyze another bill
```

---

## 🛠 Tech Stack

### Frontend

- **[TanStack Start](https://tanstack.com/start)** — Full-stack React framework with SSR and server functions
- **[TypeScript](https://www.typescriptlang.org/)** — Type-safe development
- **[React 19](https://react.dev/)** — UI library
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Utility-first styling

### Backend & AI

- **[Supabase Edge Functions](https://supabase.com/edge-functions)** — Serverless functions for secure AI calls
- **[Google Gemini 2.5 Flash](https://ai.google.dev/)** — Multimodal AI for image understanding and Roman Urdu generation

---

## 🏗 Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Browser)                       │
│  ┌──────────────┐   ┌──────────────┐   ┌─────────────────┐  │
│  │ File Upload  │ → │ Base64 Image │ → │  Status Spinner │  │
│  └──────────────┘   └──────────────┘   └─────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS / JSON
                             ▼
┌─────────────────────────────────────────────────────────────┐
│           Supabase Edge Function: explain-bill              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  • Receives base64 image + mime type                  │  │
│  │  • Builds Gemini payload with system prompt           │  │
│  │  • Calls Gemini 2.5 Flash generateContent API       │  │
│  │  • Returns structured Roman Urdu markdown             │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS / JSON + API Key
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                Google Gemini 2.5 Flash API                  │
└─────────────────────────────────────────────────────────────┘
```

> 🔐 **Security Note:** `GEMINI_API_KEY` is stored only as a Supabase secret and is never exposed to the frontend. Since this repository is public, the API key is never committed to source control.

---

## 📁 Project Structure

```text
.
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── components.json
├── src/
│   ├── lib/
│   │   ├── explain-bill.functions.ts   # Server function calling Gemini
│   │   ├── utils.ts                    # Utility helpers
│   │   └── ...
│   ├── routes/
│   │   ├── __root.tsx                  # Root app shell
│   │   ├── index.tsx                   # Main one-page app
│   │   └── README.md                   # TanStack routing conventions
│   ├── styles.css                      # Tailwind v4 + theme tokens
│   ├── router.tsx                      # TanStack Router setup
│   ├── server.ts                       # Server entry
│   └── start.ts                        # Start configuration
├── .lovable/
│   └── project.json
└── ...config files
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (for local Edge Functions)
- A [Google AI Studio](https://aistudio.google.com/) API key

### Local Development

```bash
# 1. Clone the repository
git clone <repository-url>
cd bijli-bill-samjho

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The app will be available at `http://localhost:8080`.

### Supabase Setup

```bash
# Link your Supabase project
supabase login
supabase link --project-ref <your-project-ref>

# Set the Gemini API key as a Supabase secret
supabase secrets set GEMINI_API_KEY=<your-gemini-api-key>

# Deploy the explain-bill Edge Function
supabase functions deploy explain-bill
```

> 💡 Replace `<your-project-ref>` and `<your-gemini-api-key>` with your actual Supabase project reference and Gemini API key.

---

## 🔐 Environment Variables & Secrets

| Variable | Required | Purpose |
|----------|----------|---------|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini API key used by the Edge Function to analyze bill images. Stored as a Supabase secret only. |
| `SUPABASE_URL` | ✅ Yes | Your Supabase project URL. Used by the frontend client. |
| `SUPABASE_ANON_KEY` | ✅ Yes | Your Supabase anonymous/public API key. Used by the frontend client for Edge Function calls. |

> ⚠️ Never commit `GEMINI_API_KEY` to your repository. It should only exist as a Supabase secret.

---

## ⚙️ Supabase Edge Function: explain-bill

The `explain-bill` Edge Function is the secure bridge between the frontend and Gemini.

### Input

```json
{
  "imageBase64": "iVBORw0KGgoAAAANSUhEUg...",
  "mimeType": "image/jpeg"
}
```

### Process

1. Validates that `imageBase64` and `mimeType` are present.
2. Reads `GEMINI_API_KEY` from Supabase secrets.
3. Sends the image to Gemini 2.5 Flash with a fixed system prompt.
4. Parses the Gemini response and extracts the Roman Urdu markdown text.

### Output

```json
{
  "text": "## Bill Summary\n\nAap ne ..."
}
```

---

## 🧠 AI System Prompt

The AI is instructed to always return the explanation in the following five sections:

| Section | Description |
|---------|-------------|
| 🧾 **Bill Summary** | Units consumed, total payable amount, billing month, and due date in 2–3 lines. |
| 💡 **Har Charge Ka Matlab** | Every line item on the bill explained in 1–2 simple sentences: energy cost, FPA, quarterly tariff adjustment, GST, electricity duty, TV license fee, FC surcharge, meter rent, arrears, late payment surcharge, etc. |
| 📊 **Aap Ki Slab** | Which tariff slab the user falls into, and a note if they are near a slab boundary where a small reduction in usage could lower the bill significantly. |
| ⚠️ **Warnings** | Flags unusually high charges, arrears, fines, or sudden spikes in usage. If everything looks normal, it says so. |
| 💰 **Bill Kam Karne Ki Tips** | 3–4 practical, personalized tips based on the user's actual usage and season. |

### Honesty Rule

> Agar photo blurry hai ya koi number parh nahi sakte, saaf likho **"yeh hissa parha nahi ja saka"** — kabhi guess kar ke ghalat number mat batana. Agar image bijli ka bill hi nahi hai, to politely Roman Urdu mein bolo ke yeh bijli ka bill nahi lagta, clear photo upload karein.

---

## 🛡 Error Handling

| Scenario | Friendly Roman Urdu Message |
|----------|------------------------------|
| Blurry or unreadable image | "Yeh hissa parha nahi ja saka. Barah-e-karam zyada clear photo upload karein." |
| File too large (over 5MB) | "File bohat bari hai. 5MB se choti image upload karein." |
| Gemini API failure | "Kuch masla ho gaya, dobara koshish karein." |
| Image is not an electricity bill | "Yeh bijli ka bill nahi lag raha. Barah-e-karam clear bijli bill ki photo upload karein." |
| Missing image data | "Image data missing. Barah-e-karam dobara upload karein." |

---

## 🗺 Roadmap

- [ ] **Multi-language support** — Pure Urdu script and English summaries
- [ ] **Bill history comparison** — Upload previous months and compare usage/trends
- [ ] **Downloadable summary card** — Save the explanation as a shareable image/PDF
- [ ] **Gas & water bill support** — Extend AI analysis to Sui Gas and water utility bills
- [ ] **Dark mode** — Toggle between light and dark themes

---

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. **Fork** the repository
2. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and commit with a clear message:
   ```bash
   git commit -m "Add feature: describe what changed"
   ```
4. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** with a clear description of your changes

Please keep the codebase clean, follow existing TypeScript conventions, and test your changes locally before submitting.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

You are free to use, modify, and distribute this project for personal or commercial purposes.

---

<div align="center">

**Bijli Bill Samjho — Pakistani bills, asaan Urdu mein.**

Made with ❤️ using [Lovable](https://lovable.dev)

</div>
