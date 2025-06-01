# Guia de Configuração do Azure Speech Service

Este guia explica como configurar o Azure Speech Service para utilizar as vozes neurais AndrewMultilingualNeural e EmmaMultilingualNeural no conversor de texto para fala.

## Passo 1: Criar uma conta no Azure Portal

1. Acesse o [Azure Portal](https://portal.azure.com)
2. Clique em "Criar uma conta" se você ainda não tiver uma
3. Siga as instruções para criar sua conta (você precisará de um cartão de crédito, mas há um período gratuito)

## Passo 2: Criar um recurso do Speech Service

1. Após fazer login no Azure Portal, clique em "Criar um recurso"
2. Pesquise por "Speech Service" e selecione este serviço
3. Clique em "Criar"
4. Preencha as informações necessárias:
   - **Assinatura**: Selecione sua assinatura do Azure
   - **Grupo de recursos**: Crie um novo ou use um existente
   - **Região**: Escolha uma região próxima a você (ex: East US)
   - **Nome**: Dê um nome único ao seu recurso
   - **Tipo de preço**: Selecione "F0" (gratuito) para começar
5. Clique em "Revisar + criar" e depois em "Criar"

## Passo 3: Obter a chave de API e região

1. Após a criação do recurso, vá para o recurso criado
2. No menu lateral esquerdo, clique em "Chaves e Endpoint"
3. Você verá duas chaves (Key 1 e Key 2) - copie qualquer uma delas
4. Anote também a região do seu recurso (ex: eastus)

## Passo 4: Configurar o conversor de texto para fala

1. No conversor de texto para fala, selecione "Azure Neural (Download)" como provedor de voz
2. O painel de configuração do Azure aparecerá
3. Cole sua chave de API no campo "Chave API"
4. Digite a região do seu recurso no campo "Região" (ex: eastus)
5. Clique em "Salvar Configuração"

## Passo 5: Utilizar as vozes neurais

1. Selecione a voz desejada (Andrew ou Emma)
2. Escolha o idioma e formato de áudio (MP3 ou WAV)
3. Digite seu texto e ajuste a velocidade
4. Clique em "Download Áudio" para baixar o arquivo

## Informações importantes

- O plano gratuito (F0) do Azure Speech Service permite até 500.000 caracteres por mês
- As vozes neurais AndrewMultilingualNeural e EmmaMultilingualNeural são multilíngues e funcionam com todos os idiomas suportados
- Suas credenciais são armazenadas apenas localmente no seu navegador
- Para maior segurança, você pode criar uma chave de API com restrições de uso

## Solução de problemas

Se você encontrar problemas ao usar o Azure Speech Service:

1. Verifique se a chave de API e região estão corretas
2. Confirme se o serviço está ativo no Azure Portal
3. Verifique se você não excedeu a cota gratuita
4. Tente criar uma nova chave de API no Azure Portal

Para mais informações, consulte a [documentação oficial do Azure Speech Service](https://docs.microsoft.com/azure/cognitive-services/speech-service/).
