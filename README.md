# New Covenant Church Ikeja — Website

The church website, built with [Next.js](https://nextjs.org) 16 (App Router), React 19 and Tailwind CSS 4. Content is managed in [Sanity](https://www.sanity.io); the Studio lives in `studio/`.

## Getting started

Requires Node.js 20+ and [pnpm](https://pnpm.io).

```bash
pnpm install
cp .env.example .env.local   # then fill in the values below
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script       | What it does                  |
| ------------ | ----------------------------- |
| `pnpm dev`   | Start the dev server          |
| `pnpm build` | Production build              |
| `pnpm start` | Serve the production build    |
| `pnpm lint`  | Run ESLint                    |

## Environment variables

| Variable                          | Purpose                                                                                     |
| --------------------------------- | ------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`   | Sanity project ID (`nxf9dblv`)                                                              |
| `NEXT_PUBLIC_SANITY_DATASET`      | Sanity dataset, defaults to `production`                                                    |
| `NEXT_PUBLIC_SANITY_API_VERSION`  | Sanity API version, defaults to `2026-10-01`                                                |
| `SANITY_REVALIDATE_SECRET`        | Shared secret for the Sanity webhook that refreshes cached content                          |
| `SANITY_API_WRITE_TOKEN`          | Sanity token with write access, used to save form submissions                               |
| `RESEND_API_KEY`                  | [Resend](https://resend.com) API key for form notification emails                           |
| `FORMS_EMAIL_FROM`                | Sender address, e.g. `New Covenant Church <forms@yourdomain.org>` — domain must be verified in Resend |
| `FORMS_EMAIL_TO`                  | Default inbox(es) for form notifications, comma-separated                                   |
| `TESTIMONY_EMAIL_TO`              | Overrides `FORMS_EMAIL_TO` for testimony submissions                                        |
| `ACADEMY_EMAIL_TO`                | Overrides `FORMS_EMAIL_TO` for academy enrolments                                           |
| `CONNECT_EMAIL_TO`                | Overrides `FORMS_EMAIL_TO` for connect form submissions                                     |
| `PRAYER_EMAIL_TO`                 | Overrides `FORMS_EMAIL_TO` for prayer requests                                              |
| `EVENTS_EMAIL_TO`                 | Overrides `FORMS_EMAIL_TO` for event registrations                                          |

## Project structure

```
app/(site)/        Pages: home, who we are, connect, events, give, online church,
                   testimony, resources (academy, publications, sermons)
app/api/revalidate Sanity webhook endpoint (on-demand cache revalidation)
app/api/chat       Online Church chat messages (polled, uncached)
components/        UI components, grouped by page/section
lib/forms/         Form submission helpers (save to Sanity + email via Resend)
sanity/            Sanity client, queries and env config used by the site
studio/            Sanity Studio (schemas, desk structure)
public/            Static assets (icons, flags, images)
```

## Content and caching

Pages fetch content from Sanity with cache tags based on document type (and slug). Set up a GROQ webhook in Sanity pointing to `https://<your-domain>/api/revalidate` with:

- **Trigger on:** create, update, delete
- **Projection:** `{ _type, "slug": slug.current }`
- **Secret:** the same value as `SANITY_REVALIDATE_SECRET`

Published changes then show up on the site without a redeploy.

## Forms

Connect, prayer requests, event registration, testimonies and academy enrolment are handled by server actions. Each submission is saved to Sanity, and testimonies and academy enrolments are also emailed to the team (with a confirmation email to the sender). A submission counts as sent if either the save or the email succeeds.

## Sanity Studio

```bash
cd studio
pnpm install
pnpm dev             # local Studio at http://localhost:3333
pnpm deploy          # deploy to https://new-covenant-ikeja.sanity.studio
pnpm schema:deploy   # deploy the schema only
```

## Deployment

Deploy the Next.js app to any host that supports Next.js (e.g. Vercel) and set the environment variables above. Add the site's domain to the Sanity project's CORS origins if the browser needs to talk to Sanity directly.
