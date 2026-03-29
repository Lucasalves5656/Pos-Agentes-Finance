export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const { message, chatId } = req.body;
  
  if (!message || !chatId) {
    return res.status(400).json({ error: 'Mensagem ou Chat ID não informado.' });
  }

  // Verifica se o chat_id está na lista de permitidos
  const allowedChats = process.env.ALLOWED_CHAT_IDS ? process.env.ALLOWED_CHAT_IDS.split(',').map(id => id.trim()) : [];
  
  // Se a lista não estiver vazia e o ID não estiver na lista, rejeitamos a IA de responder.
  if (allowedChats.length > 0 && !allowedChats.includes(chatId.toString())) {
    console.log(`Chat ID não autorizado tentou falar com a IA: ${chatId}`);
    return res.status(200).json({ 
      blocked: true,
      error: 'Bot configurado para não responder este ID de usuário.' 
    });
  }

  const invoke_url = "https://integrate.api.nvidia.com/v1/chat/completions";
  
  try {
    const response = await fetch(invoke_url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "mistralai/mistral-large-3-675b-instruct-2512",
        "messages": [{"role":"user", "content": message}],
        "max_tokens": 2048,
        "temperature": 0.15,
        "top_p": 1.00,
        "frequency_penalty": 0.00,
        "presence_penalty": 0.00,
        "stream": false
      })
    });

    if (!response.ok) {
        throw new Error(`NVIDIA API Error: ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("Erro na API da NVIDIA:", error);
    return res.status(500).json({ error: 'Erro ao conectar à IA.', details: error.message });
  }
}
