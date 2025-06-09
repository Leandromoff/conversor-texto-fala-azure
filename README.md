# Conversor de Texto para Fala

Projeto simples que demonstra a conversão de texto em fala usando a API de
síntese de voz do próprio navegador.

## Características

- Interface minimalista e fácil de usar
- Suporte para Inglês (AndrewMultilingualNeural) e Português (AntonioNeural)
- Controle de velocidade da fala
- Reprodução de voz diretamente no navegador

## Como usar

Abra o arquivo `index.html` em seu navegador, digite um texto, escolha o idioma e
clique em **Reproduzir**.

## Notas técnicas

O projeto é totalmente client-side e não depende de serviços externos.

## Requisitos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)

## Usando o backend Node.js

Para utilizar a versão que faz chamadas ao Azure Text-to-Speech é necessário
executar o servidor Node.js. Antes de iniciar, defina as variáveis de ambiente
com sua chave e a região do serviço:

```bash
export AZURE_KEY="<sua-chave>"
export AZURE_REGION="<sua-regiao>"  # exemplo: eastus
node server.js
```

Essas mesmas variáveis também são usadas pelo arquivo `backend/app.js` caso você
prefira executá-lo separadamente.
