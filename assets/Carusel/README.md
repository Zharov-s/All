# Capture Pixels | Photography Portfolio Website

A modern, high-performance photography portfolio website featuring cutting-edge 3D animations, interactive media experiences, and a full-featured content management system. Built with Next.js 16, React 19, and TypeScript.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## ✨ Key Features

### 🎬 Scroll-Expand Hero Section
- **Custom scroll-triggered media expansion** with smooth physics-based animations
- Supports video (including YouTube embeds) and images
- Mobile-optimized touch interactions with adjusted sensitivity
- Text split animations with blend modes
- Background fade transitions

### 🎠 3D Cylindrical Carousel
- **Physics-based 3D carousel** using CSS 3D transforms
- Drag-to-rotate with momentum and spring physics
- Click-to-expand modal with smooth layout animations
- Mobile-optimized drag sensitivity
- Natural motion with velocity-based interactions

### 🌐 3D Sphere Image Grid
- **Fibonacci sphere distribution** algorithm for even image coverage
- Real-time 3D rotation with mouse/touch drag
- Momentum physics with configurable decay
- Auto-rotation capability
- Collision detection to prevent image overlaps
- Depth-based scaling and fade effects
- Click-to-view modal with smooth transitions

### 🖱️ Custom Cursor with Spring Physics
- Dual-layer cursor (dot + trailing circle)
- Spring animations with configurable stiffness/damping
- Mix-blend-difference for visibility on any background
- Automatic pointer detection for interactive elements
- Desktop-only (hidden on mobile for better UX)

### ✨ Spotlight Glow Cards
- **Dynamic CSS radial gradients** that follow mouse position
- Real-time hue calculation based on cursor coordinates
- Multi-layer glow effects using CSS pseudo-elements
- Configurable color themes (blue, purple, green, red, orange)
- Mobile-optimized (disabled on touch devices)

### 🔐 Admin Dashboard & CMS
- **Full CRUD content management** system
- Password-protected with HTTP-only cookies
- Middleware-based route protection
- Real-time content updates via Supabase
- Tabbed interface for different content sections
- Server Actions for secure data operations
- Automatic cache revalidation

### ⚡ Performance Optimizations
- Smart image preloading with progress tracking
- Lazy loading for images below the fold
- Efficient re-renders with React.memo
- RequestAnimationFrame for smooth animations
- Mobile-specific optimizations
- Next.js Image optimization

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion 12
- **Database:** Supabase (PostgreSQL)
- **UI Components:** Radix UI + shadcn/ui
- **Icons:** Lucide React
- **Theme:** next-themes (dark/light mode)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for CMS functionality)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd capture-pixels
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ADMIN_PASSWORD=your_admin_password
   ```

4. **Set up Supabase database:**
   Run the SQL schema from `lib/schema.sql` in your Supabase SQL editor to create the `site_content` table.

5. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Admin Dashboard

The website includes a full-featured admin dashboard for managing all content.

### Accessing the Dashboard

1. Navigate to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Login with your admin password (default: `admin123` in development)
3. Edit content using the tabbed interface:
   - **Hero & Info:** Main hero section, contact info, services
   - **Testimonials:** Client testimonials
   - **Projects:** Portfolio projects with images and descriptions
   - **Clients Sphere:** Client logos for the 3D sphere
   - **3D Carousel:** Images for the cylindrical carousel

### Content Management

- All changes are saved directly to Supabase
- Changes are reflected immediately on the live site
- No code deployment needed for content updates
- Secure authentication with HTTP-only cookies

## 🎨 Project Structure

```
capture-pixels/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── admin/            # Admin dashboard components
│   ├── hero/             # Hero section components
│   ├── sections/         # Page sections
│   └── ui/               # Reusable UI components
├── actions/              # Server Actions
│   ├── auth.ts          # Authentication actions
│   └── content.ts       # Content management actions
├── data/                # Type definitions and defaults
│   └── site-content.ts  # Content schema
├── lib/                 # Utilities
│   ├── supabase.ts      # Supabase client
│   └── schema.sql       # Database schema
└── public/              # Static assets
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the project into [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD`
4. Deploy!

The project is optimized for Vercel's edge network and serverless functions.

### Other Platforms

This project can be deployed on any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

Make sure to set the required environment variables in your hosting platform.

## 🎯 Key Technical Achievements

- **3D Graphics:** Implemented complex 3D transformations using CSS and mathematical algorithms
- **Physics Engine:** Custom momentum and spring physics for natural interactions
- **Performance:** Optimized animations running at 60fps with efficient rendering
- **Full-Stack:** Server Actions, database integration, and secure authentication
- **Responsive:** Mobile-first design with touch-optimized interactions
- **Type-Safe:** Full TypeScript coverage with strict type checking

## 📄 License

This project is private and proprietary.

## 👤 Author

Built with ❤️ for showcasing photography work and technical skills.

---

**Note:** This is a portfolio project demonstrating advanced frontend development skills including 3D graphics, physics-based animations, and full-stack capabilities.
