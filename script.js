const searchForm = document.querySelector('.search-form'); // Seleciona o formulário
const productlist = document.querySelector('.product-list');
let myChart = '';

searchForm.addEventListener('submit', async function(event) {
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

function updatePriceChart(products) {
    const ctx = document.getElementById('priceChart').getContext('2d'); // Seleciona o canvas com id "priceChart"
    
    // Destrói o gráfico anterior, se houver
    if (myChart) {
        myChart.destroy();
    }

    // Criação do novo gráfico
    myChart = new Chart(ctx, {
        type: 'bar',  // Tipo de gráfico (barras)
        data: {
            labels: products.map(p => p.title.substring(0, 20) + '...'), // Títulos dos produtos (limitados a 20 caracteres)
            datasets: [{
                label: 'Preço (R$)', // Rótulo do eixo Y
                data: products.map(p => p.price), // Preços dos produtos
                backgroundColor: 'rgba(46, 204, 113, 0.6)', // Cor das barras
                borderColor: 'rgba(46, 204, 113, 1)', // Cor das bordas das barras
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,  // Gráfico responsivo
            scales: {
                y: {
                    beginAtZero: true,  // Inicia o eixo Y do gráfico no zero
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value.toFixed(2); // Formatação para os valores no eixo Y
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Desativa a legenda do gráfico
                },
                title: {
                    display: true,
                    text: 'Comparação de Preços', // Título do gráfico
                    font: {
                        size: 18
                    }
                }
            }
        }
    });
}
