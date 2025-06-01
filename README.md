# Conversor de Texto para Fala com Azure TTS

Este projeto é um conversor de texto para fala que utiliza o Azure Speech Service para gerar áudios de alta qualidade com vozes neurais.

## Características

- Interface minimalista e fácil de usar
- Suporte para Inglês (AndrewMultilingualNeural) e Português (AntonioNeural)
- Controle de velocidade da fala
- Download de áudio em formato MP3
- Servidor integrado que protege a chave do Azure

## Como usar

1. Instale as dependências:
   ```
   npm install
   ```

2. Inicie o servidor:
   ```
   node server.js
   ```

3. Acesse o conversor em seu navegador:
   ```
   http://localhost:3000
   ```

4. Digite o texto, selecione o idioma, ajuste a velocidade e clique em "Download" para baixar o áudio.

## Notas técnicas

- O servidor Node.js atua como intermediário entre o frontend e o Azure Speech Service
- A chave do Azure está configurada diretamente no servidor para maior segurança
- Todos os arquivos estão na raiz para facilitar a implantação
- O servidor também serve os arquivos estáticos do frontend

## Requisitos

- Node.js 14+
- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Conexão com internet
