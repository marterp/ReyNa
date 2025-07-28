export default async function handler(req, res) {
  const SCRIPT_URL = process.env.SCRIPT_URL;
  const API_KEY = process.env.API_KEY;

  if (!SCRIPT_URL || !API_KEY) {
    return res.status(500).json({ error: 'Missing SCRIPT_URL or API_KEY' });
  }

  try {
    if (req.method === 'GET') {
      const offset = parseInt(req.query.offset, 10) || 0;
      const limit = parseInt(req.query.limit, 10) || 10;

      const url = new URL(SCRIPT_URL);
      url.searchParams.set('offset', offset);
      url.searchParams.set('limit', limit);

      const response = await fetch(url.toString());
      const text = await response.text();

      try {
        const data = JSON.parse(text);
        return res.status(200).json(data);
      } catch (err) {
        console.error('Invalid JSON from Google Script (GET):', text);
        return res.status(500).json({ error: 'Invalid JSON returned from script' });
      }
    }

    if (req.method === 'POST') {
      const { title, message, sender } = req.body;

      if (!title || !message) {
        return res.status(400).json({ error: 'Missing title or message' });
      }

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: API_KEY,
          title,
          message,
          sender,
        }),
      });

      const text = await response.text();

      try {
        const data = JSON.parse(text);
        return res.status(200).json(data);
      } catch (err) {
        console.error('Invalid JSON from Google Script (POST):', text);
        return res.status(500).json({ error: 'Invalid JSON returned from script' });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
