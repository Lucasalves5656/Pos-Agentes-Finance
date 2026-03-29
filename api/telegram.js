export default async function handler(req, res) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  if (!BOT_TOKEN) {
    return res.status(500).json({ error: 'Token do Telegram não configurado no backend.' });
  }

  if (req.method === 'GET') {
    // getUpdates
    const { offset } = req.query;
    try {
      const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${offset}&timeout=30`;
      const response = await fetch(url);
      const data = await response.json();
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: 'Erro ao conectar no Telegram', details: e.message });
    }
  } else if (req.method === 'POST') {
    // sendMessage
    const { chat_id, text } = req.body;
    try {
      const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id, text })
      });
      const data = await response.json();
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: 'Erro ao conectar no Telegram', details: e.message });
    }
  }

  return res.status(405).json({ error: 'Método não permitido.' });
}
