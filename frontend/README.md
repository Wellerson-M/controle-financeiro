# Controle Financeiro — Frontend (PWA)

Este é o scaffold do frontend em React + Vite + Tailwind com configurações básicas para PWA.

Pré-requisitos
- Node.js 18+ e npm ou yarn

Instalação e execução (PowerShell):

```powershell
cd "C:\Users\Welle\OneDrive\Área de Trabalho\climax\controleFinanceiro\frontend"
npm install
npm run dev
```

Variáveis de ambiente
- Copie `.env.example` para `.env` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` se for usar Supabase.

PWA
- O service worker (`sw.js`) e `manifest.webmanifest` já estão incluídos; para testes locais use `npm run preview` após `npm run build` para servir via HTTPS localmente (ou publique em Vercel/Netlify).

Próximos passos sugeridos
- Conectar ao Supabase para autenticação e armazenamento.
- Implementar formulários para adicionar ganhos/gastos e páginas de listagem.
