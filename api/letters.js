export default async function handler(req, res) {
  const SCRIPT_URL = process.env.SCRIPT_URL;
  const API_KEY = process.env.API_KEY;

  if (!SCRIPT_URL || !API_KEY) {
    return res.status(500).json({ error: 'Missing SCRIPT_URL or API_KEY' });
  }

  if (req.method === 'POST') {
    const { title, message, sender, nickname } = req.body;

    if (nickname) {
      return res.status(400).json({ error: 'Bot detected' });
    }

    const trimmedTitle = title?.trim();
    const trimmedMessage = message?.trim();
    const trimmedSender = sender?.trim();

    if (
      !trimmedTitle ||
      !trimmedMessage ||
      typeof trimmedTitle !== 'string' ||
      typeof trimmedMessage !== 'string' ||
      trimmedTitle.length > 100 ||
      trimmedMessage.length > 1000 ||
      (trimmedSender && trimmedSender.length > 50)
    ) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmedTitle, message: trimmedMessage, sender: trimmedSender, apiKey: API_KEY }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(500).json({ error: 'Upstream error', details: errorText });
      }

      const result = await response.json();
      return res.status(200).json(result);
    } catch (err) {
      console.error('POST error:', err);
      return res.status(500).json({ error: 'POST failed', details: err.message });
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
