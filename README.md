# Elite Transport - Site

## Como publicar no Vercel (grátis)

### Opção 1: Via GitHub (recomendado)
1. Crie uma conta no GitHub (github.com) se não tiver
2. Crie um repositório novo (ex: "elite-transport")
3. Faça upload de TODOS os arquivos desta pasta pro repositório
4. Vá em vercel.com e crie conta com seu GitHub
5. Clique "Add New Project" → selecione o repositório
6. Clique "Deploy" — pronto!

### Opção 2: Via Vercel CLI
1. Instale Node.js (nodejs.org)
2. Abra o terminal nesta pasta
3. Execute:
   ```
   npm install
   npm run dev      # pra testar local (http://localhost:5173)
   npm run build    # pra gerar versão final
   ```
4. Instale Vercel CLI: `npm i -g vercel`
5. Execute: `vercel` e siga as instruções

## Como alterar o nome da empresa depois
Abra o arquivo `src/App.jsx` e use Ctrl+H (Find & Replace):
- Substitua "Elite" pelo primeiro nome
- Substitua "Transport" pelo segundo nome
- Substitua "Elite Transport" pelo nome completo
- Atualize o título em `index.html`
- Faça novo deploy (push pro GitHub ou `vercel` no terminal)

## Como conectar um domínio próprio
1. Compre o domínio (Namecheap, GoDaddy, Google Domains)
2. No painel do Vercel → Settings → Domains
3. Adicione seu domínio e siga as instruções de DNS

## Estrutura do projeto
```
├── index.html          # Página base + SEO
├── package.json        # Dependências
├── vite.config.js      # Config do build
└── src/
    ├── main.jsx        # Entry point
    └── App.jsx         # TODO O SITE (componente principal)
```
