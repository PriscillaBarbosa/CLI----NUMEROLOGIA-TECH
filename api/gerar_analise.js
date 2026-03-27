export default async function handler(req, res) {
    
    if (req.method !== 'POST') {
        return res.status(405).json({ erro: 'Método não permitido' });
    }

    const { nome, data } = req.body;

    if (!nome || !data) {
        return res.status(400).json({ erro: 'Nome e data são obrigatórios.' });
    }

    
    function calcularNumerologia(nomeStr, dataStr) {
        const nomeLimpo = nomeStr.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/[^A-Z]/g, '');
        const tabela = {'A':1,'J':1,'S':1,'B':2,'K':2,'T':2,'C':3,'L':3,'U':3,'D':4,'M':4,'V':4,'E':5,'N':5,'W':5,'F':6,'O':6,'X':6,'G':7,'P':7,'Y':7,'H':8,'Q':8,'Z':8,'I':9,'R':9};
        const vogais = ['A','E','I','O','U'];
        
        let exp = 0, mot = 0, imp = 0;
        
        for (let letra of nomeLimpo) {
            if (tabela[letra]) {
                const valor = tabela[letra];
                exp += valor;
                if (vogais.includes(letra)) mot += valor;
                else imp += valor;
            }
        }
        
        const dataLimpa = dataStr.replace(/[^0-9]/g, '');
        let caminho = 0;
        for (let num of dataLimpa) caminho += parseInt(num);
        
        function reduzir(num) {
            while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
                num = num.toString().split('').reduce((a, b) => a + parseInt(b), 0);
            }
            return num;
        }
        
        return {
            expressao: reduzir(exp),
            motivacao: reduzir(mot),
            impressao: reduzir(imp),
            caminho: reduzir(caminho)
        };
    }

    const numerosCalc = calcularNumerologia(nome, data);

    const apiKey = process.env.GEMINI_API_KEY; 

    const prompt = `Você é o 'Numerólogo Tech'. Escreva uma análise para esta pessoa.
    A MATEMÁTICA JÁ FOI FEITA. Use EXATAMENTE os números abaixo, não recalcule nada:
    - Número de Expressão (Destino): ${numerosCalc.expressao}
    - Número de Motivação (Alma): ${numerosCalc.motivacao}
    - Número de Impressão (Aparência): ${numerosCalc.impressao}
    - Caminho de Vida: ${numerosCalc.caminho}

    Regras:
    1. Forneça uma análise profunda focada em carreira, tecnologia e autoconhecimento.
    2. Sugira uma cor e um cristal ideais usando a tabela base do Número de Expressão.
    3. Formate em HTML limpo (apenas <p>, <strong>, <ul>, <h3>). Não use formatação Markdown.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    try {
        const resposta = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.2 }
            })
        });

        const dadosGemini = await resposta.json();

        if (dadosGemini.candidates && dadosGemini.candidates[0]) {
            const textoFinal = dadosGemini.candidates[0].content.parts[0].text;
            return res.status(200).json({ sucesso: true, analise: textoFinal });
        } else {
            return res.status(500).json({ sucesso: false, erro: 'A IA falhou em processar o texto.', detalhes: dadosGemini });
        }
    } catch (erro) {
        return res.status(500).json({ sucesso: false, erro: 'Erro de conexão no servidor.', detalhes: erro.message });
    }
}