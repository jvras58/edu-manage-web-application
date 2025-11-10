export interface Notificacao {
  id: string
  tipo: "info" | "sucesso" | "alerta" | "erro"
  mensagem: string
  lida: boolean
  created_at: string
}