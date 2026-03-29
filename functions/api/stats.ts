interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { env } = context;
  
  // Example: fetch completions from the last 7 days
  const { results: weeklyStats } = await env.DB.prepare(
    "SELECT item_type, COUNT(*) as count FROM completions WHERE completed_at > date('now', '-7 days') GROUP BY item_type"
  ).all();

  // Example: fetch completions from the last 30 days
  const { results: monthlyStats } = await env.DB.prepare(
    "SELECT item_type, COUNT(*) as count FROM completions WHERE completed_at > date('now', '-30 days') GROUP BY item_type"
  ).all();

  return Response.json({
    weekly: weeklyStats,
    monthly: monthlyStats
  });
};
