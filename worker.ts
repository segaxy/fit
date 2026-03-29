interface Env {
  DB: D1Database;
  WECHAT_WEBHOOK: string;
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Check for weekly report (Every Monday at 09:00)
    if (now.getDay() === 1 && currentTime === '09:00') {
      await this.sendWeeklyReport(env);
    }

    // Check for monthly report (1st of every month at 09:00)
    if (now.getDate() === 1 && currentTime === '09:00') {
      await this.sendMonthlyReport(env);
    }

    // ... existing reminder logic ...
    const { results: planResults } = await env.DB.prepare(
      'SELECT * FROM plans WHERE reminder_time = ?'
    ).bind(currentTime).all();

    for (const plan of planResults) {
      // Logic to check if today is a scheduled day for this plan (e.g. check frequency_data)
      await pushToWechat(
        `健身提醒: ${plan.title}`,
        `${plan.description || '该健身啦！'}`,
        'https://your-app.pages.dev/confirm-plan/' + plan.id,
        env.WECHAT_WEBHOOK
      );
    }

    // Check one-off activities
    const { results: activityResults } = await env.DB.prepare(
      "SELECT * FROM activities WHERE reminder_time = ? AND status = 'pending'"
    ).bind(currentTime).all();

    for (const activity of activityResults) {
      await pushToWechat(
        `健身活动提醒: ${activity.title}`,
        `${activity.description || '有个临时的健身安排哦！'}`,
        'https://your-app.pages.dev/confirm-activity/' + activity.id,
        env.WECHAT_WEBHOOK
      );
    }
  },

  async sendWeeklyReport(env: Env) {
    const result: any = await env.DB.prepare(
      "SELECT COUNT(*) as count FROM completions WHERE completed_at > date('now', '-7 days')"
    ).first();
    const count = result?.count || 0;
    await pushToWechat(
      "每周健身总结",
      `上周你一共完成了 ${count} 项健身计划！继续加油！`,
      "https://your-app.pages.dev/analysis",
      env.WECHAT_WEBHOOK
    );
  },

  async sendMonthlyReport(env: Env) {
    const result: any = await env.DB.prepare(
      "SELECT COUNT(*) as count FROM completions WHERE completed_at > date('now', '-30 days')"
    ).first();
    const count = result?.count || 0;
    await pushToWechat(
      "每月健身总结",
      `本月你一共完成了 ${count} 项健身计划！真是太棒了！`,
      "https://your-app.pages.dev/analysis",
      env.WECHAT_WEBHOOK
    );
  },
};

// Helper function (duplicate here or import if possible, but standalone workers might need it)
async function pushToWechat(title: string, content: string, link: string, webhookUrl: string) {
  const body = {
    msgtype: "text",
    text: {
      content: `${title}\n\n${content}\n\n确认完成: ${link}`,
      mentioned_list: ["@all"]
    }
  };
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}
