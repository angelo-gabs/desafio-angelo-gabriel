class CaixaDaLanchonete {

    constructor() {
        this.cardapio = this.criarCardapio();
    }

    formataMoeda(valor) {
        return `R$ ${valor.toFixed(2).replace('.', ',')}`;
    }

    validarItens(itens) {
        const cardapioKeys = Object.keys(this.cardapio);
        for (let i = 0; i < itens.length; i++) {
            if (!cardapioKeys.includes(itens[i])) {
                return "Item inválido!";
            }
        }
    }

    validarQuantidades(itensDivididos) {
        for (let i = 0; i < itensDivididos.length; i++) {
            const quantidade = itensDivididos[i].quantidade;
            if (Number(quantidade) <= 0 || quantidade.trim() === '' || isNaN(Number(quantidade))) {
                return "Quantidade inválida!";
            }
        }
    }

    validarPedidoExtras(itemNome, itensDivididos, temCombo) {
        for (let i = 0; i < itensDivididos.length; i++) {
            const item = itemNome[i];
            if (
                (item === 'queijo' && !itemNome.includes('sanduiche') && !temCombo) ||
                (item === 'chantily' && !itemNome.includes('cafe'))
            ) {
                return "Item extra não pode ser pedido sem o principal";
            } else if (item !== 'queijo' && item !== 'chantily') {
                const cardapioItem = this.cardapio[item];
                if (!cardapioItem) {
                    return "Item inválido!";
                }
            }
        }
    }

    validarFormaPagamento(metodoDePagamento) {
        const formasDePagamento = ["dinheiro", "debito", "credito"];
        if (!formasDePagamento.includes(metodoDePagamento)) {
            return 'Forma de pagamento inválida!';
        }
    }

    validarCombo(itemNome) {
        return itemNome.some(item => this.cardapio[item] && this.cardapio[item].descricao === 'combo');
    }

    calcularPreco(itemNome, itemQtd, temCombo, itensDivididos) {
        let preco = 0;
        for (let i = 0; i < itensDivididos.length; i++) {
            const item = itemNome[i];
            if (
                (item === 'queijo' && !itemNome.includes('sanduiche') && !temCombo) ||
                (item === 'chantily' && !itemNome.includes('cafe'))
            ) {
                return "Item extra não pode ser pedido sem o principal";
            } else {
                preco += this.cardapio[item].valor * itemQtd[i];
            }
        }
        return preco;
    }

    aplicarDesconto(pagamento, preco) {
        if (pagamento === 'dinheiro') {
            preco -= (preco * (5 / 100));
        } else if (pagamento === 'credito') {
            preco += (preco * (3 / 100));
        }
        return preco;
    }

    divideItens(itens) {
        const itensDivididos = itens.map(itemString => {
            const [item, quantidade] = itemString.split(',');
            return { item, quantidade };
        });
        return itensDivididos;
    }

    criarCardapio() {
        return {
            cafe: { valor: 3.0, descricao: 'principal' },
            chantily: { valor: 1.5, descricao: 'extra' },
            suco: { valor: 6.2, descricao: 'principal' },
            sanduiche: { valor: 6.5, descricao: 'principal' },
            queijo: { valor: 2.0, descricao: 'extra' },
            salgado: { valor: 7.25, descricao: 'principal' },
            combo1: { valor: 9.5, descricao: 'combo' },
            combo2: { valor: 7.5, descricao: 'combo' },
        };
    }

    calcularValorDaCompra(metodoDePagamento, itens) {
        const pagamento = this.validarFormaPagamento(metodoDePagamento);
        if (pagamento) {
            return pagamento;
        }

        const itensDivididos = this.divideItens(itens);
        const itemNome = itensDivididos.map(item => item.item);
        const temCombo = this.validarCombo(itemNome);
        const erroExtras = this.validarPedidoExtras(itemNome, itensDivididos, temCombo);

        if (erroExtras) {
            return erroExtras;
        }

        const preco = this.calcularPreco(itemNome, itensDivididos.map(item => item.quantidade), temCombo, itensDivididos);
        const precoFinal = this.aplicarDesconto(metodoDePagamento, preco);
        const erroItens = this.validarItens(itemNome);

        if (erroItens) {
            return erroItens;
        }

        if (itens.length === 0) {
            return "Não há itens no carrinho de compra!";
        }

        const erroQuantidades = this.validarQuantidades(itensDivididos);
        if (erroQuantidades) {
            return erroQuantidades;
        }

        return this.formataMoeda(precoFinal)
    }

}

export { CaixaDaLanchonete };
