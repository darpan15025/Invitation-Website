# Tanya & Prabhat — Shubh Vivah (Palace Invitation)

Premium **single-page** royal Indian wedding invitation: palace gate opening, jaali hero, Ganesha vandana, Raja–Rani miniatures, scratch tithi, nimantran, karyakram, venue map, contact cards, and fireworks.

## Main files

| File | Purpose |
|------|---------|
| `index.html` | Palace invitation (full-width) |
| `shaadicanvas.html` | **JoyInvite / ShaaDiCanvas** mobile canvas theme (480px) |
| `css/palace.css` | Palace theme styles |
| `css/shaadicanvas.css` | ShaaDiCanvas theme styles |
| `js/palace.js` | Palace interactions |
| `js/shaadicanvas.js` | Opening screen, scratch, countdown, dock nav |

Assets: `assets/royal/` (Ganesha + couple art), `assets/events/` (baraat, palaki).

## Shareable link (after merge to `main`)

**https://raw.githack.com/darpan15025/Invitation-Website/main/index.html**

Preview this PR branch:

**https://raw.githack.com/darpan15025/Invitation-Website/cursor/netlify-royal-html-dc4d/index.html**

**ShaaDiCanvas-style page:** add `/shaadicanvas.html` to any branch URL above.

Sections: palace site uses `#home`, `#jodi`, …; canvas site uses `#home`, `#invitation`, `#events`, `#venue`, `#rsvp`.

**Wedding-only events:** `shaadicanvas.html` / `js/shaadicanvas.js` ab sirf **Shubh Vivah** dikhate hain — mehndi, haldi, sangeet, reception, baraat, preetibhoj, palaki sab hata diye gaye. Palace `index.html` mein bhi `#karyakram` ab ek hi vivah card hai.

JoyInvite demo (`shaadicanvas.joyinvite.in`) agar purane 5-event bundle se chal raha ho, to deploy ke waqt `events` array mein sirf `key: 'wedding'` wala item rakhein, ya render line par `.filter(e => e.key === 'wedding')` lagayein.

## Local preview

```bash
python3 -m http.server 8080 --bind 127.0.0.1
```

Open http://127.0.0.1:8080 — tap **Nimantran Kholiye** on the palace gate.

## Cloudflare Pages

- **Build command:** (empty)
- **Output directory:** `/` (repository root)

**Venue:** Goel Regency, Hapur Rd, Pilkhuwa, UP 245304  
**Date:** Monday, 14 December 2026 — Swagat Baraat 7:00 PM