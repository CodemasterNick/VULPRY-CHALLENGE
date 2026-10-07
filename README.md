# VULPRY
INTEGRANTES DO GRUPO:
Nicolas de Albuquerque Vieira da Silva- RM569537
Arthur Alexandre Felisberto de Oliveira - RM568824
Gabriel de Matos Leal dos Santos- RM565218
Fabrizzio Abrahão Novembrini- RM570757
Rodrigo Cruz Takagui- RM571813


## Application Security Posture Management

A VULPRY é uma aplicação web voltada ao gerenciamento da postura de segurança de aplicações. A plataforma organiza aplicações e vulnerabilidades em um único ambiente, permitindo visualizar severidade, prioridade, recomendações e tratamento de falsos positivos.

## Funcionalidades

- Cadastro de usuários.
- Login com senha armazenada com hash bcrypt.
- Cadastro e associação de aplicações a usuários.
- Visualização das aplicações cadastradas.
- Visualização das vulnerabilidades por aplicação.
- Classificação por severidade e prioridade.
- Registro de recomendações de correção.
- Marcação e desmarcação de falso positivo.
- Dashboard com resumo das vulnerabilidades.
- Análise assistida por IA por meio de integração configurável com uma API compatível.

A análise assistida tem como objetivo apoiar o analista. A decisão final sobre tratamento, correção ou classificação de uma vulnerabilidade permanece com o profissional responsável.

## Tecnologias

- HTML5
- CSS3
- JavaScript
- Node.js
- Express
- SQLite
- bcrypt
- CORS

## Requisitos

- Node.js 18 ou superior.
- npm.
- Navegador web atualizado.

## Estrutura

```text
VULPRY/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── database/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
├── imgs/
├── docs/
├── .gitignore
├── LICENSE.md
└── README.md
```

## Instalação

Abra um terminal na pasta `backend`:

```bash
npm install
```

Inicialize o banco, caso seja necessário criar as tabelas em uma instalação nova:

```bash
npm run init-db
```

Inicie a API:

```bash
npm start
```

A API ficará disponível em:

```text
http://localhost:3000
```

## Acesso ao frontend

Abra o arquivo:

```text
frontend/home.html
```

Também é possível utilizar um servidor estático local para servir a pasta `frontend`.

## Fluxo de demonstração

1. Acesse a página inicial.
2. Crie um usuário.
3. Faça login.
4. Cadastre uma aplicação informando nome e repositório.
5. Acesse a aplicação pelo dashboard.
6. Consulte as vulnerabilidades apresentadas.
7. Observe a severidade e a prioridade de cada registro.
8. Marque uma vulnerabilidade como falso positivo.
9. Utilize a análise assistida por IA quando a integração estiver configurada.

## Configuração da análise assistida por IA

A integração é opcional para o funcionamento básico da plataforma.

1. Copie `backend/.env.example` para `backend/.env`.
2. Informe a URL da API, a chave de acesso e o modelo desejado:

```env
AI_API_URL=https://api.openai.com/v1/chat/completions
AI_API_KEY=sua_chave
AI_MODEL=gpt-4o-mini
```

3. Reinicie o backend.
4. Abra uma aplicação e selecione `Analisar com IA`.

A chave de acesso deve permanecer somente no backend e nunca deve ser colocada nos arquivos do frontend ou enviada ao Git.

## Banco de dados

O banco SQLite utilizado pela aplicação está em:

```text
backend/database/vulpry.db
```

As tabelas principais são:

- `usuarios`
- `aplicacoes`
- `vulnerabilidades`

O script `backend/database/init.js` cria as tabelas quando necessário.

## API principal

### Cadastro

```http
POST /registrar
```

### Login

```http
POST /login
```

### Cadastro de aplicação

```http
POST /aplicacoes
```

Exemplo:

```json
{
  "nome": "Aplicação Teste",
  "repositorio": "https://github.com/exemplo/aplicacao-teste",
  "usuario_id": 1
}
```

### Listagem de aplicações

```http
GET /aplicacoes/:usuarioId
```

### Vulnerabilidades

```http
GET /vulnerabilidades/:aplicacaoId
```

### Falso positivo

```http
PATCH /vulnerabilidades/:id/falso-positivo
```

### Análise assistida

```http
POST /analises/ia/:aplicacaoId
```

## Licença

Este projeto é distribuído sob a GNU General Public License v3.0. Consulte `LICENSE.md`.
