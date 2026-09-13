# Blog API Frontend

Two React apps for the Blog API platform — a public-facing user app and an author dashboard.

## Apps

### User App (`user/`)

Public blog reader — browse posts, read full articles, leave comments.

- **Dev server**: `http://localhost:5173`
- **Tech**: React 18, React Router 7, CSS Modules, Vite 6

### Author App (`author/`)

Author dashboard — create, edit, and delete posts, manage comments, toggle publish status.

- **Dev server**: `http://localhost:5174`
- **Tech**: React 18, React Router 7, CSS Modules, Vite 6, TinyMCE

## Tech Stack

- React 18 + TypeScript
- Vite 6
- React Router 7
- CSS Modules (no Tailwind)
- Vitest + Testing Library

## Setup

```bash
cd user   # or author
npm install
npm run dev
```

## Scripts

Both apps share the same scripts:

| Script     | Command            | Description                     |
| ---------- | ------------------ | ------------------------------- |
| `dev`      | `npm run dev`      | Vite dev server with hot-reload |
| `build`    | `npm run build`    | Type-check and build for prod   |
| `test`     | `npm test`         | Run tests in watch mode         |
| `test:run` | `npm run test:run` | Run tests once                  |

## Backend

See [blogapi-backend](https://github.com/STORM533/blogapi-backend) for the Express + Prisma backend this frontend connects to.
