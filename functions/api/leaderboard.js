
export async function onRequestGet(context) {
  const apiKey = context.env.VICEROLL_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "ViceRoll API key is missing" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
     "https://api.viceroll.gg/api/v1/affiliate/leaderboard?limit=50",
      {
        headers: {
          "x-api-key": apiKey
        }
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.log("ViceRoll API status:", response.status, "Response:", JSON.stringify(data));
      return Response.json(
        { error: "ViceRoll leaderboard unavailable" },
        { status: response.status }
      );
    }

    return Response.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60"
      }
    });
  } catch (error) {
    return Response.json(
      { error: "Failed to load leaderboard" },
      { status: 502 }
    );
  }
}
