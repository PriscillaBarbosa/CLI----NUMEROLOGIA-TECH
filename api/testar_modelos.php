<?php
header('Content-Type: application/json');

// Coloque sua chave de API aqui
$apiKey = 'AIzaSyC-UgVRsI03eyTRlSV7uwuceTIQgEYtNxQ'; 

// Esta URL pergunta ao Google: "Quais modelos eu posso usar?"
$url = "https://generativelanguage.googleapis.com/v1beta/models?key=" . $apiKey;

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Evita erro no Linux
$resposta = curl_exec($ch);
curl_close($ch);

echo $resposta;
?>