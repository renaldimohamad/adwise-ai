# AdWise AI - Advanced Ads Optimization Advisor

AdWise AI is a premium, AI-powered advertising campaign analysis and optimization SaaS designed to help advertisers master their cross-platform metrics (Facebook, Google, TikTok). It eliminates guesswork by analyzing cross-platform metrics to deliver enterprise-grade insights that scale performance instantly.

## 🚀 Live Demo
[AdWise AI Live Demo](https://campaign-genius.vercel.app)

## ✨ Features
- **AI-Powered Diagnostics**: Instant identification of performance leakage and inefficiency.
- **Visual Performance Analytics**: Custom animated SVG charts for trend analysis and growth trajectory.
- **Bento Grid Metrics**: Perfectly aligned CPA, CPC, and CTR architecture.
- **Cross-Platform Support**: Specialized analysis for Facebook Ads, Google Search, and TikTok Spark.
- **Intelligence Archive**: Complete history of analyzed campaigns with search and filtering.
- **Premium UI/UX**: Modern glassmorphism design, smooth page transitions, and responsive mobile experience.
- **Neural Authentication**: Secure access with unified login and registration.

## 🛠 Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, Framer Motion
- **Styling**: Tailwind CSS 4, Lucide React
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **AI**: Google Generative AI (Gemini)

## 🔑 Dummy Accounts for Testing
Use these credentials to evaluate the application:

1. **Email**: `ahmad.fauzan@mailtest.com` | **Password**: `Ahmad123!`
2. **Email**: `siti.rahmawati@mailtest.com` | **Password**: `Siti123!`
3. **Email**: `rizky.pratama@mailtest.com` | **Password**: `Rizky123!`

## 💻 Running Locally

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd campaign-genius
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/db"
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"
   GEMINI_API_KEY="your-gemini-api-key"
   ```

4. **Initialize Database**:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📄 License
This project is licensed under the MIT License.
