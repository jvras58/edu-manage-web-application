import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/password'

const prisma = new PrismaClient()

async function main() {
  // Senha padrão para todos os usuários de teste: "123456"
  const senhaHash = await hashPassword('123456')
  
  // Criar usuários
  const admin = await prisma.usuario.create({
    data: {
      nome: 'Administrador',
      email: 'admin@edumanage.com',
      senha_hash: senhaHash,
      role: 'admin'
    }
  })

  const maria = await prisma.usuario.create({
    data: {
      nome: 'Maria Silva',
      email: 'maria.silva@edumanage.com',
      senha_hash: senhaHash,
      role: 'professor'
    }
  })

  const joao = await prisma.usuario.create({
    data: {
      nome: 'João Santos',
      email: 'joao.santos@edumanage.com',
      senha_hash: senhaHash,
      role: 'professor'
    }
  })

  // Criar turmas
  const turmaA = await prisma.turma.create({
    data: {
      nome: 'Turma A - Manhã',
      disciplina: 'Matemática',
      ano_letivo: '2024'
    }
  })

  const turmaB = await prisma.turma.create({
    data: {
      nome: 'Turma B - Tarde',
      disciplina: 'Português',
      ano_letivo: '2024'
    }
  })

  const turmaC = await prisma.turma.create({
    data: {
      nome: 'Turma C - Integral',
      disciplina: 'Ciências',
      ano_letivo: '2024'
    }
  })

  // Criar alunos
  const ana = await prisma.aluno.create({
    data: {
      nome: 'Ana Carolina Souza',
      matricula: '2024001',
      email: 'ana.souza@email.com',
      status: 'ativo'
    }
  })

  const pedro = await prisma.aluno.create({
    data: {
      nome: 'Pedro Henrique Lima',
      matricula: '2024002',
      email: 'pedro.lima@email.com',
      status: 'ativo'
    }
  })

  const juliana = await prisma.aluno.create({
    data: {
      nome: 'Juliana Oliveira',
      matricula: '2024003',
      email: 'juliana.oliveira@email.com',
      status: 'ativo'
    }
  })

  const carlos = await prisma.aluno.create({
    data: {
      nome: 'Carlos Eduardo Santos',
      matricula: '2024004',
      email: 'carlos.santos@email.com',
      status: 'inativo'
    }
  })

  const beatriz = await prisma.aluno.create({
    data: {
      nome: 'Beatriz Costa',
      matricula: '2024005',
      email: 'beatriz.costa@email.com',
      status: 'ativo'
    }
  })

  // Vincular professores às turmas
  await prisma.professorTurma.create({
    data: {
      professor_id: maria.id,
      turma_id: turmaA.id
    }
  })

  await prisma.professorTurma.create({
    data: {
      professor_id: maria.id,
      turma_id: turmaB.id
    }
  })

  await prisma.professorTurma.create({
    data: {
      professor_id: joao.id,
      turma_id: turmaC.id
    }
  })

  // Vincular alunos às turmas
  await prisma.alunoTurma.create({
    data: {
      aluno_id: ana.id,
      turma_id: turmaA.id
    }
  })

  await prisma.alunoTurma.create({
    data: {
      aluno_id: pedro.id,
      turma_id: turmaA.id
    }
  })

  await prisma.alunoTurma.create({
    data: {
      aluno_id: juliana.id,
      turma_id: turmaB.id
    }
  })

  await prisma.alunoTurma.create({
    data: {
      aluno_id: beatriz.id,
      turma_id: turmaB.id
    }
  })

  // Critérios de avaliação para Turma A
  await prisma.criterioAvaliacao.create({
    data: {
      turma_id: turmaA.id,
      nome: 'Provas',
      peso: 40.00,
      descricao: 'Avaliações escritas bimestrais'
    }
  })

  await prisma.criterioAvaliacao.create({
    data: {
      turma_id: turmaA.id,
      nome: 'Trabalhos',
      peso: 30.00,
      descricao: 'Trabalhos individuais e em grupo'
    }
  })

  await prisma.criterioAvaliacao.create({
    data: {
      turma_id: turmaA.id,
      nome: 'Participação',
      peso: 30.00,
      descricao: 'Participação em aula e exercícios'
    }
  })

  // Notificações de boas-vindas para professores
  await prisma.notificacao.create({
    data: {
      usuario_id: maria.id,
      tipo: 'info',
      mensagem: 'Bem-vindo ao EduManage! Configure suas turmas e comece a gerenciar seus alunos.'
    }
  })

  await prisma.notificacao.create({
    data: {
      usuario_id: joao.id,
      tipo: 'info',
      mensagem: 'Bem-vindo ao EduManage! Configure suas turmas e comece a gerenciar seus alunos.'
    }
  })

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })