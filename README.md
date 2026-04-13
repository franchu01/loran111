# Loran — Nuestro diario gastronómico

A personal restaurant logbook for two. Track restaurants you want to visit, log dining experiences, and rate them.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4
- **Prisma v5** + PostgreSQL (Neon)
- **Auth:** JWT in HTTP-only cookies (bcrypt + jose)
- **Deploy:** Vercel

## Local Setup

1. Clone and install:
   ```bash
   npm install
   ```

2. Set up `.env`:
   ```env
   DATABASE_URL="postgresql://..."   # Neon connection string
   JWT_SECRET="your-strong-random-secret"
   ```

3. Run migrations and seed:
   ```bash
   npx prisma migrate dev --name init
   npm run db:seed
   ```

4. Start dev server:
   ```bash
   npm run dev
   ```

## Deploy to Vercel

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables: `DATABASE_URL`, `JWT_SECRET`
4. Build command is already set: `npx prisma generate && next build`
5. After first deploy, run migrations manually:
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```

## Default Users

| Name | Password |
|------|----------|
| lola | 111      |
| fran | admin    |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run db:seed` | Seed database with users + sample data |
| `npm run db:migrate` | Run pending migrations |
| `npm run db:setup` | Migrate + seed |
