export default async function handler(req, res) {
  const SCRIPT_URL = process.env.SCRIPT_URL;
  const API_KEY = process.env.API_KEY;

  if (!SCRIPT_URL || !API_KEY) {
    return res.status(500).json({ error: 'Missing SCRIPT_URL or API_KEY' });
  }

  if (req.method === 'POST') {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...req.body, apiKey: API_KEY })
      });
      const result = await response.json();
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ error: 'POST failed', details: err.message });
    }
  }

  if (req.method === 'GET') {
    try {
      const response = await fetch(SCRIPT_URL);
      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: 'GET failed', details: err.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
