package domain



type Mensagem struct {
	Assunto string
	Corpo   string
}

type Notificacao struct {
    ID       string
    Destino  Destinatario  // VO
    Conteudo Mensagem      // VO
}

type Destinatario struct {
    Email string
    SMS   string
}