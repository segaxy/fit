interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const method = request.method;

  if (method === 'GET') {
    const { results } = await env.DB.prepare('SELECT * FROM plans').all();
    return Response.json(results);
  }

  if (method === 'POST') {
    const data: any = await request.json();
    const { title, description, type, frequency_data, reminder_time } = data;
    
    await env.DB.prepare(
      'INSERT INTO plans (title, description, type, frequency_data, reminder_time) VALUES (?, ?, ?, ?, ?)'
    ).bind(title, description, type, JSON.stringify(frequency_data), reminder_time).run();
    
    return Response.json({ success: true }, { status: 201 });
  }

  return new Response('Method not allowed', { status: 405 });
};
