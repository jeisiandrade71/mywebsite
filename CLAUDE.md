@AGENTS.md

# mysite

Site pessoal em Next.js (App Router, TypeScript, Tailwind) com MongoDB Atlas.

## Sobre a usuária

Jeisi está aprendendo a desenvolver e ainda não tem experiência com as ferramentas
de linha de comando deste projeto. Ela pretende ir aprendendo aos poucos e ganhar
mais autonomia com o tempo — por enquanto, prefira executar e explicar os comandos
por ela em vez de apenas instruí-la a rodar algo sozinha.

## Ferramentas de CLI que Claude pode usar livremente

Claude está autorizado a usar (instalando quando necessário) as CLIs abaixo para
ajudar no projeto, sempre explicando o que cada comando faz:

- **Vercel CLI** (`vercel`) — deploy e configuração do hosting.
- **MongoDB** (`mongosh` / MongoDB driver) — consultas e administração do banco.
- **GitHub CLI** (`gh`) — já autenticado como `jeisiandrade71`; usar para repositórios, PRs, issues.
- **Twilio CLI** (`twilio`) — quando o projeto envolver SMS/WhatsApp/telefonia.

## Ambiente

- O Node do sistema é antigo (v15). Este projeto precisa de Node ≥20; use o Node 22
  instalado via Homebrew (`/opt/homebrew/opt/node@22/bin`) prefixado no PATH ao
  rodar comandos, a menos que o Node global já tenha sido atualizado.
- Segredos (ex.: `MONGODB_URI`) ficam em `.env.local`, nunca commitados (ver `.gitignore`).

## Estrutura

- `src/app/page.tsx` — página inicial (Hello World + status da conexão MongoDB).
- `src/app/api/ping-db/route.ts` — endpoint de teste de conexão com o banco.
- `src/lib/mongodb.ts` — helper de conexão com o MongoDB (client cacheado em dev).
