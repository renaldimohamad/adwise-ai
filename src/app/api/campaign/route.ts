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
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = campaignSchema.parse(body);

    const ctr =
      data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0;
    const cpc = data.clicks > 0 ? data.spend / data.clicks : 0;
    const cpa = data.conversions > 0 ? data.spend / data.conversions : 0;

    // AI logic
    const prompt = `
      You are an expert digital marketing analyst. Analyze the following advertising campaign:
      Campaign Name: ${data.name}
      Platform: ${data.platform}
      Impressions: ${data.impressions}
      Clicks: ${data.clicks}
      Conversions: ${data.conversions}
      Spend: $${data.spend}
      CTR: ${ctr.toFixed(2)}%
      CPC: $${cpc.toFixed(2)}
      CPA: $${cpa.toFixed(2)}

      Provide an analysis in JSON format with exactly 3 keys:
      - "summary": A brief performance summary (1-2 sentences).
      - "issues": Any underperforming metrics, problems or red flags.
      - "recommendations": What should the user do to improve the campaign. Priority actions.

      Return ONLY valid JSON without markdown formatting.
    `;

    let aiSummary = "Summary not available.";
    let aiIssues = "No issues identified.";
    let aiRecommendations = "No recommendations.";

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const text = result.response
        .text()
        .trim()
        .replace(/```json/g, "")
        .replace(/```/g, "");
      const parsedAi = JSON.parse(text);

      aiSummary = parsedAi.summary || aiSummary;
      aiIssues = parsedAi.issues || aiIssues;
      aiRecommendations = parsedAi.recommendations || aiRecommendations;
    } catch (aiError) {
      console.error("AI Error:", aiError);
    }

    const campaign = await prisma.campaign.create({
      data: {
        userId: session.user.id,
        ...data,
        ctr,
        cpc,
        cpa,
        analyses: {
          create: {
            aiSummary,
            aiIssues,
            aiRecommendations,
          },
        },
      },
      include: {
        analyses: true,
      },
    });

    return Response.json(campaign, { status: 201 });
  } catch (error: any) {
    console.error("Campaign API Error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
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
