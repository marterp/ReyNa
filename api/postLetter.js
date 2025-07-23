export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Only POST allowed");
  }

  const { title, message, sender } = req.body;

  try {
    const response = await fetch(process.env.GS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        message,
        sender,
        secret: process.env.GS_SECRET
      })
    });

    const text = await response.text();
    res.status(200).json({ status: "ok", server: text });

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", detail: error.message });
  }
}
