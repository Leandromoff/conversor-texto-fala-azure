// Variáveis globais
let synth = window.speechSynthesis;
let utterance = null;
let isProcessing = false;
let isSpeaking = false;

// Elementos do DOM
document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const languageSelect = document.getElementById('language-select');
    const speedControl = document.getElementById('speed-control');
    const speedValue = document.getElementById('speed-value');
    const playBtn = document.getElementById('play-btn');
    const downloadBtn = document.getElementById('download-btn');
    const statusMessage = document.getElementById('status-message');
    const wordCount = document.getElementById('word-count');
    const charCount = document.getElementById('char-count');

    // Textos pré-definidos para cada idioma
    const predefinedTexts = {
        'en': `A Regenerative AI is a smart computer program. It can create things like texts, images, or music. It learns from data and gives new ideas. But it does not think like a human.

An AGI means Artificial General Intelligence. It is a computer that can think, learn, and understand like a human. It can do many jobs, not only one task.

So, the difference is:
Regenerative AI is good at one type of work (like writing or drawing).
AGI can think and solve many problems like a person.`,
        'pt': `Uma IA Regenerativa é um programa de computador inteligente. Ela pode criar coisas como textos, imagens ou músicas. Aprende com dados e oferece novas ideias. Mas não pensa como um humano.

Uma AGI significa Inteligência Artificial Geral. É um computador que pode pensar, aprender e entender como um ser humano. Pode fazer muitos trabalhos, não só uma tarefa.

Então, a diferença é:
IA Regenerativa é boa em um tipo de trabalho (como escrever ou desenhar).
AGI pode pensar e resolver muitos problemas como uma pessoa.`
    };

    // Inicialização
    checkBrowserSupport();
    
    // Event listeners
    textInput.addEventListener('input', updateTextStats);
    speedControl.addEventListener('input', updateSpeedValue);
    playBtn.addEventListener('click', handlePlayButton);
    downloadBtn.addEventListener('click', handleDownloadAudio);
    languageSelect.addEventListener('change', handleLanguageChange);
    
    // Funções
    function checkBrowserSupport() {
        if (!('speechSynthesis' in window)) {
            statusMessage.textContent = 'Seu navegador não suporta a API de síntese de fala.';
            playBtn.disabled = true;
        }
    }

    // Função para obter idioma e voz do valor selecionado
    function getLanguageAndVoice() {
        const selectedValue = languageSelect.value;
        const [language, voice] = selectedValue.split('|');
        return { language, voice };
    }

    // Função para lidar com a mudança de idioma
    function handleLanguageChange() {
        const { language } = getLanguageAndVoice();
        const baseLanguage = language.split('-')[0]; // 'en' ou 'pt'
        
        // Verificar se o texto atual é diferente do texto pré-definido para qualquer idioma
        const currentText = textInput.value.trim();
        const isCustomText = currentText !== predefinedTexts['en'].trim() && 
                            currentText !== predefinedTexts['pt'].trim() &&
                            currentText !== '';
        
        // Se o texto for personalizado, perguntar antes de substituir
        if (isCustomText) {
            if (confirm('Deseja substituir o texto atual pelo texto padrão para o idioma selecionado?')) {
                textInput.value = predefinedTexts[baseLanguage];
                updateTextStats();
            }
        } else {
            // Se não for texto personalizado, substituir automaticamente
            textInput.value = predefinedTexts[baseLanguage];
            updateTextStats();
        }
    }

    function updateTextStats() {
        const text = textInput.value;
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        const chars = text.length;
        
        wordCount.textContent = words;
        charCount.textContent = chars;
    }

    function updateSpeedValue() {
        const speed = speedControl.value;
        speedValue.textContent = `${speed}x`;
    }

    // Função para lidar com o botão de reprodução
    function handlePlayButton() {
        if (isSpeaking) {
            stopSpeaking();
        } else {
            startSpeaking();
        }
    }

    // Função para parar a reprodução
    function stopSpeaking() {
        if (synth.speaking) {
            synth.cancel();
        }
        
        isSpeaking = false;
        isProcessing = false;
        playBtn.textContent = 'Reproduzir';
        statusMessage.textContent = 'Reprodução interrompida.';
    }

    // Função para selecionar a voz Google apropriada
    function selectGoogleVoice(voices, languageCode) {
        // Definir as vozes Google prioritárias para cada idioma
        const googleVoices = {
            'pt-BR': 'Google português do Brasil',
            'en-US': 'Google US English'
        };
        
        // Obter a voz prioritária para o idioma selecionado
        const priorityVoice = googleVoices[languageCode];
        
        // 1. Tentar encontrar a voz Google específica para o idioma selecionado
        if (priorityVoice) {
            const googleVoice = voices.find(voice => 
                voice.name.includes(priorityVoice)
            );
            
            if (googleVoice) {
                console.log(`Voz Google prioritária selecionada: ${googleVoice.name}`);
                return googleVoice;
            }
        }
        
        // 2. Tentar encontrar qualquer voz para o idioma específico
        const baseLanguage = languageCode.split('-')[0];
        
        // Buscar qualquer voz que corresponda ao idioma específico
        const regionVoice = voices.find(voice => 
            voice.lang === languageCode
        );
        
        if (regionVoice) {
            console.log(`Voz regional selecionada: ${regionVoice.name}`);
            return regionVoice;
        }
        
        // 3. Tentar encontrar qualquer voz para o idioma base
        const anyVoice = voices.find(voice => 
            voice.lang.includes(baseLanguage)
        );
        
        if (anyVoice) {
            console.log(`Voz no idioma base selecionada: ${anyVoice.name}`);
            return anyVoice;
        }
        
        // 4. Como último recurso, usar a primeira voz disponível
        if (voices.length > 0) {
            console.log(`Primeira voz disponível selecionada: ${voices[0].name}`);
            return voices[0];
        }
        
        // Nenhuma voz encontrada
        console.log('Nenhuma voz disponível');
        return null;
    }

    // Função para iniciar a reprodução
    function startSpeaking() {
        if (isProcessing) return;
        
        const text = textInput.value.trim();
        if (text === '') {
            statusMessage.textContent = 'Por favor, digite algum texto para converter em fala.';
            return;
        }

        isProcessing = true;
        isSpeaking = true;
        statusMessage.textContent = 'Processando...';
        playBtn.textContent = 'Parar';

        // Obter idioma do valor selecionado
        const { language } = getLanguageAndVoice();

        // Criar nova utterance
        utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = parseFloat(speedControl.value);
        
        // Selecionar a voz prioritária (Google) com base no idioma selecionado
        let voices = synth.getVoices();
        let selectedVoice = selectGoogleVoice(voices, language);
        
        if (selectedVoice) {
            utterance.voice = selectedVoice;
            console.log("Voz selecionada:", selectedVoice.name);
            statusMessage.textContent = `Processando com voz: ${selectedVoice.name}`;
        }

        // Eventos da utterance
        utterance.onend = () => {
            playBtn.textContent = 'Reproduzir';
            statusMessage.textContent = 'Reprodução concluída.';
            isProcessing = false;
            isSpeaking = false;
        };

        utterance.onerror = (event) => {
            playBtn.textContent = 'Reproduzir';
            statusMessage.textContent = `Erro: ${event.error}`;
            isProcessing = false;
            isSpeaking = false;
        };

        // Reproduzir
        synth.speak(utterance);
    }

    // Função para lidar com o download de áudio
    function handleDownloadAudio() {
        // Verificar se há texto para converter
        const text = textInput.value.trim();
        if (text === '') {
            statusMessage.textContent = 'Por favor, digite algum texto para converter em áudio.';
            return;
        }
        
        // Obter idioma e voz do valor selecionado
        const { language, voice } = getLanguageAndVoice();
        
        // Chamar função do Azure Speech Service (implementada em azure-speech.js)
        if (typeof downloadAzureAudio === 'function') {
            downloadAzureAudio({
                text: text,
                voice: voice,
                language: language,
                speed: speedControl.value,
                format: 'mp3'
            });
        } else {
            statusMessage.textContent = 'Erro: Módulo Azure Speech não está carregado corretamente.';
        }
    }

    // Verificar periodicamente o estado da síntese de voz
    setInterval(() => {
        if (!synth.speaking && isSpeaking) {
            // Se a síntese parou mas o estado ainda indica que está falando
            isSpeaking = false;
            isProcessing = false;
            playBtn.textContent = 'Reproduzir';
        }
    }, 100);

    // Inicialização adicional
    updateTextStats();
    updateSpeedValue();
    
    // Preencher o texto inicial com base no idioma selecionado
    const { language } = getLanguageAndVoice();
    const initialLanguage = language.split('-')[0];
    textInput.value = predefinedTexts[initialLanguage];
    updateTextStats();
});
