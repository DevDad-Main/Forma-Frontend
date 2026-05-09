<div align="center">
  <h1>Forma — Luxury Furniture</h1>
  <p>E-commerce storefront for luxury furniture, built with React, TypeScript, and Tailwind CSS.</p>
</div>

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend:** Java (separate API server)
- **Auth:** Supabase + Google OAuth, JWT cookies
- **Payments:** Stripe
- **UI:** shadcn/ui (Radix primitives), Lucide icons
- **State:** React Context API

## Features

- Product catalog with categories (seating, tables, lighting, storage, textiles)
- Product detail pages with descriptions, dimensions, and images
- Shopping cart with quantity management and slide-out drawer
- User authentication (email/password + Google OAuth)
- Wishlist management
- Stripe checkout (Payment Element + session-based)
- PDF invoice generation for orders
- Admin panel for product management (CRUD)
- Dark mode support
- Responsive design

## Getting Started

### Prerequisites

- Node.js (LTS)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Starts the Vite dev server with HMR. The app proxies API requests to `http://localhost:8080/api` by default.

### Build

```bash
npm run build
```

Runs TypeScript checking then builds for production to `dist/`.

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

Runs ESLint across all `.ts`/`.tsx` files with zero warning tolerance.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8080/api` | Backend API base URL |
| `VITE_BASE_PATH` | `/` | Deployment base path |

## Project Structure

```
src/
├── components/   # UI primitives, layout, cart, auth, products, payment, admin
├── pages/        # Route-level pages (Home, Shop, Checkout, Wishlist, Profile, Admin)
├── context/      # AuthContext, StoreContext (cart, wishlist, dark mode)
├── hooks/        # Custom hooks (use-mobile)
├── lib/          # Axios client, API functions, utilities
├── data/         # Sample product data
├── services/     # Invoice generation (jsPDF)
└── types/        # TypeScript type definitions
```

## Deployment

The project includes a `vercel.json` for SPA routing on Vercel. All routes rewrite to `/` for client-side routing support.

## License

MIT — Copyright 2026 Oliver Metz
