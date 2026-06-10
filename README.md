# PulseNews 📡

A curated, daily intelligence feed — personalized for AI, Tech, Politics, and what matters most. Built with Next.js, deployable to Vercel in minutes.

---

## Features

- **Latest 24-hour news** across 5 default topics
- **Unseen / Archive split** — fresh news first, old news on page 2
- **Add Topic** — type in plain English to add any custom topic
- **Audio read-aloud** — click the speaker icon to hear headlines or full articles (Web Speech API, no extra key needed)
- **Mark as read** — click a card to expand and mark as read, or "Mark all as read"
- **Topic filter pills** — filter by any topic inline
- **Persisted state** — read articles and custom topics survive page reloads (localStorage)
- **Auto-dedup** — same story from multiple sources is shown once

---

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo>
cd newsapp
npm install
```

### 2. Set up API keys

Copy `.env.local` (already present) and fill in real keys:

```
NEWSAPI_KEY=your_newsapi_key_here
GNEWS_API_KEY=your_gnews_api_key_here
```

**How to get keys (both are free):**

| Service | URL | Free tier |
|---------|-----|-----------|
| NewsAPI | https://newsapi.org/register | 100 req/day (dev), up to 500 on free |
| GNews | https://gnews.io/ | 100 req/day |

> GNews is a **fallback** — if NewsAPI fails for any topic, GNews is tried automatically. You can use just one if you prefer.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS** (minimal usage, mostly CSS variables)
- **NewsAPI** + **GNews** (news data)
- **Web Speech API** (audio, built into browsers — no key needed)
- **date-fns** (time formatting)
- **uuid** (article ID generation)
