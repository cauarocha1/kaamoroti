# Ka'a Moroti

Plataforma web gamificada para conscientizacao ambiental e mudanca de habitos sustentaveis.

Este repositorio contem o projeto de TCC (ETEC) em formato de aplicacao React, com autenticacao, quiz de pegada ecologica, desafios praticos e ranking de engajamento.

## Objetivo

O Ka'a Moroti usa gamificacao para transformar educacao ambiental em acoes praticas do dia a dia.

## Funcionalidades principais

- Cadastro e login com Firebase Authentication
- Quiz de pegada ecologica com pontuacao percentual
- Sugestoes personalizadas com base em tags de baixa pontuacao
- Modulo de desafios sustentaveis
- Ranking de usuarios por Pontos de Acao (PA)
- Dashboard com progresso individual
- Paginas institucionais: Sobre, Ajuda, Contato

## Stack tecnica

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

1. Instale dependencias:

```bash
npm ci
```

2. Configure variaveis de ambiente:

```bash
cp .env.example .env.local
```

3. Preencha o `.env.local` com as configuracoes do Firebase Web App:

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
- `npm run build`: build de producao
- `npm run preview`: preview local do build
- `npm run lint`: analise estatico do codigo

## Deploy

O deploy esta configurado para Firebase Hosting com GitHub Actions.

Workflows:

- `.github/workflows/firebase-hosting-merge.yml` (deploy em `main`)
- `.github/workflows/firebase-hosting-pull-request.yml` (preview em PR)

Secrets necessarios no GitHub:

- `FIREBASE_SERVICE_ACCOUNT_KAAMOROTI`
- `GITHUB_TOKEN` (fornecido automaticamente pelo GitHub Actions)

## Seguranca e boas praticas

- Arquivos locais/sensiveis nao devem ser versionados (`.env*`, `.firebase/`, `dist/`, caches e chaves).
- As credenciais de servico do Firebase devem ficar apenas em GitHub Secrets.
- `apiKey` do Firebase Web nao e segredo, mas as regras do Firestore/Storage devem ser restritivas em producao.

## Contexto academico

Projeto desenvolvido como Trabalho de Conclusao de Curso (TCC) do Ensino Medio Integrado ao Tecnico em Desenvolvimento de Sistemas.

## Autor

- Caua Rocha Ribeiro de Souza
