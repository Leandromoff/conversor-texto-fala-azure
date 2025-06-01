# Conversor de Texto para Fala com Vozes Neurais

Um aplicativo web que converte texto em fala, com suporte a múltiplos idiomas e vozes neurais de alta qualidade.

## Funcionalidades

- **Três provedores de voz**:
  - **Google**: Vozes de alta qualidade para reprodução direta no navegador
  - **Azure Neural**: Vozes neurais premium (Andrew e Emma) com download de áudio
  - **gTTS**: Alternativa gratuita para download de áudio

- **Vozes neurais do Azure**:
  - **AndrewMultilingualNeural**: Voz masculina de alta qualidade
  - **EmmaMultilingualNeural**: Voz feminina de alta qualidade

- **Idiomas suportados**:
  - Inglês (EUA)
  - Inglês (Reino Unido)
  - Português (Brasil)

- **Recursos adicionais**:
  - Ajuste de velocidade de reprodução
  - Seleção de formato de áudio (MP3/WAV)
  - Contagem de palavras e caracteres
  - Textos pré-definidos para cada idioma
  - Botão para limpar texto

## Como usar

### Modo Google (Reprodução)

1. Selecione **Google (Reprodução)** como Provedor de Voz
2. Escolha o **Idioma** desejado
3. Digite seu texto ou use o texto pré-definido
4. Ajuste a **Velocidade** de reprodução
5. Clique em **Reproduzir** para ouvir o texto

### Modo Azure Neural (Download)

1. Selecione **Azure Neural (Download)** como Provedor de Voz
2. Configure sua **Chave API** e **Região** do Azure
3. Escolha a voz desejada (**Andrew** ou **Emma**)
4. Selecione o **Idioma** e **Formato de Áudio** (MP3/WAV)
5. Digite seu texto e ajuste a velocidade
6. Clique em **Download Áudio** para baixar o arquivo

### Modo gTTS (Download)

1. Selecione **gTTS (Download)** como Provedor de Voz
2. Escolha o **Idioma** desejado
3. Digite seu texto e ajuste a velocidade
4. Clique em **Download Áudio** para baixar o arquivo MP3

## Configuração do Azure Speech Service

Para utilizar as vozes neurais do Azure, você precisa:

1. Criar uma conta no [Azure Portal](https://portal.azure.com)
2. Criar um recurso do tipo **Speech Service**
3. Obter a **Chave** e **Região** do serviço
4. Inserir essas informações no painel de configuração do aplicativo

As credenciais são armazenadas apenas localmente no navegador do usuário.

## Implementação Técnica

### Arquivos do Projeto

- **index.html**: Estrutura da página e elementos de interface
- **style.css**: Estilos e layout responsivo
- **script.js**: Lógica principal e integração com Web Speech API
- **azure-speech.js**: Integração com Azure Speech Service
- **download-audio.js**: Implementação do download via gTTS

### Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript
- **Síntese de Voz**: Web Speech API, Azure Speech Service, gTTS
- **Formatos de Áudio**: MP3, WAV

## Notas de Implementação

- O modo Google utiliza a Web Speech API nativa dos navegadores
- O modo Azure requer uma chave de API válida do Azure Speech Service
- O modo gTTS requer um servidor backend para funcionar completamente
- Em ambiente local/simulado, os downloads são simulados com alertas explicativos

## Compatibilidade

- Funciona melhor no Google Chrome, que oferece as vozes Google de alta qualidade
- A funcionalidade de reprodução é compatível com a maioria dos navegadores modernos
- O download de áudio via Azure requer configuração de API
- O download via gTTS requer implementação de backend

## Licença

Este projeto está sob a licença MIT.
