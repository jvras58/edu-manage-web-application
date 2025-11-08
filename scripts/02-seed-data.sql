-- Seed inicial para EduManage
-- Inclui 1 admin e 2 professores de exemplo

-- Senha padrão para todos: "senha123"
-- Hash bcrypt com salt 10: $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

-- Admin (admin@edumanage.com / senha123)
INSERT INTO usuarios (nome, email, senha_hash, role) VALUES 
('Administrador', 'admin@edumanage.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin');

-- Professores (maria.silva@edumanage.com / senha123, joao.santos@edumanage.com / senha123)
INSERT INTO usuarios (nome, email, senha_hash, role) VALUES 
('Maria Silva', 'maria.silva@edumanage.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'professor'),
('João Santos', 'joao.santos@edumanage.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'professor');

-- Turmas de exemplo
INSERT INTO turmas (id, nome, disciplina, ano_letivo) VALUES
(gen_random_uuid(), 'Turma A - Manhã', 'Matemática', '2024'),
(gen_random_uuid(), 'Turma B - Tarde', 'Português', '2024'),
(gen_random_uuid(), 'Turma C - Integral', 'Ciências', '2024');

-- Alunos de exemplo
INSERT INTO alunos (nome, matricula, email, status) VALUES
('Ana Carolina Souza', '2024001', 'ana.souza@email.com', 'ativo'),
('Pedro Henrique Lima', '2024002', 'pedro.lima@email.com', 'ativo'),
('Juliana Oliveira', '2024003', 'juliana.oliveira@email.com', 'ativo'),
('Carlos Eduardo Santos', '2024004', 'carlos.santos@email.com', 'inativo'),
('Beatriz Costa', '2024005', 'beatriz.costa@email.com', 'ativo');

-- Vincular professores às turmas
INSERT INTO professor_turma (professor_id, turma_id)
SELECT u.id, t.id
FROM usuarios u
CROSS JOIN turmas t
WHERE u.email = 'maria.silva@edumanage.com'
AND t.nome IN ('Turma A - Manhã', 'Turma B - Tarde');

INSERT INTO professor_turma (professor_id, turma_id)
SELECT u.id, t.id
FROM usuarios u
CROSS JOIN turmas t
WHERE u.email = 'joao.santos@edumanage.com'
AND t.nome = 'Turma C - Integral';

-- Vincular alunos às turmas
INSERT INTO aluno_turma (aluno_id, turma_id)
SELECT a.id, t.id
FROM alunos a
CROSS JOIN turmas t
WHERE a.matricula IN ('2024001', '2024002')
AND t.nome = 'Turma A - Manhã';

INSERT INTO aluno_turma (aluno_id, turma_id)
SELECT a.id, t.id
FROM alunos a
CROSS JOIN turmas t
WHERE a.matricula IN ('2024003', '2024005')
AND t.nome = 'Turma B - Tarde';

-- Critérios de avaliação para Turma A
INSERT INTO criterios_avaliacao (turma_id, nome, peso, descricao)
SELECT t.id, 'Provas', 40.00, 'Avaliações escritas bimestrais'
FROM turmas t
WHERE t.nome = 'Turma A - Manhã';

INSERT INTO criterios_avaliacao (turma_id, nome, peso, descricao)
SELECT t.id, 'Trabalhos', 30.00, 'Trabalhos individuais e em grupo'
FROM turmas t
WHERE t.nome = 'Turma A - Manhã';

INSERT INTO criterios_avaliacao (turma_id, nome, peso, descricao)
SELECT t.id, 'Participação', 30.00, 'Participação em aula e exercícios'
FROM turmas t
WHERE t.nome = 'Turma A - Manhã';

-- Notificação de boas-vindas para professores
INSERT INTO notificacoes (usuario_id, tipo, mensagem)
SELECT id, 'info', 'Bem-vindo ao EduManage! Configure suas turmas e comece a gerenciar seus alunos.'
FROM usuarios
WHERE role = 'professor';
