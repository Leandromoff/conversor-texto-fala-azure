// Azure Speech Service Integration
// Este arquivo implementa a integração com o Azure Speech Service para download de áudio

// Configuração global
const azureSpeechConfig = {
    // Chave e região do Azure (implementadas nativamente)
    key: "4A9KMB8cIw7G1wfu56f55V9rcn3nDTGqoNdNfwNBwvRRrBQe1TYiQQJ99BFACYeBjFXJ3w3AAAYACOGZ1F",
    region: "eastus",
    // Tempo estimado de processamento (ms)
    processingTime: 2000,
    // Formatos de áudio suportados
    formats: {
        'mp3': 'audio-16khz-128kbitrate-mono-mp3'
    }
};

// Função para obter configuração do Azure
function getAzureConfig() {
    // Retorna diretamente a configuração nativa
    return { 
        key: azureSpeechConfig.key, 
        region: azureSpeechConfig.region 
    };
}

// Função para gerar SSML para Azure TTS
function generateSSML(data) {
    // Calcular ajuste de velocidade para SSML (formato diferente do Web Speech API)
    // Azure usa porcentagem relativa a 1.0, onde:
    // 0.5 = -50%, 1.0 = normal, 2.0 = +100%
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

// Função para fazer a chamada à API do Azure
async function callAzureAPI(data) {
    const statusMessage = document.getElementById('status-message');
    statusMessage.textContent = 'Conectando ao Azure Speech Service...';
    
    try {
        // Gerar SSML para a requisição
        const ssml = generateSSML(data);
        
        // Configurar a requisição para o Azure
        const url = `https://${data.region}.tts.speech.microsoft.com/cognitiveservices/v1`;
        const headers = {
            'Ocp-Apim-Subscription-Key': data.key,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': data.format,
            'User-Agent': 'ConversorTextoFala'
        };
        
        // Ambiente online - fazer a requisição real
        statusMessage.textContent = 'Gerando áudio no Azure...';
        
        try {
            // Fazer a requisição para o Azure
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: ssml
            });
            
            if (!response.ok) {
                throw new Error(`Erro na API do Azure: ${response.status} ${response.statusText}`);
            }
            
            // Obter o blob de áudio
            const audioBlob = await response.blob();
            
            return {
                success: true,
                message: 'Áudio gerado com sucesso',
                blob: audioBlob,
                fileName: `azure_${data.voice}_${Date.now()}.mp3`
            };
        } catch (error) {
            console.error('Erro na chamada à API do Azure:', error);
            
            return {
                success: false,
                message: `Erro na API do Azure: ${error.message}`,
            };
        }
    } catch (error) {
        console.error('Erro ao preparar requisição:', error);
        return {
            success: false,
            message: `Erro: ${error.message}`
        };
    }
}

// Função para iniciar o processo de download via Azure
async function downloadAzureAudio(options) {
    const statusMessage = document.getElementById('status-message');
    const textInput = document.getElementById('text-input');
    const languageSelect = document.getElementById('language-select');
    const speedControl = document.getElementById('speed-control');
    
    const text = textInput.value.trim();
    if (!text) {
        statusMessage.textContent = 'Por favor, digite algum texto para converter em áudio.';
        return;
    }
    
    try {
        // Obter configuração do Azure (agora embutida no código)
        const { key, region } = getAzureConfig();
        
        // Obter idioma e voz do valor selecionado
        const [language, voice] = languageSelect.value.split('|');
        
        // Preparar dados para envio
        const data = {
            text: text,
            voice: voice,
            language: language,
            speed: parseFloat(speedControl.value),
            format: azureSpeechConfig.formats['mp3'],
            key: key,
            region: region,
            timestamp: Date.now()
        };
        
        // Chamar a API do Azure
        const result = await callAzureAPI(data);
        
        if (result.success) {
            statusMessage.textContent = result.message;
            
            // Se temos um blob real, fazer o download
            if (result.blob) {
                const url = URL.createObjectURL(result.blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = result.fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                
                statusMessage.textContent = 'Download concluído!';
            }
        } else {
            statusMessage.textContent = result.message;
        }
    } catch (error) {
        statusMessage.textContent = `Erro ao processar download: ${error.message}`;
    }
}

// Função para verificar se o Azure está configurado corretamente
function checkAzureConfig() {
    // Sempre retorna true pois a configuração está embutida no código
    return true;
}

// Exportar funções para uso global
window.downloadAzureAudio = downloadAzureAudio;
window.checkAzureConfig = checkAzureConfig;
