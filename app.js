let contas = JSON.parse(localStorage.getItem('contas')) || [];

function salvarContas() {
    localStorage.setItem('contas', JSON.stringify(contas));
}

function adicionarConta() {
    const nome = document.getElementById('nomeConta').value.trim();
    const tipo = document.getElementById('tipoConta').value;
    const subgrupo = document.getElementById('subgrupoConta').value.trim();
    const valorAtual = parseFloat(document.getElementById('valorAtualConta').value);
    const valorIdeal = parseFloat(document.getElementById('valorIdealConta').value);
    const importancia = parseInt(document.getElementById('importanciaConta').value);

    if (!nome || isNaN(valorAtual) || isNaN(valorIdeal) || isNaN(importancia)) {
        alert('Preencha todos os campos corretamente.');
        return;
    }

    contas.push({ nome, tipo, subgrupo, valorAtual, valorIdeal, importancia });
    salvarContas();
    limparCampos();
    atualizarTabela();
    atualizarGraficos();
}

function limparCampos() {
    document.getElementById('nomeConta').value = '';
    document.getElementById('subgrupoConta').value = '';
    document.getElementById('valorAtualConta').value = '';
    document.getElementById('valorIdealConta').value = '';
    document.getElementById('importanciaConta').value = '';
}

function excluirConta(index) {
    contas.splice(index, 1);
    salvarContas();
    atualizarTabela();
    atualizarGraficos();
}

function atualizarTabela() {
    const tbody = document.querySelector('#tabelaContas tbody');
    tbody.innerHTML = '';

    let totalAtivo = 0;
    let totalPassivo = 0;

    contas.forEach((conta, index) => {
        if (conta.tipo === 'Ativo') totalAtivo += conta.valorAtual;
        if (conta.tipo === 'Passivo') totalPassivo += conta.valorAtual;

        const diferenca = conta.valorIdeal - conta.valorAtual;
        const percentual = conta.valorIdeal > 0 ? ((conta.valorAtual / conta.valorIdeal) * 100).toFixed(1) : '0';

        const recomendacao = diferenca > 0 ? 'Comprar' : 'Aguardar';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${conta.nome}</td>
            <td>${conta.tipo}</td>
            <td>${conta.subgrupo}</td>
            <td>R$ ${conta.valorAtual.toFixed(2)}</td>
            <td>R$ ${conta.valorIdeal.toFixed(2)}</td>
            <td>R$ ${diferenca.toFixed(2)}</td>
            <td>${percentual}%</td>
            <td>${conta.importancia}</td>
            <td>${recomendacao}</td>
            <td><button onclick="excluirConta(${index})">Excluir</button></td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('totalAtivo').textContent = `Total Ativo: R$ ${totalAtivo.toFixed(2)}`;
    document.getElementById('totalPassivo').textContent = `Total Passivo: R$ ${totalPassivo.toFixed(2)}`;
    document.getElementById('totalPL').textContent = `Total PL: R$ ${(totalAtivo - totalPassivo).toFixed(2)}`;
    document.getElementById('saldo').textContent = `Saldo (Ativo - Passivo): R$ ${(totalAtivo - totalPassivo).toFixed(2)}`;
}

let graficoPizza, graficoBarras, graficoImportancia;

function atualizarGraficos() {
    const tipos = {};
    const importanciaData = {};
    const nomes = [];
    const atual = [];
    const ideal = [];

    contas.forEach(conta => {
        tipos[conta.tipo] = (tipos[conta.tipo] || 0) + conta.valorAtual;
        importanciaData[conta.nome] = conta.importancia;
        nomes.push(conta.nome);
        atual.push(conta.valorAtual);
        ideal.push(conta.valorIdeal);
    });

    const cores = ['#2E86C1', '#28B463', '#F39C12', '#E74C3C', '#8E44AD', '#17A589'];

    // Gráfico Pizza
    if (graficoPizza) graficoPizza.destroy();
    graficoPizza = new Chart(document.getElementById('graficoPizza'), {
        type: 'pie',
        data: {
            labels: Object.keys(tipos),
            datasets: [{
                data: Object.values(tipos),
                backgroundColor: cores
            }]
        },
        options: {
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    // Gráfico Barras (Atual x Ideal)
    if (graficoBarras) graficoBarras.destroy();
    graficoBarras = new Chart(document.getElementById('graficoBarras'), {
        type: 'bar',
        data: {
            labels: nomes,
            datasets: [
                {
                    label: 'Atual (R$)',
                    data: atual,
                    backgroundColor: '#2E86C1'
                },
                {
                    label: 'Ideal (R$)',
                    data: ideal,
                    backgroundColor: '#28B463'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Gráfico de Importância
    if (graficoImportancia) graficoImportancia.destroy();
    graficoImportancia = new Chart(document.getElementById('graficoImportancia'), {
        type: 'bar',
        data: {
            labels: nomes,
            datasets: [{
                label: 'Nota de Importância',
                data: contas.map(c => c.importancia),
                backgroundColor: '#F39C12'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Inicializar na abertura da página
atualizarTabela();
atualizarGraficos();
