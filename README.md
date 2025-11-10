### Explicação sobre o Projeto EduManage

O **EduManage** é uma aplicação web para gerenciamento educacional, desenvolvida com **Next.js** (framework React), **Prisma** (ORM para banco de dados), **PostgreSQL** (via Neon, um serviço de banco de dados na nuvem), e bibliotecas como **Radix UI** e **Tailwind CSS** para a interface. O sistema permite gerenciar usuários (admins e professores), turmas, alunos, critérios de avaliação e notificações. É estruturado em uma arquitetura full-stack com API routes no Next.js, autenticação via JWT, e um banco relacional para persistência de dados.

O projeto inclui:
- **Frontend**: Páginas para dashboard, alunos, turmas, critérios e notificações, com componentes reutilizáveis (shadcn/ui).
- **Backend**: APIs RESTful para CRUD de entidades, autenticação e upload de fotos.
- **Banco**: Schema Prisma com modelos para `Usuario`, `Turma`, `Aluno`, `CriterioAvaliacao`, etc., e dados de seed para testes.

### Como Rodar Localmente Usando o Banco do Neon

O banco já está configurado no arquivo .env com a URL do Neon (`DATABASE_URL`). Certifique-se de que o Neon esteja ativo e acessível (você pode verificar no painel do Neon se a conexão está ok). Aqui vão os passos:

1. **Instalar Dependências**:
   - Certifique-se de ter o **Node.js** (versão 18+), **pnpm** (gerenciador de pacotes) e **Git** instalados.
   - Clone o repositório (se ainda não fez): `git clone <url-do-repo>`.
   - Navegue para a pasta: `cd edu-manage-web-application`.
   - Instale as dependências: `pnpm install`. Isso também executa `prisma generate` automaticamente (graças ao `postinstall` no package.json).

2. **Configurar o Banco**:
   - O .env já tem a `DATABASE_URL` apontando para o Neon. Se precisar alterar, edite o arquivo .env (não commite mudanças sensíveis).
   - Verifique se o banco está acessível: você pode testar com uma ferramenta como `psql` ou via Prisma.

3. **Rodar o Projeto**:
   - Execute o servidor de desenvolvimento: `pnpm run dev`. Isso inicia o Next.js na porta 3000 (ou a configurada).
   - Se houver erros (como o que apareceu no terminal com exit code 1), provavelmente é porque o banco não está sincronizado. Continue para os comandos do Prisma abaixo.

4. **Acessar a Aplicação**:
   - Abra o navegador em `http://localhost:3000`.
   - Faça login com credenciais do seed: email `admin@edumanage.com` ou `maria.silva@edumanage.com`, senha `123456`.

### Comandos do Prisma para Sincronizar e Rodar o Seed

O Prisma gerencia o banco: migrações aplicam mudanças no schema, e o seed popula dados iniciais. Use estes comandos na raiz do projeto:

- **Gerar o Cliente Prisma** (já feito no `postinstall`, mas se precisar manualmente):
  ```
  pnpm prisma generate
  ```
  Isso cria o cliente TypeScript para interagir com o banco.

- **Aplicar Migrações (Sincronizar Schema)**:
  ```
  pnpm prisma migrate dev
  ```
  - Isso aplica as migrações pendentes (no caso, a migração `20251109050017_init` já existe).
  - Use `--name <nome>` se criar uma nova migração (ex.: `pnpm prisma migrate dev --name nova_migracao`).
  - Para produção: `pnpm prisma migrate deploy`.

- **Rodar o Seed (Popular Dados Iniciais)**:
  ```
  pnpm prisma db seed
  ```
  - Isso executa o script seed.ts, criando usuários, turmas, alunos, etc., com senha padrão `123456`.
  - O seed inclui 1 admin, 2 professores, 3 turmas, 5 alunos, critérios de avaliação e notificações.

- **Outros Comandos Úteis**:
  - Ver status das migrações: `pnpm prisma migrate status`.
  - Resetar banco (desenvolvimento): `pnpm prisma migrate reset` (cuidado, apaga dados).
  - Abrir Prisma Studio (interface visual para o banco): `pnpm prisma studio` (abre em `http://localhost:5555`).

Se o `pnpm run dev` ainda falhar após esses passos, verifique logs de erro (provavelmente relacionados ao banco) e certifique-se de que o Neon está online. Se precisar de ajuda com erros específicos, compartilhe os logs!

npx tsc --noEmit --project tsconfig.json