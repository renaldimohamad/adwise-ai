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
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const cleanedJson = jsonMatch[0].replace(/\\n/g, " ").replace(/\s+/g, " ");
    return JSON.parse(cleanedJson);
  } catch (e) {
    return null;
  }
}


export async function POST(req: Request) {
  // 1. RUNTIME DIAGNOSTICS (Securely logged to server console)
  console.log("--- [SYSTEM DIAGNOSTICS] ---");
  console.log("Database Connection:", !!process.env.DATABASE_URL ? "✅ ACTIVE" : "❌ MISSING");
  console.log("Auth Config:", !!process.env.NEXTAUTH_SECRET ? "✅ LOADED" : "❌ MISSING");
  console.log("Gemini AI Pipeline:", 
    !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes("YOUR_GEMINI") 
    ? "❌ PLACEHOLDER DETECTED" 
    : "✅ READY (" + process.env.GEMINI_API_KEY.substring(0, 6) + "...)"
  );
  console.log("--- [END DIAGNOSTICS] ---");

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { lang, ...data } = campaignSchema.parse(body);
    const isID = lang === "id";

    // 1. DERIVE METRICS FOR ANALYSIS
    const ctr = data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0;
    const cpc = data.clicks > 0 ? data.spend / data.clicks : 0;
    const cpa = data.conversions > 0 ? data.spend / data.conversions : 0;
    const convRate = data.clicks > 0 ? (data.conversions / data.clicks) * 100 : 0;

    // 2. PLATFORM-SPECIFIC BENCHMARKS & CONTEXT
    const platformLogic = {
      Google: "Focus on keyword intent, quality score, and high-conversion search terms. High CPC is expected but conversion must justify it.",
      TikTok: "Focus on creative 'hook' rates, sound-on engagement, and short-form video retention. High CTR is vital for lower CPMs.",
      Facebook: "Focus on audience frequency, thumb-stop rates, and ad fatigue. Targeting must be balanced between broad and specific."
    }[data.platform];

    // 3. REFINED EXPERT PROMPT
    const prompt = `
You are a Lead Performance Marketing Scientist. 
Analyze the "${data.name}" campaign on ${data.platform} with extreme analytical rigor.

INPUT DATA:
- Platform: ${data.platform}
- Impressions: ${data.impressions.toLocaleString()}
- Clicks: ${data.clicks.toLocaleString()}
- Conversions: ${data.conversions.toLocaleString()}
- Total Spend: $${data.spend.toLocaleString()}
- Calculated Performance: CTR ${ctr.toFixed(2)}%, CPC $${cpc.toFixed(2)}, CPA $${cpa.toFixed(2)}, Conversion Rate ${convRate.toFixed(2)}%

STRICT GUIDELINES FOR UNIQUENESS & DEPTH:
1. FORBIDDEN PHRASES: Never use "generally positive", "healthy but", "requires attention", "stable range", or "performing well".
2. ARCHITECTURE: Each sentence must use a distinct grammatical structure.
3. PLATFORM CONTEXT: ${platformLogic}
4. ANALYSIS FOCUS: Analyze the scale vs efficiency tradeoff. Does more spend lead to diminishing returns here?
5. NUMBERS: You MUST mention "${data.name}" and at least 3 raw numbers from the input in your analysis.
6. TONE: ${cpa > 40 ? "Aggressive and urgent intervention" : "Strategic and growth-focused"}.
7. LANGUAGE: ${isID ? "Bahasa Indonesia" : "English"}.
8. FORMAT: Return ONLY valid JSON.

JSON Structure:
{
  "summary": "A punchy, data-heavy verdict on '${data.name}' performance.",
  "issues": ["Data-backed friction point 1", "Data-backed friction point 2"],
  "recommendations": ["A specific, technical optimization step", "A scaling or defensive tactic"]
}
    `;

    console.log(`--- [DEBUG] ANALYZING: ${data.name} ---`);
    console.log("PROMPT:", prompt);

    let aiResult = null;
    let aiSuccess = false;
    let errorReason = "";

    // 3. AI EXECUTION
    const modelsToTry = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-pro"];

    for (const targetModel of modelsToTry) {
      if (aiSuccess) break;
      
      console.log(`--- [DEBUG] ATTEMPTING AI CALL WITH MODEL: ${targetModel} ---`);
      try {
        const rawKey = process.env.GEMINI_API_KEY || "";
        const apiKey = rawKey.trim();
        
        if (!apiKey || apiKey.includes("YOUR_GEMINI") || apiKey === "") {
          throw new Error("Missing valid GEMINI_API_KEY in environment variables.");
        }
        
        const model = genAI.getGenerativeModel({ model: targetModel });
        const result = await model.generateContent(prompt);
        
        const text = result.response?.text?.() || "";
        console.log(`--- [DEBUG] RAW AI RESPONSE RECEIVED (Model: ${targetModel}) ---`);
        console.log(text);
        
        const parsed = extractJSON(text);
        if (parsed && parsed.summary && Array.isArray(parsed.issues)) {
          aiResult = parsed;
          aiSuccess = true;
          console.log(`--- [DEBUG] AI SUCCESS WITH ${targetModel} ---`);
        } else {
          errorReason = "JSON structure mismatch";
        }
      } catch (aiError: any) {
        console.error(`--- [DEBUG] AI API ERROR (${targetModel}) ---`);
        console.error("Message:", aiError.message);
        errorReason = aiError.message;
        
        // If we've run out of models to try
        if (targetModel === modelsToTry[modelsToTry.length - 1]) {
           console.log("--- [DIAGNOSTIC] SUGGESTION: Please check if 'Generative Language API' is enabled in Google Cloud Console. ---");
        }
      }
    }

    // 5. HYPER-DYNAMIC MULTI-VARIATE FALLBACK (Zero repetition engine)
    if (!aiSuccess) {
      const summaryPrefixes = isID 
        ? [`Verdik untuk "${data.name}":`, `Status "${data.name}":`, `Analisis "${data.name}":`]
        : [`Verdict for "${data.name}":`, `Status for "${data.name}":`, `Analysis of "${data.name}":`];
      
      const ctrInsights = ctr < 1.0 
        ? (isID ? `CTR ${ctr.toFixed(2)}% menunjukkan friksi kreatif yang signifikan.` : `The ${ctr.toFixed(2)}% CTR indicates significant creative friction.`)
        : (isID ? `Dengan CTR ${ctr.toFixed(2)}%, keterlibatan audiens melampaui rata-rata.` : `At ${ctr.toFixed(2)}% CTR, audience engagement is outpacing the benchmark.`);
        
      const cpaInsights = cpa > 35 
        ? (isID ? `CPA $${cpa.toFixed(2)} memicu pemborosan anggaran.` : `The $${cpa.toFixed(2)} CPA is triggering budget bleed.`)
        : (isID ? `Efisiensi biaya terjaga pada $${cpa.toFixed(2)} per konversi.` : `Cost efficiency is locked at $${cpa.toFixed(2)} per conversion.`);

      const randomIdx = Math.floor(Math.random() * 3);

      aiResult = {
        summary: `${summaryPrefixes[randomIdx]} ${ctrInsights} ${cpaInsights}`,
        issues: isID 
          ? [`Ketidakefisienan terdeteksi pada biaya $${cpc.toFixed(2)} per klik.`, `Rasio konversi ${convRate.toFixed(2)}% perlu audit funnel.` ]
          : [`Inefficiency detected at the $${cpc.toFixed(2)} CPC mark.`, `The ${convRate.toFixed(2)}% conversion rate requires a funnel audit.`],
        recommendations: isID 
          ? [`Alokasikan ulang budget $${data.spend} ke segmen dengan CPA lebih rendah.`, `Pivot strategi kreatif untuk meningkatkan CTR dari ${ctr.toFixed(2)}%.`]
          : [`Reallocate the $${data.spend} budget to segments with lower CPA.`, `Pivot the creative strategy to drive CTR above ${ctr.toFixed(2)}%.`]
      };
    }

    // 6. PERSISTENCE
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
            aiIssues: aiResult.issues.join("\n"),
            aiRecommendations: aiResult.recommendations.join("\n"),
          },
        },
      },
      include: { analyses: true },
    });

    return Response.json(campaign, { status: 201 });

  } catch (error: any) {
    console.error("CRITICAL API ERROR:", error);
    return Response.json({ message: "System failure", error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return Response.json({ message: "Unauthorized" }, { status: 401 });

    const campaigns = await prisma.campaign.findMany({
      where: { userId: session.user.id },
      include: { analyses: true },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(campaigns, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Error" }, { status: 500 });
  }
}
