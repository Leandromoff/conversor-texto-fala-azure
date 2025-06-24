// Backend para Azure Text-to-Speech
// Este servidor intermediário processa requisições do frontend e as encaminha para o Azure Speech Service

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do Azure Speech Service
// A chave e a região são lidas de variáveis de ambiente para evitar expor dados
// sensíveis no código fonte. Caso não estejam definidas, valores padrão são
// utilizados para evitar falhas de inicialização em ambientes de desenvolvimento.
const AZURE_REGION = process.env.AZURE_REGION || 'eastus';
const AZURE_CONFIG = {
  key: process.env.AZURE_KEY || 'YOUR_AZURE_KEY',
  region: AZURE_REGION,
  endpoint: `https://${AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`
};

// Middleware
app.use(cors()); // Habilita CORS para todas as origens
app.use(bodyParser.json());

// Servir arquivos estáticos da raiz
app.use(express.static(__dirname));

// Rota de status para verificar se o servidor está funcionando
app.get('/status', (req, res) => {
  res.json({ status: 'online', message: 'Azure TTS Backend está funcionando!' });
});

// Função para gerar SSML para Azure TTS
function generateSSML(data) {
  // Calcular ajuste de velocidade para SSML
  const ratePercent = Math.round((data.speed - 1) * 100);
  const rateString = ratePercent >= 0 ? `+${ratePercent}%` : `${ratePercent}%`;
  
  // Escapar caracteres especiais no texto
  const escapedText = data.text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  
  // Gerar SSML com voz e velocidade
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${data.language}">
      <voice name="Microsoft Server Speech Text to Speech Voice (${data.language}, ${data.voice})">
          <prosody rate="${rateString}">
              ${escapedText}
          </prosody>
      </voice>
  </speak>`;
}

// Rota principal para converter texto em fala
app.post('/synthesize', async (req, res) => {
  try {
    // Validar dados de entrada
    const { text, language, voice, speed } = req.body;
    
    if (!text || !language || !voice) {
      return res.status(400).json({ 
        success: false, 
        message: 'Parâmetros obrigatórios: text, language, voice' 
      });
    }
    
    // Preparar dados para envio
    const data = {
      text,
      language,
      voice,
      speed: speed || 1.0
    };
    
    console.log(`Processando síntese: ${language}, ${voice}, velocidade: ${speed}`);
    
    // Gerar SSML
    const ssml = generateSSML(data);
    
    // Configurar requisição para o Azure
    const headers = {
      'Ocp-Apim-Subscription-Key': AZURE_CONFIG.key,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
      'User-Agent': 'ConversorTextoFala-Backend'
    };
    
    // Fazer requisição para o Azure
    const response = await axios({
      method: 'post',
      url: AZURE_CONFIG.endpoint,
      headers: headers,
      data: ssml,
      responseType: 'arraybuffer'
    });
    
    // Enviar áudio como resposta
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': `attachment; filename="azure_${voice}_${Date.now()}.mp3"`
    });
    
    res.send(Buffer.from(response.data));
    
  } catch (error) {
    console.error('Erro ao processar síntese:', error);
    
    // Verificar se é um erro de resposta da API
    if (error.response) {
      const status = error.response.status;
      const errorMessage = error.response.data 
        ? error.response.data.toString() 
        : 'Sem detalhes do erro';
      
      console.error(`Erro na API do Azure: ${status} - ${errorMessage}`);
      
      return res.status(500).json({
        success: false,
        message: `Erro na API do Azure: ${status}`,
        details: errorMessage
      });
    }
    
    // Erro genérico
    res.status(500).json({
      success: false,
      message: `Erro ao processar síntese: ${error.message}`
    });
  }
});

// Rota para a página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse o conversor em: http://localhost:${PORT}`);
  console.log(`Endpoint de status: http://localhost:${PORT}/status`);
  console.log(`Endpoint de síntese: http://localhost:${PORT}/synthesize (POST)`);
});
