// Dados no localStorage
let contas = JSON.parse(localStorage.getItem('contas')) || [];

// Função para salvar
function salvar() {
    localStorage.setItem('contas', JSON.stringify(contas));
    desenharTabela();
    desenharGraficos();
}

// Adicionar Conta
function adicionarConta() {
    const nome = document.getElementById('nome').value;
    const tipo = document.getElementById('tipo').value;
    const subgrupo = document.getElementById('subgrupo').value;
    const valorAtual = parseFloat(document.getElementById('valorAtual').value);
    const valorIdeal = parseFloat(document.getElementById('valorIdeal').value);
    const importancia = parseInt(document.getElementById('importancia').value);

    if (!nome || !tipo || isNaN(valorAtual) || isNaN(valorIdeal)) {
        alert('Preencha todos os campos corretamente!');
        return;
    }

    contas.push({ nome, tipo, subgrupo, valorAtual, valorIdeal, importancia });
    salvar();

    // Limpar inputs
    document.getElementById('nome').value = '';
    document.getElementById('tipo').value = '';
    document.getElementById('subgrupo').value = '';
    document.getElementById('valorAtual').value = '';
    document.getElementById('valorIdeal').value = '';
    document.getElementById('importancia').value = '';
}

// Remover conta
function removerConta(index) {
    if (confirm('Deseja remover essa conta?')) {
        contas.splice(index, 1);
        salvar();
    }
}

// Tabela
function desenharTabela() {
    const tabela = document.getElementById('tabela-balanco');
    if (!tabela) return;

    let html = `
    <table>
      <tr>
        <th>Conta</th><th>Tipo</th><th>Subgrupo</th><th>Atual (R$)</th><th>Ideal (R$)</th>
        <th>Diferença</th><th>%</th><th>Importância</th><th>Recomendação</th><th>Ação</th>
      </tr>`;

    let totalAtivo = 0;
    let totalPassivo = 0;

    contas.forEach((c, i) => {
        if (c.tipo === 'Ativo') totalAtivo += c.valorAtual;
        if (c.tipo === 'Passivo') totalPassivo += c.valorAtual;

        const diferenca = c.valorIdeal - c.valorAtual;
        const percentual = ((c.valorAtual / (c.valorIdeal || 1)) * 100).toFixed(1);
        const recomendacao = diferenca > 0 ? 'Comprar/Adicionar' : 'OK';

        html += `
        <tr>
          <td>${c.nome}</td>
          <td>${c.tipo}</td>
          <td>${c.subgrupo}</td>
          <td>${c.valorAtual.toFixed(2)}</td>
          <td>${c.valorIdeal.toFixed(2)}</td>
          <td>${diferenca.toFixed(2)}</td>
          <td>${percentual}%</td>
          <td>${c.importancia || ''}</td>
          <td>${recomendacao}</td>
          <td><button onclick="removerConta(${i})">Excluir</button></td>
        </tr>`;
    });

    const saldo = totalAtivo - totalPassivo;
    const totalPL = saldo;

    html += `</table>
      <p><strong>Total Ativo:</strong> R$ ${totalAtivo.toFixed(2)}</p>
      <p><strong>Total Passivo:</strong> R$ ${totalPassivo.toFixed(2)}</p>
      <p><strong>Total PL (Patrimônio Líquido):</strong> R$ ${totalPL.toFixed(2)}</p>
      <p><strong>Saldo (Ativo - Passivo):</strong> R$ ${saldo.toFixed(2)}</p>
    `;

    tabela.innerHTML = html;
}

// =====================
// Gráficos
// =====================
let graficoPizza, graficoBarras, graficoImportancia;

function desenharGraficos() {
    const ctxPizza = document.getElementById('graficoPizza');
    const ctxBarras = document.getElementById('graficoBarras');
    const ctxImportancia = document.getElementById('graficoImportancia');

    const tipos = ['Ativo', 'Passivo'];
    const somaPorTipo = tipos.map(tipo =>
        contas.filter(c => c.tipo === tipo).reduce((acc, cur) => acc + cur.valorAtual, 0)
    );

    const labels = contas.map(c => c.nome);
    const atual = contas.map(c => c.valorAtual);
    const ideal = contas.map(c => c.valorIdeal);
    const importancia = contas.map(c => c.importancia || 0);

    if (ctxPizza) {
        if (graficoPizza) graficoPizza.destroy();
        graficoPizza = new Chart(ctxPizza, {
            type: 'pie',
            data: {
                labels: tipos,
                datasets: [{
                    label: 'Distribuição por Tipo',
                    data: somaPorTipo,
                    backgroundColor: ['#36A2EB', '#FF6384']
                }]
            }
        });
    }

    if (ctxBarras) {
        if (graficoBarras) graficoBarras.destroy();
        graficoBarras = new Chart(ctxBarras, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Atual',
                        data: atual,
                        backgroundColor: '#36A2EB'
                    },
                    {
                        label: 'Ideal',
                        data: ideal,
                        backgroundColor: '#FFCE56'
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }

    if (ctxImportancia) {
        if (graficoImportancia) graficoImportancia.destroy();
        graficoImportancia = new Chart(ctxImportancia, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Importância',
                    data: importancia,
                    backgroundColor: '#FF6384'
                }]
            }
        });
    }
}

// =====================
// Inicialização
// =====================
document.addEventListener('DOMContentLoaded', () => {
    desenharTabela();
    desenharGraficos();
});
