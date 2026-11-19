# Tanya & Prabhat — Royal Indian Wedding Invitation

Static wedding invitation site with a **premium royal Indian miniature** look (deep maroon, zari gold, ivory panels), ornate Ganesha artwork, bride & groom portraits, scratch-to-reveal date, goddess murti photos, event miniatures, Google Maps, sparkles, and aatishbaazi (fireworks).

## Shareable link (live now)

**https://raw.githack.com/darpan15025/Invitation-Website/main/index.html**

Use hash routes, e.g. `#jodi`, `#shubh-tithi`, `#sthal`.

For a custom **Cloudflare Pages** URL (`*.pages.dev`), connect this repo in the Cloudflare dashboard or add `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` to GitHub Actions secrets.

## Local preview

```bash
python3 -m http.server 8080 --bind 127.0.0.1
```

Open http://127.0.0.1:8080

## Deploy on Cloudflare Pages

### Option A — Git (recommended)

1. Push this repo to GitHub.
2. In [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select `Invitation-Website`, branch `main` (or your feature branch).
4. Build settings:
   - **Framework preset:** None
   - **Build command:** (leave empty)
   - **Build output directory:** `/` (repository root)
5. Deploy. Your public URL will be `https://<project-name>.pages.dev`.

### Option B — Wrangler CLI

```bash
npx wrangler pages deploy . --project-name=tanya-prabhat-wedding
```

Requires `CLOUDFLARE_API_TOKEN` and account access.

## Sections

| Route | Content |
|-------|---------|
| `#ghar` | Hero, deities, fairy lights |
| `#jodi` | Formal nimantan |
| `#shubh-tithi` | Scratch card + countdown |
| `#karyakram` | Baraat, Preetibhoj, Palkein |
| `#sthal` | Goel Regency + map |
| `#sampark` | Contact & WhatsApp |

**Venue:** Goel Regency, Hapur Rd, Pilkhuwa, Uttar Pradesh 245304  
**Date:** Monday, 14 December 2026, 7:00 PM