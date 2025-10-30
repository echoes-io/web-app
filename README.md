# Echoes Web App

Web application for the Echoes narrative platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL

# Setup database
npm run db:push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

Complete documentation is available in the [`docs/`](./docs) folder:

- **[README.md](./docs/README.md)** - Main documentation, tech stack, architecture
- **[DATABASE.md](./docs/DATABASE.md)** - Database schema and query patterns
- **[COMPONENTS.md](./docs/COMPONENTS.md)** - UI components guide
- **[DEVELOPMENT.md](./docs/DEVELOPMENT.md)** - Development patterns and best practices

## 🛠 Tech Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Drizzle ORM** + PostgreSQL (Neon)
- **Tailwind CSS 4** + shadcn/ui
- **Biome** (linter/formatter)

## 📜 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # Lint code
npm run format       # Format code
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:push      # Push schema (dev only)
npm run db:studio    # Open Drizzle Studio
```

## 🏗 Project Structure

```
web-app/
├── app/           # Next.js App Router
├── components/    # React components
├── lib/           # Utilities & database
├── drizzle/       # Database migrations
├── docs/          # Documentation
└── public/        # Static assets
```

## 🔗 Links

- **Production**: [echoes.io](https://echoes.io)
- **Staging**: [staging.echoes.io](https://staging.echoes.io)
- **Drizzle Studio**: `npm run db:studio`
