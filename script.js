// Cardápio com itens e preços
let cardapio = {
    1: { nome: "Espeto de Carne", preco: 10.00 },
    2: { nome: "Coração", preco: 10.00 },
    3: { nome: "Misto", preco: 10.00 },
    4: { nome: "Linguiça", preco: 10.00 },
    5: { nome: "Queijo", preco: 10.00 },
    6: { nome: "Pão de Alho", preco: 10.00 },
    7: { nome: "Frango", preco: 10.00 },
    8: { nome: "Medalhão", preco: 10.00 },
    9: { nome: "Jantinha de Carne", preco: 25.00 },
    10: { nome: "Jantinha de Coração", preco: 25.00 },
    11: { nome: "Jantinha Mista", preco: 25.00 },
    12: { nome: "Jantinha de Linguiça", preco: 25.00 },
    13: { nome: "Jantinha de Queijo", preco: 25.00 },
    14: { nome: "Jantinha de Pão de Alho", preco: 25.00 },
    15: { nome: "Jantinha de Frango", preco: 25.00 },
    16: { nome: "Jantinha de Medalhão", preco: 25.00 },
    17: { nome: "Refrigerante mini", preco: 3.00 }
};

// Variáveis para armazenar o pedido atual, total e lista de clientes
let pedido = [];
let total = 0.00;
let clientes = [];

// Função para adicionar um item ao pedido
function adicionarItem(itemId) {
    const item = cardapio[itemId];
    const itemExistente = pedido.find(p => p.item === item.nome);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        pedido.push({ item: item.nome, quantidade: 1, preco: item.preco });
    }

    total += item.preco;
    atualizarPedido();
    salvarNoLocalStorage();  // Salva o pedido atualizado no LocalStorage
}

// Função para remover um item do pedido
function removerItem(itemId) {
    const item = cardapio[itemId];
    const index = pedido.findIndex(p => p.item === item.nome);

    if (index !== -1) {
        pedido[index].quantidade -= 1;
        total -= item.preco;

        if (pedido[index].quantidade === 0) {
            pedido.splice(index, 1);
        }

        atualizarPedido();
        salvarNoLocalStorage();  // Salva o pedido atualizado no LocalStorage
    }
}

// Função para atualizar a lista de pedidos na interface
function atualizarPedido() {
    const pedidoLista = document.getElementById("pedido-lista");
    pedidoLista.innerHTML = "";

    pedido.forEach(p => {
        const li = document.createElement("li");
        li.innerHTML = `${p.quantidade}x ${p.item} - R$ ${(p.preco * p.quantidade).toFixed(2)}
                        <button onclick="removerItem(${Object.keys(cardapio).find(key => cardapio[key].nome === p.item)})">Remover</button>`;
        pedidoLista.appendChild(li);
    });

    document.getElementById("total").innerText = total.toFixed(2);
}

// Função para finalizar o pedido e salvar na lista de pedidos realizados
function finalizarPedido() {
    const nome = document.getElementById("cliente").value;
    if (!nome) {
        alert("Por favor, insira o nome do cliente.");
        return;
    }

    if (pedido.length === 0) {
        alert("O pedido está vazio.");
        return;
    }

    const clientePedido = {
        nome: nome,
        pedido: [...pedido],
        total: total
    };

    clientes.push(clientePedido);

    atualizarPedidosRealizados();  // Atualiza os pedidos realizados corretamente
    pedido = [];
    total = 0.00;
    atualizarPedido();
    salvarNoLocalStorage();  // Salva o novo pedido e lista de clientes no LocalStorage
    document.getElementById("cliente").value = "";
}

// Função para ver os detalhes de um pedido
function verDetalhes(index) {
    const cliente = clientes[index];
    
    if (!cliente) {
        alert("Erro: Pedido não encontrado.");
        return;
    }

    let detalhes = `<strong>Cliente:</strong> ${cliente.nome}<br>Total: R$ ${cliente.total.toFixed(2)}<br><strong>Itens:</strong><br>`;
    
    cliente.pedido.forEach(p => {
        detalhes += `${p.quantidade}x ${p.item} - R$ ${(p.preco * p.quantidade).toFixed(2)}<br>`;
    });

    // Exibe os detalhes no elemento com o id 'pedido-detalhes'
    const detalhesContainer = document.getElementById("pedido-detalhes");
    detalhesContainer.innerHTML = detalhes;
    detalhesContainer.style.display = 'block';  // Garante que o contêiner de detalhes seja visível
}

// Função para apagar um pedido
function apagarPedido(index) {
    clientes.splice(index, 1);
    const pedidosRealizados = document.getElementById("pedidos-realizados");
    pedidosRealizados.removeChild(pedidosRealizados.children[index]);
    salvarNoLocalStorage();  // Atualiza o LocalStorage após remover o pedido
}

// Função para salvar os dados no LocalStorage
function salvarNoLocalStorage() {
    localStorage.setItem('clientes', JSON.stringify(clientes));
    localStorage.setItem('pedidoAtual', JSON.stringify(pedido));
    localStorage.setItem('total', total.toFixed(2));
}

// Função para carregar os dados do LocalStorage ao iniciar a página
function carregarDoLocalStorage() {
    const clientesSalvos = localStorage.getItem('clientes');
    const pedidoSalvo = localStorage.getItem('pedidoAtual');
    const totalSalvo = localStorage.getItem('total');

    if (clientesSalvos) {
        clientes = JSON.parse(clientesSalvos);
        atualizarPedidosRealizados();
    }

    if (pedidoSalvo) {
        pedido = JSON.parse(pedidoSalvo);
        total = parseFloat(totalSalvo);
        atualizarPedido();
    }
}

// Função para atualizar a lista de pedidos realizados na interface
function atualizarPedidosRealizados() {
    const pedidosRealizados = document.getElementById("pedidos-realizados");
    pedidosRealizados.innerHTML = "";

    clientes.forEach((clientePedido, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${clientePedido.nome}</strong>:<br>Total: R$ ${clientePedido.total.toFixed(2)}
                        <button onclick="verDetalhes(${index})">Ver Detalhes</button>
                        <button onclick="apagarPedido(${index})">Apagar Pedido</button>`;
        pedidosRealizados.appendChild(li);
    });
}

// Carregar os dados do LocalStorage quando a página for aberta
window.onload = function () {
    carregarDoLocalStorage();
};
