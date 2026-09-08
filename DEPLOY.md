# Deploying to Vercel

This is a standard Next.js 14 (App Router) app — a zero-config deploy on Vercel.
The Vercel config lives in `vercel.json`; Puppeteer's Chromium download is
skipped during install via `.npmrc` (the profile PDF is pre-generated and
committed, so the browser binary is never needed in CI).

## Option A — Connect the GitHub repo (recommended: auto-deploy on push)

1. Go to https://vercel.com/new and sign in (GitHub).
2. Import the repository: `vasistasandeep/vs-profile`.
3. Framework preset: **Next.js** (auto-detected). Leave build/install defaults;
   `vercel.json` already sets `next build` / `npm install`.
4. Click **Deploy**. First build produces a `https://<project>.vercel.app` URL.
5. Every push to `main` now auto-deploys; pull requests get preview URLs.

## Option B — Deploy from this machine with the Vercel CLI

The CLI is installed (verify with `vercel --version`).

```bash
# from the project root
vercel login          # one-time, opens browser auth
vercel                # first run links the project + creates a preview deploy
vercel --prod         # promote to production
```

## Custom domain (vasistasandeep.in)

The SEO metadata + JSON-LD use `https://vasistasandeep.in` as the canonical
site URL, so point the domain at Vercel after the first deploy:

1. Vercel dashboard -> Project -> **Settings -> Domains** -> add
   `vasistasandeep.in` (and `www.vasistasandeep.in`).
2. Update DNS at your registrar per Vercel's instructions:
   - Apex `vasistasandeep.in` -> Vercel A record (or ALIAS/ANAME), and
   - `www` -> CNAME `cname.vercel-dns.com`.
3. Vercel provisions HTTPS automatically once DNS resolves.

## Before you go live — checklist

- [ ] Replace the placeholder headshot: save your real photo as
      `public/vasista-headshot.jpg` (square, >= 400x400), commit, push.
- [ ] Replace the placeholder social image: `public/og-image.png` (1200x630).
- [ ] (Optional) Regenerate the profile PDF after any resume edit:
      `PUPPETEER_SKIP_DOWNLOAD=false npm install` once (to fetch Chromium
      locally), then `npm run generate:profile`, then commit the updated PDF.
- [ ] Contact form is wired to the live Formspree endpoint (`mrpgyepg`) — no
      env vars or secrets required.

## Notes

- No environment variables are required to deploy.
- No server API routes or secrets; the contact form posts client-side to a
  public Formspree form URL.
- `.next/`, `node_modules/`, and env files are git-ignored and never deployed
  from source (Vercel builds fresh).
