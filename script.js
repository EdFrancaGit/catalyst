let database = []; // Variável global para armazenar o banco de dados

function loadDatabase() {
    console.log('loadDatabase() chamado'); // Adicionado log
    fetch('database.csv') // Busca o arquivo CSV
        .then(response => {
            console.log('Resposta do fetch:', response); // Adicionado log
            if (!response.ok) {
                throw new Error(`Erro ao carregar o banco de dados: ${response.status}`);
            }
            return response.text();
        }) // Converte a resposta para texto
        .then(csv => {
            console.log('Dados CSV:', csv); // Adicionado log
            const lines = csv.split('\n'); // Divide o texto em linhas
            const headers = lines[0].split(','); // Pega os cabeçalhos
            database = lines.slice(1).map(line => { // Processa cada linha
                const values = line.split(',');
                return headers.reduce((obj, header, index) => {
                    obj[header] = values[index] || ''; // Adiciona o valor ou string vazia se não houver valor
                    return obj;
                }, {});
            });
            console.log('Banco de dados carregado:', database); // Adicionado log
        })
        .catch(error => console.error('Erro ao carregar o banco de dados:', error));
}

function extractTags() {
    const text = document.getElementById("inputText").value;
    // Extração básica de palavras-chave (melhorada para lidar com pontuação)
    const words = text.split(/\W+/); // Divide o texto em palavras usando não-palavras como separadores
    const filteredWords = words.filter(word => word.length > 0); // Remove palavras vazias
    const uniqueWords = [...new Set(filteredWords)]; // Remove duplicatas
    const tagsDiv = document.getElementById("tags");
    tagsDiv.innerHTML = "";

    uniqueWords.slice(0, 5).forEach(word => {
        const tag = document.createElement("span");
        tag.textContent = word;
        // Adiciona um estilo básico para visualização
        tag.style.display = "inline-block"; // Para que o margin funcione
        tag.style.marginRight = "5px"; // Adiciona espaço entre as tags
        tag.style.backgroundColor = "#f0f0f0"; // Cor de fundo para destacar
        tag.style.padding = "2px 5px"; // Espaçamento interno
        tag.style.borderRadius = "3px"; // Borda arredondada
        tagsDiv.appendChild(tag);

        searchDatabase(uniqueWords[0]); // Busca com a primeira tag
    });
}

function searchDatabase(tag) {
    console.log('searchDatabase() chamado com tag:', tag); // Adicionado log
    const searchTerm = tag.toLowerCase().trim();

    const results = database.filter(item => {
        const tema = item.Tema ? item.Tema.toLowerCase().trim() : '';
        return tema.includes(searchTerm);
    });

     console.log('Resultados da busca:', results);

    displayResults(results);
}

function displayResults(results) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = ""; // Limpa resultados anteriores

    if (results.length > 0) {
        results.forEach((result, index) => {
            const resultElement = document.createElement("div");
            resultElement.innerHTML = `
                <b>Autor:</b> ${result.Autor}<br>
                <b>Obra:</b> ${result.Obra}<br>
                <b>Observações:</b> ${result.Observacoes}<br>
                <button onclick="selectResult(${index})">Selecionar</button><br><br>
            `;
            resultsDiv.appendChild(resultElement);
        });
    } else {
        resultsDiv.innerHTML = "Nenhuma referência encontrada.";
    }
}

function selectResult(index) {
    const selectedResult = database[index];
    displayAnalysis(selectedResult);
}

function displayAnalysis(result) {
    const resultDiv = document.getElementById("result");
    if (result) {
        const inputText = document.getElementById("inputText").value;
        const analysis = `O texto aborda a linguagem politicamente correta de forma semelhante a ${result.Autor}, especialmente em relação a ${result.Obra}.`;

        resultDiv.innerHTML = `
            <h3>Referência Encontrada:</h3>
            <b>Autor:</b> ${result.Autor}<br>
            <b>Obra:</b> ${result.Obra}<br>
            <b>Observações:</b> ${result.Observacoes}<br><br>
            <b>Análise:</b> ${analysis}
        `;
    } else {
        resultDiv.innerHTML = "Nenhuma referência encontrada.";
    }
}

// Carrega o banco de dados quando a página é carregada
window.onload = loadDatabase;
