<?php
    header('Content-Type: application/json');

    $dados = json_decode(file_get_contents('php://input'), true);
    $nome = $dados['nome'] ?? '';
    $data = $dados['data'] ?? '';

    if(empty($nome) || empty($data)) {
        echo json_encode(['erro' => 'Nome e data são obrigatórios.']);
        exit;
    }

// ==========================================
// 1. LÓGICA MATEMÁTICA (O Código faz a conta!)
// ==========================================
function calcularNumerologia($nome, $data) {
    // Remove acentos e caracteres especiais com segurança
    $comAcentos = array('à','á','â','ã','ä','ç','è','é','ê','ë','ì','í','î','ï','ñ','ò','ó','ô','õ','ö','ù','ú','û','ü','ý','À','Á','Â','Ã','Ä','Ç','È','É','Ê','Ë','Ì','Í','Î','Ï','Ñ','Ò','Ó','Ô','Õ','Ö','Ù','Ú','Û','Ü','Ý');
    $semAcentos = array('a','a','a','a','a','c','e','e','e','e','i','i','i','i','n','o','o','o','o','o','u','u','u','u','y','A','A','A','A','A','C','E','E','E','E','I','I','I','I','N','O','O','O','O','O','U','U','U','U','Y');
    
    $nomeLimpo = str_replace($comAcentos, $semAcentos, $nome);
    $nomeLimpo = strtoupper(preg_replace('/[^A-Za-z]/', '', $nomeLimpo));
    
    $tabela = ['A'=>1,'J'=>1,'S'=>1,'B'=>2,'K'=>2,'T'=>2,'C'=>3,'L'=>3,'U'=>3,'D'=>4,'M'=>4,'V'=>4,'E'=>5,'N'=>5,'W'=>5,'F'=>6,'O'=>6,'X'=>6,'G'=>7,'P'=>7,'Y'=>7,'H'=>8,'Q'=>8,'Z'=>8,'I'=>9,'R'=>9];
    $vogaisLista = ['A','E','I','O','U'];
    
    $exp = 0; $mot = 0; $imp = 0;
    
    // Calcula Expressão, Motivação e Impressão
    for ($i = 0; $i < strlen($nomeLimpo); $i++) {
        $letra = $nomeLimpo[$i];
        if (isset($tabela[$letra])) {
            $valor = $tabela[$letra];
            $exp += $valor;
            if (in_array($letra, $vogaisLista)) {
                $mot += $valor;
            } else {
                $imp += $valor;
            }
        }
    }
    
    // Calcula Caminho de Vida (Data)
    $dataLimpa = preg_replace('/[^0-9]/', '', $data);
    $caminho = 0;
    for ($i = 0; $i < strlen($dataLimpa); $i++) {
        $caminho += (int)$dataLimpa[$i];
    }
    
    // Função de Redução (mantém 11, 22, 33)
    function reduzir($num) {
        while ($num > 9 && $num != 11 && $num != 22 && $num != 33) {
            $num = array_sum(str_split((string)$num));
        }
        return $num;
    }
    
    return [
        'expressao' => reduzir($exp),
        'motivacao' => reduzir($mot),
        'impressao' => reduzir($imp),
        'caminho' => reduzir($caminho)
    ];
}

$numerosCalc = calcularNumerologia($nome, $data);

// ==========================================
// 2. COMUNICAÇÃO COM A IA
// ==========================================
$apiKey ='AIzaSyC-UgVRsI03eyTRlSV7uwuceTIQgEYtNxQ'; 

// O Prompt agora entrega o cálculo mastigado para a IA
$prompt = "Você é o 'Numerólogo Pro'. Escreva uma análise para esta pessoa.
A MATEMÁTICA JÁ FOI FEITA. Use EXATAMENTE os números abaixo, não recalcule nada:
- Número de Expressão (Destino): {$numerosCalc['expressao']}
- Número de Motivação (Alma): {$numerosCalc['motivacao']}
- Número de Impressão (Aparência): {$numerosCalc['impressao']}
- Caminho de Vida: {$numerosCalc['caminho']}

Regras:
1. Forneça uma análise profunda focada em carreira, tecnologia e autoconhecimento.
2. Sugira uma cor e um cristal ideais para a área de trabalho, baseando-se no Número de Expressão.
3. Formate em HTML limpo (apenas <p>, <strong>, <ul>, <h3>). Não use formatação Markdown.";

$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . $apiKey;

$payload = json_encode([
    "contents" => [
        ["parts" => [["text" => $prompt]]]
    ],
    "generationConfig" => [
        "temperature" => 0.2 // Quase zero para manter fidelidade aos números
    ]
]);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 

$resposta = curl_exec($ch);
curl_close($ch);

$resultado_gemini = json_decode($resposta, true);

if(isset($resultado_gemini['candidates'][0]['content']['parts'][0]['text'])) {
    $texto_final = $resultado_gemini['candidates'][0]['content']['parts'][0]['text'];
    echo json_encode(['sucesso' => true, 'analise' => $texto_final]);
} else {
    echo json_encode(['sucesso' => false, 'erro' => 'A IA falhou em processar o texto.', 'detalhes' => $resultado_gemini]);
}
?>