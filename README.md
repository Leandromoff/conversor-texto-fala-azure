# Conversor de Texto para Fala

Projeto simples que demonstra a conversão de texto em fala usando a API de síntese de voz do próprio navegador.

## Características

- Interface minimalista e fácil de usar
- Suporte para Inglês (AndrewMultilingualNeural) e Português (AntonioNeural)
- Controle de velocidade da fala
- Reprodução de voz diretamente no navegador

## Como usar

Abra o arquivo `index.html` em seu navegador, digite um texto, escolha o idioma e clique em **Reproduzir**.

## Pacotes prontos para uso

O repositório contém duas versões completas do projeto em formato ZIP:

- **`conversor-texto-fala-raiz.zip`** – todos os arquivos (HTML, CSS, scripts e `server.js`) ficam na raiz.
- **`conversor-texto-fala-com-backend.zip`** – o backend Node.js fica na pasta `backend/` e é iniciado por `app.js`.

Para executar qualquer uma das versões:

1. Descompacte o pacote desejado:
   ```bash
   unzip conversor-texto-fala-raiz.zip -d conversor-texto-fala-raiz
   # ou
   unzip conversor-texto-fala-com-backend.zip -d conversor-texto-fala-com-backend
   ```
2. Instale as dependências:
   ```bash
   cd <pasta-extraida>
   npm install
   ```
3. Inicie o servidor:
   ```bash
   node server.js   # ou node app.js, dependendo do pacote
   ```
4. Acesse `http://localhost:3000` no navegador.

Esses pacotes incluem um botão **Download** que permite baixar o áudio gerado em MP3. Essa funcionalidade é implementada nos arquivos `azure-speech.js` e `download-audio.js`.

## Notas técnicas

O projeto original desta pasta é totalmente client-side e não depende de serviços externos.

## Requisitos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Node.js (para executar as versões com backend)
