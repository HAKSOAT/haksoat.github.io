/**
 * Vercel Serverless Function: /api/reactions
 *
 * GET  /api/reactions?slug=<slug>  → returns reaction counts for a post
 * POST /api/reactions              → body: { slug, reaction } → increments a reaction
 *
 * Reactions supported: like, love, insightful, curious
 * Data stored in Upstash Redis as hash: reactions:<slug>
 */

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const VALID_REACTIONS = ['like', 'love', 'insightful', 'curious'];

async function redisCommand(...args) {
  const response = await fetch(`${UPSTASH_URL}/${args.map(encodeURIComponent).join('/')}`, {
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
    },
  });
  const data = await response.json();
  return data.result;
}

export default async function handler(req, res) {
  // CORS headers — allow requests from your blog domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const { slug } = req.query;
    if (!slug) {
      return res.status(400).json({ error: 'slug is required' });
    }

    const key = `reactions:${slug}`;
    // HGETALL returns a flat array [field, value, field, value, ...]
    const raw = await redisCommand('HGETALL', key);

    const counts = { like: 0, love: 0, insightful: 0, curious: 0 };
    if (raw && Array.isArray(raw)) {
      for (let i = 0; i < raw.length; i += 2) {
        const field = raw[i];
        const value = parseInt(raw[i + 1], 10);
        if (VALID_REACTIONS.includes(field)) {
          counts[field] = value;
        }
      }
    }

    return res.status(200).json(counts);
  }

  if (req.method === 'POST') {
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }

    const { slug, reaction } = body;

    if (!slug) {
      return res.status(400).json({ error: 'slug is required' });
    }
    if (!reaction || !VALID_REACTIONS.includes(reaction)) {
      return res.status(400).json({ error: `reaction must be one of: ${VALID_REACTIONS.join(', ')}` });
    }

    const key = `reactions:${slug}`;
    const newCount = await redisCommand('HINCRBY', key, reaction, '1');

    return res.status(200).json({ reaction, count: newCount });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
