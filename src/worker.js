// Copyright (c) 2025-2026 BlackRoad OS, Inc. All Rights Reserved.
// Proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.
// BlackRoad OS, Inc. — Delaware C-Corp — blackroad.io

// Security headers for all responses
function addSecurityHeaders(response) {
  const h = new Headers(response.headers);
  h.set('X-Content-Type-Options', 'nosniff');
  h.set('X-Frame-Options', 'SAMEORIGIN');
  h.set('X-XSS-Protection', '1; mode=block');
  h.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  h.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return new Response(response.body, { status: response.status, headers: h });
}

// BlackRoad Pricing — pricing.blackroad.io
// D1 binding: DB (roundtrip), AI binding: AI

const PLANS = [
  {
    id: 'free', name: 'Free', price: 0, period: '',
    tagline: 'Start building with sovereign AI',
    cta: 'Get Started Free', ctaLink: 'https://chat.blackroad.io?plan=free',
    features: [
      { name: 'Fleet AI access', included: true },
      { name: '10 conversations/day', included: true },
      { name: 'Community chat rooms', included: true },
      { name: 'Agent Directory access', included: true },
      { name: 'BlackCast Live viewer', included: true },
      { name: 'API access (100 req/day)', included: true },
      { name: 'Bring Your Own Key', included: false },
      { name: 'Portable agent persona', included: false },
      { name: 'Priority inference', included: false },
      { name: 'Team workspaces', included: false },
      { name: 'SLA guarantee', included: false },
      { name: 'Dedicated support', included: false },
    ]
  },
  {
    id: 'pro', name: 'Pro', price: 9, period: '/mo',
    tagline: 'Unlimited AI with your own agent',
    cta: 'Start Pro Trial', ctaLink: 'https://chat.blackroad.io?plan=pro',
    highlight: true,
    features: [
      { name: 'Fleet AI access', included: true },
      { name: 'Unlimited conversations', included: true },
      { name: 'All chat rooms + private', included: true },
      { name: 'Agent Directory access', included: true },
      { name: 'BlackCast Live + create events', included: true },
      { name: 'API access (10K req/day)', included: true },
      { name: 'Bring Your Own Key', included: true },
      { name: 'Portable agent persona', included: true },
      { name: 'Priority inference', included: true },
      { name: 'Team workspaces', included: false },
      { name: 'SLA guarantee', included: false },
      { name: 'Dedicated support', included: false },
    ]
  },
  {
    id: 'enterprise', name: 'Enterprise', price: 49, period: '/mo',
    tagline: 'Full fleet for your team',
    cta: 'Contact Sales', ctaLink: 'https://chat.blackroad.io?plan=enterprise',
    features: [
      { name: 'Fleet AI access', included: true },
      { name: 'Unlimited conversations', included: true },
      { name: 'All rooms + custom channels', included: true },
      { name: 'Agent Directory + custom agents', included: true },
      { name: 'BlackCast Live + private events', included: true },
      { name: 'API access (unlimited)', included: true },
      { name: 'Bring Your Own Key', included: true },
      { name: 'Portable agent persona', included: true },
      { name: 'Priority inference', included: true },
      { name: 'Team workspaces (up to 25)', included: true },
      { name: 'SLA guarantee (99.9%)', included: true },
      { name: 'Dedicated support', included: true },
    ]
  }
];

const STYLES = `
*{margin:0;padding:0;box-sizing:border-box}
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');
body{background:#000;color:#e0e0e0;font-family:'Inter',sans-serif;min-height:100vh;padding-top:48px}
h1,h2,h3{font-family:'Space Grotesk',sans-serif;color:#fff}
.container{max-width:1100px;margin:0 auto;padding:24px 16px}
.header{text-align:center;padding:48px 0 40px}
.logo-row{display:flex;justify-content:center;gap:8px;margin-bottom:20px}
.dot{width:12px;height:12px;border-radius:50%}
h1{font-size:36px;font-weight:700;letter-spacing:-1px;margin-bottom:8px}
.subtitle{color:#888;font-size:16px;max-width:500px;margin:0 auto}
.plans{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;margin:40px 0}
.plan{background:#0a0a0a;border:1px solid #1a1a1a;border-radius:16px;padding:32px 28px;display:flex;flex-direction:column}
.plan.highlight{border-color:#FF1D6C;position:relative}
.plan.highlight::before{content:'Most Popular';position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:#FF1D6C;color:#fff;font-size:11px;font-weight:700;padding:4px 14px;border-radius:20px;font-family:'Space Grotesk',sans-serif}
.plan-name{font-size:20px;font-weight:700;color:#fff;margin-bottom:4px}
.plan-tagline{font-size:13px;color:#888;margin-bottom:20px}
.plan-price{font-size:42px;font-weight:700;color:#fff;margin-bottom:4px;font-family:'Space Grotesk',sans-serif}
.plan-price span{font-size:16px;color:#888;font-weight:400}
.plan-period{font-size:13px;color:#666;margin-bottom:24px}
.features{flex:1;margin-bottom:24px}
.feature{display:flex;align-items:center;gap:10px;padding:7px 0;font-size:14px}
.feature .check{width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0}
.feature .check.yes{background:#00E67620;color:#00E676}
.feature .check.no{background:#33333340;color:#555}
.btn{display:block;width:100%;padding:14px;border:none;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer;text-align:center;text-decoration:none;font-family:'Space Grotesk',sans-serif;transition:opacity .2s}
.btn:hover{opacity:.85}
.btn-free{background:#1a1a1a;color:#fff;border:1px solid #333}
.btn-pro{background:#FF1D6C;color:#fff}
.btn-enterprise{background:#2979FF;color:#fff}
.compare{margin:60px 0}
.compare h2{text-align:center;margin-bottom:24px;font-size:24px}
.table-wrap{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:14px}
th{text-align:left;padding:12px 16px;border-bottom:1px solid #222;color:#888;font-weight:500;font-size:12px;text-transform:uppercase;letter-spacing:.5px}
td{padding:10px 16px;border-bottom:1px solid #111}
td:not(:first-child){text-align:center;width:120px}
.faq{margin:60px 0}
.faq h2{text-align:center;margin-bottom:24px}
.faq-item{border-bottom:1px solid #151515;padding:16px 0}
.faq-q{font-weight:600;color:#fff;cursor:pointer;font-size:15px}
.faq-a{color:#888;font-size:14px;margin-top:8px;line-height:1.6;display:none}
.faq-item.open .faq-a{display:block}
.footer{text-align:center;padding:40px 0;border-top:1px solid #111;color:#555;font-size:13px}
`;

function html() {
  const allFeatureNames = PLANS[2].features.map(f => f.name);
  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Pricing - BlackRoad</title>
<style>${STYLES}
#br-nav{position:fixed;top:0;left:0;right:0;z-index:9999;background:rgba(0,0,0,0.92);backdrop-filter:blur(12px);border-bottom:1px solid #1a1a1a;font-family:'Space Grotesk',-apple-system,sans-serif}#br-nav .ni{max-width:1200px;margin:0 auto;padding:0 20px;height:48px;display:flex;align-items:center;justify-content:space-between}#br-nav .nl{display:flex;align-items:center;gap:12px}#br-nav .nb{color:#666;font-size:12px;padding:6px 8px;border-radius:6px;display:flex;align-items:center;cursor:pointer;border:none;background:none;transition:color .15s}#br-nav .nb:hover{color:#f5f5f5}#br-nav .nh{text-decoration:none;display:flex;align-items:center;gap:8px}#br-nav .nm{display:flex;gap:2px}#br-nav .nm span{width:6px;height:6px;border-radius:50%}#br-nav .nt{color:#f5f5f5;font-weight:600;font-size:14px}#br-nav .ns{color:#333;font-size:14px}#br-nav .np{color:#999;font-size:13px}#br-nav .nk{display:flex;align-items:center;gap:4px;overflow-x:auto;scrollbar-width:none}#br-nav .nk::-webkit-scrollbar{display:none}#br-nav .nk a{color:#888;text-decoration:none;font-size:12px;padding:6px 10px;border-radius:6px;white-space:nowrap;transition:color .15s,background .15s}#br-nav .nk a:hover{color:#f5f5f5;background:#111}#br-nav .nk a.ac{color:#f5f5f5;background:#1a1a1a}#br-nav .mm{display:none;background:none;border:none;color:#888;font-size:20px;cursor:pointer;padding:6px}#br-dd{display:none;position:fixed;top:48px;left:0;right:0;background:rgba(0,0,0,0.96);backdrop-filter:blur(12px);border-bottom:1px solid #1a1a1a;z-index:9998;padding:12px 20px}#br-dd.open{display:flex;flex-wrap:wrap;gap:4px}#br-dd a{color:#888;text-decoration:none;font-size:13px;padding:8px 14px;border-radius:6px;transition:color .15s,background .15s}#br-dd a:hover,#br-dd a.ac{color:#f5f5f5;background:#111}@media(max-width:768px){#br-nav .nk{display:none}#br-nav .mm{display:block}}
</style></head><body>
<nav id="br-nav"><div class="ni"><div class="nl"><button class="nb" onclick="history.length>1?history.back():location.href='https://blackroad.io'" title="Back">&larr;</button><a href="https://blackroad.io" class="nh"><div class="nm"><span style="background:#FF6B2B"></span><span style="background:#FF2255"></span><span style="background:#CC00AA"></span><span style="background:#8844FF"></span><span style="background:#4488FF"></span><span style="background:#00D4FF"></span></div><span class="nt">BlackRoad</span></a><span class="ns">/</span><span class="np">Pay</span></div><div class="nk"><a href="https://blackroad.io">Home</a><a href="https://chat.blackroad.io">Chat</a><a href="https://search.blackroad.io">Search</a><a href="https://tutor.blackroad.io">Tutor</a><a href="https://pay.blackroad.io" class="ac">Pay</a><a href="https://canvas.blackroad.io">Canvas</a><a href="https://cadence.blackroad.io">Cadence</a><a href="https://video.blackroad.io">Video</a><a href="https://radio.blackroad.io">Radio</a><a href="https://game.blackroad.io">Game</a><a href="https://roadtrip.blackroad.io">Agents</a><a href="https://roadcode.blackroad.io">RoadCode</a><a href="https://hq.blackroad.io">HQ</a><a href="https://app.blackroad.io">Dashboard</a></div><button class="mm" onclick="document.getElementById('br-dd').classList.toggle('open')">&#9776;</button></div></nav><div id="br-dd"><a href="https://blackroad.io">Home</a><a href="https://chat.blackroad.io">Chat</a><a href="https://search.blackroad.io">Search</a><a href="https://tutor.blackroad.io">Tutor</a><a href="https://pay.blackroad.io" class="ac">Pay</a><a href="https://canvas.blackroad.io">Canvas</a><a href="https://cadence.blackroad.io">Cadence</a><a href="https://video.blackroad.io">Video</a><a href="https://radio.blackroad.io">Radio</a><a href="https://game.blackroad.io">Game</a><a href="https://roadtrip.blackroad.io">Agents</a><a href="https://roadcode.blackroad.io">RoadCode</a><a href="https://hq.blackroad.io">HQ</a><a href="https://app.blackroad.io">Dashboard</a></div><script>document.addEventListener('click',function(e){var d=document.getElementById('br-dd');if(d&&d.classList.contains('open')&&!e.target.closest('#br-nav')&&!e.target.closest('#br-dd'))d.classList.remove('open')});</script>
<div class="container">
  <div class="header">
    <div class="logo-row">
      <div class="dot" style="background:#FF1D6C"></div>
      <div class="dot" style="background:#F5A623"></div>
      <div class="dot" style="background:#2979FF"></div>
      <div class="dot" style="background:#9C27B0"></div>
      <div class="dot" style="background:#00E676"></div>
    </div>
    <h1>Simple, Sovereign Pricing</h1>
    <p class="subtitle">Your AI, your data, your fleet. No vendor lock-in. Cancel anytime.</p>
  </div>
  <div class="plans">
    ${PLANS.map(p => `
    <div class="plan${p.highlight ? ' highlight' : ''}">
      <div class="plan-name">${p.name}</div>
      <div class="plan-tagline">${p.tagline}</div>
      <div class="plan-price">${p.price === 0 ? '$0' : '$' + p.price}<span>${p.period}</span></div>
      <div class="plan-period">${p.price === 0 ? 'Free forever' : 'Billed monthly'}</div>
      <div class="features">
        ${p.features.map(f => `
        <div class="feature">
          <span class="check ${f.included ? 'yes' : 'no'}">${f.included ? '&#10003;' : '&mdash;'}</span>
          <span${f.included ? '' : ' style="color:#555"'}>${f.name}</span>
        </div>`).join('')}
      </div>
      <a href="${p.ctaLink}" class="btn btn-${p.id}">${p.cta}</a>
    </div>`).join('')}
  </div>
  <div class="compare">
    <h2>Feature Comparison</h2>
    <div class="table-wrap">
    <table>
      <thead><tr><th>Feature</th><th>Free</th><th>Pro</th><th>Enterprise</th></tr></thead>
      <tbody>
        ${allFeatureNames.map(name => `<tr>
          <td>${name}</td>
          ${PLANS.map(p => {
            const f = p.features.find(x => x.name === name);
            return `<td style="color:${f && f.included ? '#00E676' : '#555'}">${f && f.included ? '&#10003;' : '&mdash;'}</td>`;
          }).join('')}
        </tr>`).join('')}
      </tbody>
    </table>
    </div>
  </div>
  <div class="faq">
    <h2>Questions</h2>
    <div class="faq-item" onclick="this.classList.toggle('open')">
      <div class="faq-q">What does "sovereign AI" mean?</div>
      <div class="faq-a">Your conversations and data stay on infrastructure we control. No third-party training on your data. Bring your own API keys, or use our fleet models running on local hardware.</div>
    </div>
    <div class="faq-item" onclick="this.classList.toggle('open')">
      <div class="faq-q">Can I bring my own API keys?</div>
      <div class="faq-a">Pro and Enterprise plans support BYOK. Connect your own OpenAI, Anthropic, or other provider keys. Your keys are encrypted and never logged.</div>
    </div>
    <div class="faq-item" onclick="this.classList.toggle('open')">
      <div class="faq-q">What is a portable agent persona?</div>
      <div class="faq-a">Pro users get a persistent AI agent with memory, personality, and context that follows you across all BlackRoad products. It remembers your preferences and work history.</div>
    </div>
    <div class="faq-item" onclick="this.classList.toggle('open')">
      <div class="faq-q">How do I cancel?</div>
      <div class="faq-a">Cancel anytime from your account settings. No contracts, no cancellation fees. Your data is always exportable.</div>
    </div>
  </div>
  <div class="footer">BlackRoad OS, Inc. &mdash; Delaware C-Corp &mdash; Sovereign by design</div>
</div></body></html>`;
}

async function ensureTable(db) {
  await db.prepare(`CREATE TABLE IF NOT EXISTS plan_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_id TEXT,
    ip TEXT,
    ts DATETIME DEFAULT CURRENT_TIMESTAMP
  )`).run();
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/api/health') {
      return Response.json({ status: 'ok', service: 'pricing', plans: PLANS.length, ts: new Date().toISOString() });
    }

    if (path === '/api/plans') {
      return Response.json({
        plans: PLANS.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          period: p.period || 'free',
          tagline: p.tagline,
          features: p.features,
          cta_link: p.ctaLink,
        }))
      });
    }

    // Track page view
    await ensureTable(env.DB);
    const ip = request.headers.get('cf-connecting-ip') || 'unknown';
    await env.DB.prepare('INSERT INTO plan_views (plan_id, ip) VALUES (?, ?)').bind('page', ip).run();

    return new Response(html(), { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
  }
};
