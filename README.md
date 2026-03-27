# 🔮 Numerologia Tech | Análise Vibracional com IA

Uma aplicação web full-stack que une cálculos precisos de Numerologia Pitagórica com Inteligência Artificial Generativa (Google Gemini API) para fornecer insights profundos sobre carreira e autoconhecimento.

## 🚀 O Projeto

Esta Landing Page foi desenvolvida para calcular instantaneamente os números de Expressão, Motivação, Impressão e Caminho de Vida de um usuário com base em seu nome de batismo e data de nascimento. Os dados calculados são então processados por IA para gerar uma leitura personalizada e formatada em tempo real.

🔗 **Acesse o portfólio:** [priscillabarbosa.com.br](https://priscillabarbosa.com.br)

## 🛠️ Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3 (Custom Variables + Bootstrap 5), Vanilla JavaScript (ES6+)
* **Backend:** PHP (Processamento de dados e segurança de chaves)
* **Inteligência Artificial:** API REST do Google Gemini (`gemini-2.5-flash`)
* **Integração:** cURL (PHP) e Fetch API (JavaScript)

## 🧠 Arquitetura e Decisões Técnicas

Para garantir 100% de precisão e evitar "alucinações" comuns em LLMs (Large Language Models) ao lidar com matemática, foi aplicada uma **Separação de Responsabilidades (Separation of Concerns)**:

1. **Backend Lógico:** O PHP é responsável por higienizar as strings (remoção de acentos/espaços) e aplicar o algoritmo matemático pitagórico, respeitando as regras de redução (exceção para Números Mestres 11, 22 e 33).
2. **Processamento de Linguagem Natural (NLP):** A API do Gemini não realiza cálculos. Ela recebe os valores exatos pré-calculados pelo backend e utiliza um prompt parametrizado (Temperature = 0.2) focado exclusivamente na geração de texto e sugestão de arquétipos.
3. **Segurança:** A API Key do Google é mantida no lado do servidor (PHP), garantindo que credenciais sensíveis não fiquem expostas no código do cliente (Frontend).

## ⚙️ Como rodar o projeto localmente

Pré-requisitos: Ter o PHP e a extensão cURL instalados na máquina.

1. Clone o repositório:
   ```bash
   git clone [https://github.com/PriscillaBarbosa/numerologia-tech.git](https://github.com/PriscillaBarbosa/numerologia-tech.git)