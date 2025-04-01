export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { nome, tipo, data } = req.body;
  console.log("Recebido:", { nome, tipo, data });

  try {
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
        text: `Novo descarte feito por: ${nome}\nTipo: ${tipo}\nData: ${data}`,
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
