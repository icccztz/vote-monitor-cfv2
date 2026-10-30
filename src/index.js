// Cloudflare Worker - 投票监测
// 同时处理静态文件服务和 API 代理

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // API 代理：所有 /api/ 开头的请求转发到投票活动服务器
    if (url.pathname.startsWith('/api/')) {
      return handleApi(request, url);
    }

    // 其他请求：返回静态文件（public 目录）
    return env.ASSETS.fetch(request);
  }
};

async function handleApi(request, url) {
  // CORS 预检
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  // 去掉 /api 前缀，拼接到目标 API
  // /api/auth/userLogin -> /activity-api/vote/h5/auth/userLogin
  const targetPath = url.pathname.replace(/^\/api/, '');
  const fullUrl = 'https://act.tmlyun.com/activity-api/vote/h5' + targetPath + url.search;

  const headers = new Headers(request.headers);
  headers.set('host', 'act.tmlyun.com');
  headers.set('origin', 'https://act.tmlyun.com');
  headers.set('referer', 'https://act.tmlyun.com/');
  headers.set('accept', 'application/json');
  headers.set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

  const body = request.method === 'POST' ? await request.text() : undefined;

  try {
    const response = await fetch(fullUrl, {
      method: request.method,
      headers,
      body
    });

    const data = await response.text();
    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
