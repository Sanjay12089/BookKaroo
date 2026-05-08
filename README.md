# BookKaroo 🎬🎟️

India's premium entertainment ticket booking platform — movies, events, sports, plays, comedy, and IPL 2026.

## Tech Stack
- **Frontend:** React 18 + TypeScript + Vite + Tailwind + shadcn/ui
- **Backend:** .NET 8 Web API
- **Database:** Supabase (PostgreSQL)
- **Realtime:** Supabase Realtime
- **Auth:** JWT + BCrypt
- **Payments:** Razorpay (sandbox)
- **Email:** Resend
- **Movie Metadata:** TMDB

## Repository Structure
```
bookkaroo/
├── .claude/         ← Claude Code configs and slash commands
├── docs/            ← PRD, architecture, schema, API, design system
├── frontend/        ← React + TypeScript SPA
├── backend/         ← .NET 8 Web API
├── database/        ← migrations + seed scripts
├── CLAUDE.md        ← Claude project context
├── SKILLS.md        ← Coding standards
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 20+
- .NET 8 SDK
- Git
- Supabase account (free)
- Razorpay sandbox account
- Resend account
- TMDB API key

### Setup
```bash
# 1. Clone
git clone https://github.com/Sanjay12089/BookKaroo.git
cd BookKaroo

# 2. Backend
cd backend
cp .env.example .env   # fill in keys
dotnet restore
dotnet ef database update
dotnet run --project src/TicketVerse.Api

# 3. Frontend (new terminal)
cd frontend
cp .env.example .env   # fill in keys
npm install
npm run dev

# 4. Open http://localhost:5173
```

### Environment Variables
See `/docs/ARCHITECTURE.md` § 9 for the full list.

## Development Workflow
See `/docs/GIT-WORKFLOW.md`. TL;DR:
```bash
git checkout develop && git pull
git checkout -b feat/<scope>
# work, commit, push
# open PR to develop
```

## Documentation
| Doc | Purpose |
|---|---|
| [PRD.md](docs/PRD.md) | Product requirements (Phase 1 + 2) |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design, diagrams, deployment |
| [DATABASE.md](docs/DATABASE.md) | Schema + ERD + indexes |
| [API.md](docs/API.md) | REST endpoint contracts |
| [DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) | Colors, typography, components |
| [GIT-WORKFLOW.md](docs/GIT-WORKFLOW.md) | Branching strategy |

## Project Status
🚧 **Phase 1 (MVP)** — in active development.

## License
Proprietary — All rights reserved.
