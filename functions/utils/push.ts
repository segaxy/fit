export async function pushToWechat(title: string, content: string, link?: string, webhookUrl?: string) {
  if (!webhookUrl) {
    console.warn('No webhook URL configured for WeChat push');
    return;
  }

  // Example for WeCom (企业微信) robot webhook
  const body = {
    msgtype: "text",
    text: {
      content: `${title}\n\n${content}${link ? `\n\n查看详情: ${link}` : ''}`,
      mentioned_list: ["@all"]
    }
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to push to WeChat: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error pushing to WeChat:', error);
  }
}
