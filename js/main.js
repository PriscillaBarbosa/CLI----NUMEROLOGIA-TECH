
const formulario = document.getElementById('formNumerologia');
const btnCalcular = document.getElementById('btnCalcular');
const areaResultado = document.getElementById('areaResultado');
const textoResultado = document.getElementById('textoResultado');
const numeroResultado = document.getElementById('numeroResultado');


function calcularNumeroExpresso(nome) {
    const tabela = {'A':1,'J':1,'S':1,'B':2,'K':2,'T':2,'C':3,'L':3,'U':3,'D':4,'M':4,'V':4,'E':5,'N':5,'W':5,'F':6,'O':6,'X':6,'G':7,'P':7,'Y':7,'H':8,'Q':8,'Z':8,'I':9,'R':9};
    let nomeLimpo = nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/\s+/g, '');
    let soma = 0;
    
    for (let letra of nomeLimpo) {
        if (tabela[letra]) soma += tabela[letra];
    }
    
    while (soma > 9 && soma !== 11 && soma !== 22 && soma !== 33) {
        soma = soma.toString().split('').reduce((a, b) => a + parseInt(b), 0);
    }
    return soma;
}

formulario.addEventListener('submit', async function(event) {
    event.preventDefault();

    const nome = document.getElementById('nomeBatismo').value;
    const dataNascimento = document.getElementById('dataNascimento').value;
    
    if (nome.trim() === '' || dataNascimento === '') {
        alert('Por favor, preencha todos os campos.');
        return;
    }


    const numeroMagico = calcularNumeroExpresso(nome);
    numeroResultado.innerText = numeroMagico;

    btnCalcular.innerText = "Realizando os cálculos (IA processando)...";
    btnCalcular.disabled = true;
    areaResultado.classList.remove('d-none');
    textoResultado.innerHTML = "<em>Aguarde alguns segundos enquanto a inteligência artificial analisa a sua frequência...</em>";

    try {
        const resposta = await fetch('api/gerar_analise', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: nome, data: dataNascimento })
        });

        const dados = await resposta.json();

        if (dados.sucesso) {
            textoResultado.innerHTML = dados.analise;
        } else {
            textoResultado.innerText = "Erro: " + dados.erro;
            console.error("Detalhes do erro da API:", dados.detalhes);
        }

    } catch (erro) {
        console.error("Erro na comunicação:", erro);
        textoResultado.innerText = "Ocorreu um erro ao conectar com o servidor.";
    } finally {
        // Restaura o botão
        btnCalcular.innerText = "Calcular Destino";
        btnCalcular.disabled = false;
    }
});