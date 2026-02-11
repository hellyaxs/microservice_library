class Dinheiro:
    def __init__(self, valor: float, moeda: str):
        self.valor = valor
        self.moeda = moeda


class Transacao:
    def __init__(self, id: str, valor: Dinheiro, status: str):
        self.id = id
        self.valor = valor  # VO
        self.status = status

class Fatura:
    def __init__(self, id: str, valor_total: Dinheiro, status: str):
        self.id = id
        self.valor_total = valor_total  # VO
        self.status = status
        self.valor_pago = Dinheiro(0, valor.moeda)

class Pagamento:
    def __init__(self, transacao: Transacao, fatura: Fatura):
        self.transacao = transacao
        self.fatura = fatura