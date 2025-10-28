# Filtro de Ativos da Bolsa (API Brapi)

![Versão da Aplicação](https://img.shields.io/badge/version-1.0.0-blue)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

Este projeto é uma aplicação móvel desenvolvida com React Native e Expo que funciona como uma ferramenta de "screening" (filtragem) para ativos da bolsa de valores brasileira, utilizando a API da [Brapi](https://brapi.dev/).

## 📜 Descrição

A aplicação permite que o utilizador insira um valor máximo para o preço de uma cota. Com base nesse filtro, a aplicação busca em tempo real os ativos que se enquadram nesse critério, busca os seus detalhes (como Dividend Yield e logo) e, por fim, exibe os melhores resultados, ordenados pelo maior Dividend Yield.

## ✨ Funcionalidades

* **Filtro por Preço:** Lista ativos com preço de cota abaixo de um valor definido pelo utilizador.
* **Busca de Dados Detalhados:** Utiliza múltiplos endpoints da API para enriquecer os dados, buscando informações como Dividend Yield e logos das empresas.
* **Ordenação Inteligente:** Os resultados são ordenados do maior para o menor Dividend Yield, apresentando os ativos mais rentáveis primeiro.
* **Interface Limpa:** Interface de ecrã único, com design minimalista e feedback visual de carregamento.
* **Programação Robusta:** O código inclui tratamento de erros, estados de carregamento e programação defensiva contra dados incompletos da API.

## 🛠️ Tecnologias Utilizadas

* **React Native**
* **Expo**
* **TypeScript**
* **Axios** para as chamadas à API
* **API da Brapi** como fonte de dados financeiros

## 🚀 Como Rodar Localmente

Para executar este projeto no teu ambiente de desenvolvimento, segue os passos abaixo.

### Pré-requisitos

* [Node.js](https://nodejs.org/) (versão LTS recomendada)
* [Yarn](https://classic.yarnpkg.com/en/docs/install/) ou [NPM](https://www.npmjs.com/get-npm)
* Aplicação **Expo Go** instalada no teu smartphone (iOS ou Android)

### Passos de Instalação

1.  **Clona o repositório:**
    ```bash
    git clone [https://github.com/Alan-Franca/API-Ativos-Financeiros.git](https://github.com/Alan-Franca/API-Ativos-Financeiros)
    ```

2.  **Navega para a pasta do projeto:**
    ```bash
    cd API-Ativos-Financeiros
    ```

3.  **Instala as dependências:**
    ```bash
    npm install
    ```
    *ou, se usares Yarn:*
    ```bash
    yarn install
    ```

4.  **Configura a Chave da API (Passo Essencial!):**
    * Na raiz do projeto, cria um ficheiro chamado `.env`.
    * Dentro do ficheiro `.env`, adiciona a seguinte linha, substituindo `SUA_CHAVE_AQUI` pela tua chave da API da Brapi:
        ```
        EXPO_PUBLIC_BRAPI_API_TOKEN="SUA_CHAVE_AQUI"
        ```
    * **Importante:** O ficheiro `.env` já está incluído no `.gitignore` para garantir que a tua chave secreta não seja enviada para o GitHub.

5.  **Inicia o servidor de desenvolvimento do Expo:**
    ```bash
    npx expo start
    ```

6.  **Abre a aplicação no teu telemóvel:**
    * O comando anterior irá mostrar um QR code no teu terminal.
    * Abre a aplicação **Expo Go** no teu smartphone e lê o QR code para a aplicação carregar.

## 📱 Como Utilizar a Aplicação

1.  No campo **"Preço máximo por cota"**, insere o valor máximo que desejas para filtrar os ativos (ex: `150`).
2.  Clica no botão **"Analisar Ativos"**.
3.  Aguarda enquanto a aplicação busca e processa os dados. Um indicador de carregamento será exibido.
4.  A lista de resultados aparecerá na tela, mostrando os ativos encontrados que custam menos que o valor inserido, já ordenados pelo maior Dividend Yield.

## 👤 Autor

Alan França

* GitHub: https://github.com/Alan-Franca
* LinkedIn: www.linkedin.com/in/alan-frança-dev
