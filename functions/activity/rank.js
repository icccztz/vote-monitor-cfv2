// Cloudflare Pages Function: /api/activity/rank
// 代理到 https://act.tmlyun.com/activity-api/vote/h5/activity/rank?groupId=2894

export async function onRequest(context) {
  const request = context.request;

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  const authHeader = request.headers.get('Authorization') || '';

  try {
    const response = await fetch('https://act.tmlyun.com/activity-api/vote/h5/activity/rank?groupId=2894', {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Origin': 'https://act.tmlyun.com',
        'Referer': 'https://act.tmlyun.com/',
        'Accept': 'application/json',
        'Authorization': authHeader
      }
    });

    const data = await response.text();
    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, message: '代理失败: ' + e.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
