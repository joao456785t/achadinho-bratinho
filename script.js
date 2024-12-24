const searchForm = document.querySelector('.search-form'); // Seleciona o formulário
const productlist = document.querySelector('.product-list');
let myChart = ''; // Declaração da variável do gráfico

searchForm.addEventListener('submit', async function (event) {
    event.preventDefault(); // Previne o comportamento padrão (não recarregar a página)
    const inputValue = event.target[0].value; // Obtém o valor do campo de entrada
    console.log(inputValue); // Mostra o valor digitado no console

    // Faz a requisição para a API
    const data = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${inputValue}`);
    const products = (await data.json()).results.slice(0, 10); // Pega os 10 primeiros produtos

    displayItems(products); // Exibe os produtos na página
    updatePriceChart(products); // Atualiza o gráfico de preços
    console.log(products); // Mostra os produtos no console
});

// Função para exibir os produtos na página
function displayItems(products) {
    productlist.innerHTML = products
        .map(product => `
            <div class="product-card">
                <img src="${product.thumbnail.replace(/\w\.jpg/gi, 'W.jpg')}" alt="${product.title}">
                <h2>${product.title}</h2>
                <p class="produto">R$ ${product.price.toFixed(2)}</p>
                <p class="loja">Loja: ${product.seller?.nickname || 'Não disponível'}</p>
            </div>
        `)
        .join(''); // Une os elementos em uma única string para exibição
}

// Função para atualizar o gráfico de preços
function updatePriceChart(products) {
    const ctx = document.getElementById('priceChart').getContext('2d'); // Correção de 'priceChat' para 'priceChart'

    // Destrói o gráfico anterior, se houver
    if (myChart) {
        myChart.destroy();
    }

    // Criação do novo gráfico
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: products.map(p => p.title.substring(0, 20) + '...'), // Limita o título a 20 caracteres
            datasets: [{
                label: 'Preço (R$)',
                data: products.map(p => p.price), // Preço dos produtos
                backgroundColor: 'rgba(46, 204, 113, 0.6)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return 'R$ ' + value.toFixed(2); // Exibe o valor com o símbolo de reais
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Desativa a legenda
                },
                title: {
                    display: true,
                    text: 'Comparação de Preços',
                    font: {
                        size: 18
                    }
                }
            }
        }
    });
}
