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

    const response = await fetch("https://api.mailersend.com/v1/email", {
      method: "POST",
      headers: {
        Authorization:
          "Bearer mlsn.72f5e6cc779135cc5d53985b7dfd30c4ea07fb5c4e32d42910e5c7c1145a4f94",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: {
          email: "testeapi@trial-xkjn41m2pw04z781.mlsender.net",
          name: "Seu App",
        },
        to: [
          {
            email: "benjaminvieira@reeeturn.com.br",
            name: "Equipe",
          },
        ],
        subject: "Novo descarte cadastrado",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 10px;">
            <h2>🧾 Novo descarte cadastrado</h2>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>Data:</strong> ${data}</p>
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
