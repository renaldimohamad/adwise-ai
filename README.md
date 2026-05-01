# <p align="center">✨ AdWise AI — Master Your Campaigns</p>

<p align="center">
  <img src="./public/images/banner.png" alt="AdWise AI Banner" width="100%" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15+-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Gemini_AI-Flash_2.5-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Gemini AI" />
</p>

---

### 🚀 Overview
**AdWise AI** is a high-performance, AI-driven SaaS platform engineered for modern advertisers. It provides enterprise-grade campaign diagnostics, cross-platform performance tracking (Facebook, Google, TikTok), and actionable AI insights to maximize ROI and scale performance instantly.

> [!TIP]
> **Built by Renaldi Mohamad** — A premium solution for data-driven marketing.

---

### 💎 Key Features
- **🧠 Neural Diagnostics**: Instant performance analysis using Gemini 2.5 Flash.
- **📊 Advanced Visuals**: Interactive SVG charts and growth trajectory mapping via Recharts.
- **🍱 Bento Grid Architecture**: Clean, high-density metric visualization for CPA, CPC, and CTR.
- **🌐 Global Reach**: Seamless multi-language support (English & Bahasa Indonesia).
- **🔒 Enterprise Security**: Secure session management via NextAuth and PostgreSQL.
- **📱 Fluid UI/UX**: Premium glassmorphism design with Framer Motion animations.

---

### 🛠 Tech Stack
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Database**: [Prisma ORM](https://www.prisma.io/) with PostgreSQL
- **AI Engine**: [Google Gemini 2.5 Flash](https://ai.google.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)

---

### 🛠 Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/renaldimohamad/campaign-genius.git
   cd campaign-genius
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/adwise"
   NEXTAUTH_SECRET="your-super-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   GEMINI_API_KEY="your-gemini-api-key"
   ```

4. **Initialize Database**:
   ```bash
   npx prisma db push
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

---

### 🧪 API Connectivity Test
Test the Gemini 2.5 Flash integration directly:
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=YOUR_API_KEY" \
    -H 'Content-Type: application/json' \
    -X POST \
    -d '{"contents": [{"parts":[{"text": "Analyze this: CPC $1.2, CTR 3.5%. Give suggestions in JSON."}]}]}'
```

---

### 👤 Developer
Built with ❤️ by **Renaldi Mohamad**

---

### 📄 License
This project is licensed under the MIT License.

