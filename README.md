# EduManage 📚

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5+-blue)](https://prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-orange)](https://neon.tech/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3+-38B2AC)](https://tailwindcss.com/)

Uma aplicação web completa para gerenciamento educacional, desenvolvida com tecnologias modernas para facilitar a administração de instituições de ensino.

## ✨ Sobre o Projeto

O **EduManage** é uma plataforma full-stack que permite gerenciar usuários (admins e professores), turmas, alunos, critérios de avaliação e notificações de forma eficiente. Construída com **Next.js** para o frontend e backend, **Prisma** como ORM, **PostgreSQL** hospedado no Neon, e uma interface elegante usando **Radix UI** e **Tailwind CSS**.

### 🚀 Funcionalidades Principais

- **👥 Gerenciamento de Usuários**: Admins e professores com autenticação JWT.
- **🏫 Turmas e Alunos**: CRUD completo para turmas e alunos, incluindo upload de fotos.
- **📊 Critérios de Avaliação**: Definição e gerenciamento de critérios educacionais.
- **🔔 Notificações**: Sistema de notificações para manter todos informados.
- **📈 Dashboard**: Estatísticas e visão geral do sistema.

### 🏗️ Arquitetura

- **Frontend**: Páginas responsivas com componentes reutilizáveis (shadcn/ui).
- **Backend**: APIs RESTful no Next.js para operações CRUD e autenticação.
- **Banco de Dados**: Schema Prisma com modelos relacionais e dados de seed para testes.

## 🛠️ Como Rodar Localmente

### Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **pnpm** (gerenciador de pacotes)
- **Git**
- Conta no **Neon** para o banco PostgreSQL (já configurado no `.env`)

### Passos para Instalação

1. **Clone o repositório**:
   ```bash
   git clone <url-do-repo>
   cd edu-manage-web-application
   ```

2. **Instale as dependências**:
   ```bash
   pnpm install
   ```
   > Isso executa automaticamente `prisma generate` via `postinstall`.

3. **Configure o banco**:
   - Verifique se o `.env` tem a `DATABASE_URL` correta para o Neon.
   - Teste a conexão se necessário.

4. **Sincronize o banco**:
   ```bash
   pnpm prisma migrate dev
   pnpm prisma db seed
   ```

5. **Execute o projeto**:
   ```bash
   pnpm run dev
   ```

6. **Acesse a aplicação**:
   - Abra [http://localhost:3000](http://localhost:3000)
   - Login: `admin@edumanage.com` ou `maria.silva@edumanage.com`
   - Senha: `123456`

## 📋 Comandos Úteis do Prisma

- **Gerar cliente Prisma**: `pnpm prisma generate`
- **Aplicar migrações**: `pnpm prisma migrate dev`
- **Rodar seed**: `pnpm prisma db seed`
- **Ver status**: `pnpm prisma migrate status`
- **Resetar banco (dev)**: `pnpm prisma migrate reset`
- **Abrir Prisma Studio**: `pnpm prisma studio` (http://localhost:5555)

## 📁 Estrutura do Projeto

```
edu-manage-web-application/
├── app/                 # Páginas Next.js (App Router)
├── components/          # Componentes reutilizáveis
├── lib/                 # Utilitários e configurações
├── prisma/              # Schema e migrações do banco
├── public/              # Assets estáticos
└── docs/                # Documentação adicional
```

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📄 Licença

Este projeto está sob a licença MIT.