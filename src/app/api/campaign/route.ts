import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

const campaignSchema = z.object({
  name: z.string().min(1),
  platform: z.enum(["Facebook", "Google", "TikTok"]),
  impressions: z.number().min(0),
  clicks: z.number().min(0),
  conversions: z.number().min(0),
  spend: z.number().min(0),
  lang: z.string().optional().default("en"),
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Helper to safely extract and parse JSON from AI response
function extractJSON(text: string) {
  if (!text) return null;
  try {
    // Robustly find JSON object even if surrounded by text or markdown
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    
    // Clean potential markdown or extra artifacts
    const cleanedJson = jsonMatch[0]
      .replace(/\\n/g, " ")
      .replace(/\s+/g, " ");

    return JSON.parse(cleanedJson);
  } catch (e) {
    console.error("JSON Extraction Crash Prevented:", e);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { lang, ...data } = campaignSchema.parse(body);

    const isID = lang === "id";

    // Calculate metrics
    const ctr = data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0;
    const cpc = data.clicks > 0 ? data.spend / data.clicks : 0;
    const cpa = data.conversions > 0 ? data.spend / data.conversions : 0;

    // AI Prompt construction
    const prompt = `
You are a digital marketing expert.
Analyze the following campaign data and return ONLY valid JSON.

STRICT RULE:
- Do NOT include explanations
- Do NOT include markdown
- Do NOT include text before or after JSON

Format:
{
  "summary": "...",
  "issues": ["...", "..."],
  "recommendations": ["...", "..."]
}

Campaign Data:
- Platform: ${data.platform}
- Impressions: ${data.impressions}
- Clicks: ${data.clicks}
- Conversions: ${data.conversions}
- Spend: ${data.spend} USD
- Metrics: CTR ${ctr.toFixed(2)}%, CPC ${cpc.toFixed(2)}, CPA ${cpa.toFixed(2)}

Make sure:
- Provide response in ${isID ? "Bahasa Indonesia" : "English"}
- Be specific and insightful
    `;

    // Localized Fallback
    let aiResult = {
      summary: isID 
        ? "Gagal menghasilkan analisis saat ini. Silakan coba lagi nanti." 
        : "Unable to generate analysis at the moment. Please try again later.",
      issues: isID
        ? ["Gangguan pada sistem AI", "Koneksi terputus atau kuota habis"]
        : ["AI system disruption", "Connection lost or quota exceeded"],
      recommendations: isID
        ? ["Coba kirim ulang formulir", "Hubungi admin jika masalah berlanjut"]
        : ["Please resubmit the form", "Contact admin if issues persist"]
    };

    // 1. CACHING: Check for duplicate campaign analysis from this user
    try {
      const existingCampaign = await prisma.campaign.findFirst({
        where: {
          userId: session.user.id,
          name: data.name,
          platform: data.platform,
          impressions: data.impressions,
          clicks: data.clicks,
          conversions: data.conversions,
          spend: data.spend
        },
        include: { analyses: true },
        orderBy: { createdAt: "desc" }
      });

      if (existingCampaign && existingCampaign.analyses.length > 0) {
        console.log("Returning cached analysis for:", data.name);
        return Response.json(existingCampaign, { status: 200 });
      }
    } catch (cacheError) {
      console.error("Cache lookup failed:", cacheError);
    }

    // 2. AI ANALYSIS WITH RETRY LOGIC
    let attempts = 0;
    const maxAttempts = 2;
    let aiSuccess = false;

    while (attempts < maxAttempts && !aiSuccess) {
      attempts++;
      try {
        if (!process.env.GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");
        
        console.log(`AI Call attempt ${attempts} for:`, data.name);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        
        const text = result.response?.text?.() || "";
        const parsed = extractJSON(text);
        
        if (parsed && parsed.summary && Array.isArray(parsed.issues)) {
          aiResult = parsed;
          aiSuccess = true;
          console.log(`AI Success on attempt ${attempts}`);
        }
      } catch (aiError: any) {
        console.error(`AI Attempt ${attempts} failed:`, aiError.message);
        if (attempts < maxAttempts) await new Promise(r => setTimeout(r, 1000)); // Wait before retry
      }
    }

    // 3. RULE-BASED FALLBACK (Integrated if AI fails)
    if (!aiSuccess) {
      console.log("Executing Rule-Based Fallback Analysis");
      const ctrStatus = ctr > 1.5 ? "Good" : "Low";
      const cpaStatus = cpa < 20 ? "Healthy" : "High";
      
      aiResult = {
        summary: isID 
          ? `Performa kampanye Anda secara umum ${ctrStatus === "Good" ? "positif" : "butuh perhatian"}. CTR berada di angka ${ctr.toFixed(2)}% dengan CPA $${cpa.toFixed(2)}.`
          : `Your campaign performance is generally ${ctrStatus === "Good" ? "positive" : "requires attention"}. CTR is at ${ctr.toFixed(2)}% with a CPA of $${cpa.toFixed(2)}.`,
        issues: isID
          ? [
              ctr < 1 ? "Tingkat Klik (CTR) di bawah standar 1%" : "CTR sudah baik tapi bisa dioptimalkan",
              cpa > 30 ? "Biaya Akuisisi (CPA) terasa cukup mahal" : "Biaya per konversi terpantau stabil"
            ]
          : [
              ctr < 1 ? "Click-Through Rate (CTR) is below 1% benchmark" : "CTR is healthy but creative rotation is advised",
              cpa > 30 ? "Cost Per Acquisition (CPA) is reaching upper limits" : "Cost per conversion is within stable range"
            ],
        recommendations: isID
          ? [
              "Lakukan A/B testing pada materi kreatif untuk meningkatkan CTR",
              "Optimalkan penargetan audiens untuk menurunkan CPA"
            ]
          : [
              "Perform A/B testing on ad creatives to improve engagement",
              "Refine audience targeting to lower the CPA further"
            ]
      };
    }

    // 4. DATA NORMALIZATION
    const finalIssues = Array.isArray(aiResult.issues) 
      ? aiResult.issues.filter(Boolean).join("\n") 
      : String(aiResult.issues || "");
    const finalRecs = Array.isArray(aiResult.recommendations) 
      ? aiResult.recommendations.filter(Boolean).join("\n") 
      : String(aiResult.recommendations || "");

    // 5. DATABASE PERSISTENCE
    try {
      const campaign = await prisma.campaign.create({
        data: {
          userId: session.user.id,
          ...data,
          ctr,
          cpc,
          cpa,
          analyses: {
            create: {
              aiSummary: aiResult.summary,
              aiIssues: finalIssues,
              aiRecommendations: finalRecs,
            },
          },
        },
        include: {
          analyses: true,
        },
      });

      return Response.json(campaign, { status: 201 });
    } catch (dbError: any) {
      console.error("Database Save Error:", dbError.code, dbError.message);
      
      if (dbError.code === 'P2024') {
        return Response.json({ 
          message: "Database busy (Connection Timeout). Please try again in a few seconds.",
          error: "P2024"
        }, { status: 503 });
      }
      
      throw dbError; // re-throw to be caught by outer catch
    }
  } catch (error: any) {
    console.error("Campaign API Global Error:", error);
    return Response.json({ message: "Request failed" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const campaigns = await prisma.campaign.findMany({
      where: { userId: session.user.id },
      include: { analyses: true },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(campaigns, { status: 200 });
  } catch (error: any) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
