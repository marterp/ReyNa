export default async function handler(req, res) {
  const SCRIPT_URL = process.env.SCRIPT_URL;
  const API_KEY = process.env.API_KEY;

  if (!SCRIPT_URL || !API_KEY) {
      return res.status(500).json({ error: 'Missing SCRIPT_URL or API_KEY' });
    }

    export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { title, message, sender } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: 'Missing title or message' });
    }

    try {
      const response = await fetch(process.env.SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: process.env.API_KEY,
          title,
          message,
          sender,
        }),
      });

      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');

      if (!isJson) {
        const text = await response.text();
        console.error('Non-JSON response from script:', text);
        return res.status(500).json({ error: 'Invalid response from script' });
      }

      const data = await response.json();

      if (!data.success) {
        return res.status(400).json({ error: data.error || 'Unknown error' });
      }

      res.status(200).json({ message: 'Letter submitted!', id: data.id });
    } catch (err) {
      console.error('Fetch error:', err);
      res.status(500).json({ error: 'Failed to submit letter' });
    }
  }


  if (req.method === 'GET') {
    try {
      const url = new URL(SCRIPT_URL);
      // Pass offset and limit if they exist
      Object.entries(req.query).forEach(([key, val]) => url.searchParams.set(key, val));

      const response = await fetch(url.toString());
      if (!response.ok) {
        const errorText = await response.text();
        return res.status(500).json({ error: 'Upstream error', details: errorText });
      }
      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: 'GET failed', details: err.message });
    }
  }
}
