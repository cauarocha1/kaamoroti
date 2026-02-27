# Ka'a Moroti
Plataforma web gamificada para conscientização ambiental e mudança de hábitos sustentáveis.
Este repositório contém o projeto de TCC (ETEC) em formato de aplicação React, com autenticação, quiz de pegada ecológica, desafios práticos e ranking de engajamento.
## Objetivo
O Ka'a Moroti usa gamificação para transformar educação ambiental em ações práticas do dia a dia.
## Funcionalidades principais
- Cadastro e login com Firebase Authentication
- Quiz de pegada ecológica com pontuação percentual
- Sugestões personalizadas com base em tags de baixa pontuação
- Módulo de desafios sustentáveis
- Ranking de usuários por Pontos de Ação (PA)
- Dashboard com progresso individual
- Páginas institucionais: Sobre, Ajuda, Contato
## Stack técnica
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Firebase (Auth, Firestore, Storage)
- React Router DOM
- Recharts
- Lucide React
## Requisitos
- Node.js 20+
- npm 10+
## Setup local
1. Instale dependências:
```bash
npm ci
```
2. Configure variáveis de ambiente:
```bash
cp .env.example .env.local
```
3. Preencha o `.env.local` com as configurações do Firebase Web App:
```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```
4. Rode em desenvolvimento:
```bash
npm run dev
```
## Scripts
- `npm run dev`: ambiente local
- `npm run build`: build de produção
- `npm run preview`: preview local do build
- `npm run lint`: análise estático do código
## Deploy
O deploy está configurado para Firebase Hosting com GitHub Actions.
Workflows:
- `.github/workflows/firebase-hosting-merge.yml` (deploy em `main`)
- `.github/workflows/firebase-hosting-pull-request.yml` (preview em PR)
Secrets necessários no GitHub:
- `FIREBASE_SERVICE_ACCOUNT_KAAMOROTI`
- `GITHUB_TOKEN` (fornecido automaticamente pelo GitHub Actions)
## Segurança e boas práticas
- Arquivos locais/sensíveis não devem ser versionados (`.env*`, `.firebase/`, `dist/`, caches e chaves).
- As credenciais de serviço do Firebase devem ficar apenas em GitHub Secrets.
- `apiKey` do Firebase Web não é segredo, mas as regras do Firestore/Storage devem ser restritivas em produção.
## Contexto acadêmico
Projeto desenvolvido como Trabalho de Conclusão de Curso (TCC) do Ensino Médio Integrado ao Técnico em Desenvolvimento de Sistemas.
## Autor
- Cauã Rocha Ribeiro de Souza
