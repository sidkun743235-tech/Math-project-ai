# Math Academy Management System

A high-performance management dashboard for coaching centers and academies.

## Features
- **Admin Dashboard**: Growth analytics, revenue tracking, student retention.
- **Student Management**: Profiles, attendance, and coaching schedules.
- **Academic Tools**: Exam creation (MCQ & subjective), automated results.
- **Communication**: Integrated WhatsApp reminders and internal chat.
- **Financials**: Payment tracking, due lists, and digital receipts.

## How to Make Live (Production)

### 1. Instant URL (Easiest)
Click the **"Share"** button in the top right of the Google AI Studio interface. This provides a direct link anyone can use.

### 2. Custom Domain (Vercel)
1. **GitHub Export**: Go to **Settings > Export to GitHub** in the AI Studio menu.
2. **Authorize**: Connect your GitHub account.
3. **Vercel Deployment**:
   - Go to [vercel.com](https://vercel.com).
   - Click **"Add New" > "Project"**.
   - Import the repository you just exported.
   - Vercel will automatically detect Vite and deploy your site for free on a `.vercel.app` domain.

### 3. Local Development
```bash
npm install
npm run dev
```

## Tech Stack
- React 19 + Vite
- Tailwind CSS (Pre-configured Utility Classes)
- Lucide React (Icons)
- Chart.js (Analytics)
- Shadcn/UI (Components)
