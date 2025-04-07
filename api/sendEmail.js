export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { nome, tipos, data } = req.body;
  console.log("Recebido:", { nome, tipos, data });

  try {
    const tiposHtml = Array.isArray(tipos)
      ? tipos.map((tipo) => `<li>✅ ${tipo}</li>`).join("")
      : `<li>✅ ${tipos}</li>`;

    const dataFormatada = `${new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
    }).format(new Date(data))} às ${new Intl.DateTimeFormat("pt-BR", {
      timeStyle: "short",
    }).format(new Date(data))}`;

    const response = await fetch("https://api.mailersend.com/v1/email", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MAILERSEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: {
          email: "tecnologia@reeeturn.com.br",
          name: "REEETurn APP",
        },
        to: [
          {
            email: "gestão@reeeturn.com.br",
            name: "Equipe de Gestão REEETurn",
          },
        ],
        subject: "Novo descarte cadastrado",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 10px;">
            <h2>🧾 Novo descarte cadastrado</h2>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>Data:</strong> ${dataFormatada}</p>
            <p><strong>Tipos:</strong></p>
            <ul style="padding-left: 20px; margin: 0;">
              ${tiposHtml}
            </ul>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro da MailerSend:", errorText);
      return res
        .status(response.status)
        .json({ error: "Erro ao enviar e-mail", detalhe: errorText });
    }

    return res.status(202).json({ status: "e-mail aceito pela MailerSend" });
  } catch (error) {
    console.error("Erro inesperado:", error);
    return res.status(500).json({ error: "Erro interno ao enviar o e-mail" });
  }
}
