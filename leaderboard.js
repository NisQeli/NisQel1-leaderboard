// Vercel serverless proxy. Set VICEROLL_API_KEY in Vercel Environment Variables.
export default async function handler(req, res) {
  if (req.method !== "GET") { res.setHeader("Allow", "GET"); return res.status(405).json({success:false,error:{message:"Method not allowed"}}); }
  const key = process.env.VICEROLL_API_KEY;
  if (!key) return res.status(500).json({success:false,error:{message:"Server API key is not configured"}});
  const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit || "50", 10) || 50));
  try {
    const upstream = await fetch(`https://api.viceroll.gg/api/v1/affiliate/leaderboard?limit=${limit}`, {headers:{"x-api-key":key},cache:"no-store"});
    const body = await upstream.json(); res.setHeader("Cache-Control","no-store"); return res.status(upstream.status).json(body);
  } catch { return res.status(502).json({success:false,error:{message:"Could not reach ViceRoll API"}}); }
}
