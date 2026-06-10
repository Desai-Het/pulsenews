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

## Deploy to Vercel

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. In Vercel project settings → **Environment Variables**, add:
   - `NEWSAPI_KEY` = your key
   - `GNEWS_API_KEY` = your key
4. Deploy!

> **Important:** NewsAPI's free plan only allows `localhost` origins in development. For production/Vercel, you need their **Developer plan** ($449/mo) OR use **GNews only** (set `NEWSAPI_KEY` empty and only fill `GNEWS_API_KEY`).
> 
> **Recommended for personal use:** Just use GNews free tier (100 req/day). With 5 topics, that's 5 requests per refresh — well within limits.

---

## Project Structure

```
newsapp/
├── app/
│   ├── api/news/route.ts     # Server-side news fetching endpoint
│   ├── layout.tsx
│   ├── page.tsx              # Main app UI
│   └── globals.css
├── components/
│   ├── NewsCard.tsx          # Expandable article card with audio
│   ├── AddTopicModal.tsx     # Natural language topic input
│   ├── TopicBadge.tsx        # Color-coded topic pill
│   ├── AudioButton.tsx       # Web Speech API reader
│   └── SkeletonCard.tsx      # Loading skeleton
├── lib/
│   ├── newsFetcher.ts        # NewsAPI + GNews fetch logic
│   └── defaultTopics.ts      # 5 default topic configs
├── store/
│   └── newsStore.ts          # localStorage helpers
├── types/
│   └── index.ts
├── .env.local                # API keys (not committed)
└── .gitignore
```

---

## Customizing Topics

Default topics are defined in `lib/defaultTopics.ts`. Edit the `query` field of any topic to refine what news is fetched for it. Queries use standard boolean operators (`OR`, `AND`).

---

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS** (minimal usage, mostly CSS variables)
- **NewsAPI** + **GNews** (news data)
- **Web Speech API** (audio, built into browsers — no key needed)
- **date-fns** (time formatting)
- **uuid** (article ID generation)
