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
## 🚀 Advanced Features

- **Neural Engine 2.5**: Powered by Gemini 2.5 Flash for ultra-low latency, expert-level campaign diagnostics.
- **Enterprise Analytics**: Platform-specific logic for Google, Facebook, and TikTok.
- **Dual-Language Support**: Full Internationalization (i18n) for English and Bahasa Indonesia.
- **Responsive Architecture**: Pixel-perfect UI/UX across all mobile, tablet, and desktop devices.
- **Secure Authentication**: Robust JWT-based session management with NextAuth.

## 🔑 Dummy Accounts for Testing
Use these credentials to evaluate the application:

1. **Email**: `ahmad.fauzan@mailtest.com` | **Password**: `Ahmad123!`
2. **Email**: `siti.rahmawati@mailtest.com` | **Password**: `Siti123!`
3. **Email**: `rizky.pratama@mailtest.com` | **Password**: `Rizky123!`

## 💻 Running Locally

1. **Clone & Install**:
   ```bash
   git clone <repository-url>
   cd campaign-genius
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file:
   ```env
   DATABASE_URL="your-postgresql-url"
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"
   GEMINI_API_KEY="your-gemini-api-key"
   ```

3. **Initialize & Run**:
   ```bash
   npx prisma db push
   npm run dev
   ```

## 🧪 Manual AI API Testing

To verify model connectivity (Gemini 2.5 Flash):

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=YOUR_API_KEY" \
    -H 'Content-Type: application/json' \
    -X POST \
    -d '{"contents": [{"parts":[{"text": "Test campaign analysis: CTR 5%. Response in JSON."}]}]}'
```

## 📄 License
This project is licensed under the MIT License.
