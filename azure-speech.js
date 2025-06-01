// Azure Speech Service Integration via Backend
// Este arquivo implementa a integração com o backend intermediário para Azure Speech Service

// Configuração global
const azureSpeechConfig = {
    // URL do backend intermediário (mesmo servidor, porta 3000)
    backendUrl: window.location.hostname === 'localhost' ? 'http://localhost:3000' : window.location.origin,
    // Formatos de áudio suportados
    formats: {
        'mp3': 'audio-16khz-128kbitrate-mono-mp3'
    }
};

// Função para fazer a chamada ao backend intermediário
async function callBackendAPI(data) {
    const statusMessage = document.getElementById('status-message');
    statusMessage.textContent = 'Conectando ao serviço de síntese...';
    
    try {
        console.log('Enviando requisição para o backend:', `${azureSpeechConfig.backendUrl}/synthesize`);
        console.log('Dados:', {
            text: data.text,
            language: data.language,
            voice: data.voice,
            speed: data.speed
        });
        
        // Ambiente online - fazer a requisição para o backend
        statusMessage.textContent = 'Gerando áudio...';
        
        try {
            // Fazer a requisição para o backend
            const response = await fetch(`${azureSpeechConfig.backendUrl}/synthesize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: data.text,
                    language: data.language,
                    voice: data.voice,
                    speed: data.speed
                })
            });
            
            console.log('Resposta recebida:', response.status, response.statusText);
            
            if (!response.ok) {
                const errorText = await response.text().catch(e => 'Não foi possível ler o corpo da resposta');
                console.error('Corpo da resposta de erro:', errorText);
                throw new Error(`${response.status} ${response.statusText} - ${errorText}`);
            }
            
            // Obter o blob de áudio
            const audioBlob = await response.blob();
            console.log('Blob de áudio recebido:', audioBlob.size, 'bytes, tipo:', audioBlob.type);
            
            return {
                success: true,
                message: 'Áudio gerado com sucesso',
                blob: audioBlob,
                fileName: `azure_${data.voice}_${Date.now()}.mp3`
            };
        } catch (error) {
            console.error('Erro na chamada ao backend:', error);
            
            return {
                success: false,
                message: `Erro no serviço de síntese: ${error.message}`,
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

// Função para iniciar o processo de download via backend
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
        // Obter idioma e voz do valor selecionado
        const [language, voice] = languageSelect.value.split('|');
        
        // Preparar dados para envio
        const data = {
            text: text,
            voice: voice,
            language: language,
            speed: parseFloat(speedControl.value),
            timestamp: Date.now()
        };
        
        console.log('Iniciando download com:', {
            voice: data.voice,
            language: data.language,
            speed: data.speed
        });
        
        // Chamar o backend
        const result = await callBackendAPI(data);
        
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
        console.error('Erro completo:', error);
        statusMessage.textContent = `Erro ao processar download: ${error.message}`;
    }
}

// Exportar funções para uso global
window.downloadAzureAudio = downloadAzureAudio;
