-- EduManage Database Schema
-- Run this script to create all tables

-- Drop existing tables (if any)
DROP TABLE IF EXISTS notificacoes CASCADE;
DROP TABLE IF EXISTS criterios_avaliacao CASCADE;
DROP TABLE IF EXISTS aluno_turma CASCADE;
DROP TABLE IF EXISTS professor_turma CASCADE;
DROP TABLE IF EXISTS alunos CASCADE;
DROP TABLE IF EXISTS turmas CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- Usuários (Admin e Professores)
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'professor')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Turmas
CREATE TABLE turmas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  disciplina VARCHAR(100) NOT NULL,
  ano_letivo VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Alunos
CREATE TABLE alunos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  matricula VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255),
  foto_url TEXT,
  status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'trancado')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Relacionamento N:N - Professor-Turma
CREATE TABLE professor_turma (
  professor_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  turma_id UUID REFERENCES turmas(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (professor_id, turma_id)
);

-- Relacionamento N:N - Aluno-Turma
CREATE TABLE aluno_turma (
  aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
  turma_id UUID REFERENCES turmas(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (aluno_id, turma_id)
);

-- Critérios de Avaliação por Turma
CREATE TABLE criterios_avaliacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  turma_id UUID REFERENCES turmas(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  peso DECIMAL(5,2) NOT NULL CHECK (peso >= 0 AND peso <= 100),
  descricao TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Notificações
CREATE TABLE notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('info', 'sucesso', 'alerta', 'erro')),
  mensagem TEXT NOT NULL,
  lida BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes para performance
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_role ON usuarios(role);
CREATE INDEX idx_alunos_matricula ON alunos(matricula);
CREATE INDEX idx_alunos_status ON alunos(status);
CREATE INDEX idx_professor_turma_professor ON professor_turma(professor_id);
CREATE INDEX idx_professor_turma_turma ON professor_turma(turma_id);
CREATE INDEX idx_aluno_turma_aluno ON aluno_turma(aluno_id);
CREATE INDEX idx_aluno_turma_turma ON aluno_turma(turma_id);
CREATE INDEX idx_criterios_turma ON criterios_avaliacao(turma_id);
CREATE INDEX idx_notificacoes_usuario ON notificacoes(usuario_id);
CREATE INDEX idx_notificacoes_lida ON notificacoes(lida);
