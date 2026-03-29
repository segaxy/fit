interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const method = request.method;

  if (method === 'GET') {
    const { results } = await env.DB.prepare('SELECT * FROM todos').all();
    return Response.json(results);
  }

  if (method === 'POST') {
    const data: any = await request.json();
    const { title, due_date, reminder_time } = data;
    
    await env.DB.prepare(
      'INSERT INTO todos (title, due_date, reminder_time) VALUES (?, ?, ?)'
    ).bind(title, due_date, reminder_time).run();
    
    return Response.json({ success: true }, { status: 201 });
  }

  return new Response('Method not allowed', { status: 405 });
};
