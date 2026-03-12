# Modern Full-Stack Developer Portfolio Platform

Production-ready portfolio + SaaS tools + blog + admin dashboard using:

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase (Database, Auth, Storage)
- Vercel deployment

## Routes

- `/`
- `/about`
- `/projects`
- `/tools`
- `/tools/[slug]`
- `/blog`
- `/blog/[slug]`
- `/contact`
- `/admin` (protected)
- `/admin/login`

## Folder Structure

```txt
portfolio-site
├ app
│  ├ admin
│  ├ api
│  ├ blog
│  ├ contact
│  ├ projects
│  ├ tools
│  └ ...
├ components
├ sections
├ lib
├ hooks
├ utils
├ database
├ public
└ styles
```

## Supabase Schema

Run `database/schema.sql` in Supabase SQL editor.

Tables included:

- `projects`
- `tools`
- `blog_posts`
- `site_settings`
- `contact_messages`

## Environment Variables

Create local env file:

```bash
cp .env.example .env.local
```

Set:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAILS=your-admin@gmail.com
GMAIL_SMTP_USER=
GMAIL_SMTP_APP_PASSWORD=
CONTACT_FORWARD_TO_GMAIL=
```

## Development

```bash
npm install
npm run dev
```

## Production Build Check

```bash
npm run lint
npm run build
```

## Deploy to Vercel

1. Push to GitHub.
2. Import repo in Vercel.
3. Add env variables in Vercel Project Settings.
4. Connect custom domain.
5. Deploy.

## Included Features

- Android 16 inspired glassmorphism UI
- Dark mode default + light mode toggle
- Responsive mobile/tablet/desktop layout
- Smooth Framer Motion animations
- Dynamic tool and blog slug pages
- Supabase-powered contact form API
- Admin dashboard CRUD APIs
- Admin route protection middleware
- SEO metadata + OpenGraph + sitemap + robots
- Next.js Image optimization
