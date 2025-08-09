// converte letra para número (a=1,... z=26), espaço=0
function letraParaNumero(c) {
    if (c === ' ') return 0;
    const code = c.charCodeAt(0);
    if (code >= 97 && code <= 122) return code - 96;
    return 0;
}
// converte número para letra (0 = espaço)
function numeroParaLetra(n) {
    if (n === 0) return ' ';
    return String.fromCharCode(n + 96);
}

// parse matriz da textarea, retorna matriz de números
function parseMatriz(text) {
    let linhas = text.trim().split('\n');
    let matriz = linhas.map(linha =>
        linha.trim().split(/\s+/).map(Number)
    );
    const n = matriz.length;
    if (!matriz.every(linha => linha.length === n)) {
        throw 'Matriz deve ser quadrada e ter todas as linhas com o mesmo número de elementos';
    }
    return matriz;
}

// multiplica matrizes A (m x n) e B (n x p)
function multiplicarMatrizes(A, B) {
    const m = A.length;
    const n = A[0].length;
    const p = B[0].length;
    if (B.length !== n) throw 'Dimensões incompatíveis para multiplicação';
    let C = Array(m).fill(0).map(() => Array(p).fill(0));
    for (let i=0; i<m; i++) {
        for (let j=0; j<p; j++) {
            let soma = 0;
            for (let k=0; k<n; k++) {
                soma += A[i][k]*B[k][j];
            }
            C[i][j] = soma;
        }
    }
    return C;
}

// inversa de matriz 2x2 ou 3x3
function inversa(m) {
    const n = m.length;
    if (n === 2) {
        const det = m[0][0]*m[1][1] - m[0][1]*m[1][0];
        if (det === 0) throw 'Determinante zero, matriz não invertível';
        const invDet = 1/det;
        return [
            [ m[1][1]*invDet, -m[0][1]*invDet ],
            [-m[1][0]*invDet,  m[0][0]*invDet ]
        ];
    } else if (n === 3) {
        const det = 
            m[0][0]*(m[1][1]*m[2][2] - m[1][2]*m[2][1]) -
            m[0][1]*(m[1][0]*m[2][2] - m[1][2]*m[2][0]) +
            m[0][2]*(m[1][0]*m[2][1] - m[1][1]*m[2][0]);
        if (det === 0) throw 'Determinante zero, matriz não invertível';
        const invDet = 1/det;
        let cof = [
            [
                (m[1][1]*m[2][2] - m[1][2]*m[2][1]),
                -(m[0][1]*m[2][2] - m[0][2]*m[2][1]),
                (m[0][1]*m[1][2] - m[0][2]*m[1][1])
            ],
            [
                -(m[1][0]*m[2][2] - m[1][2]*m[2][0]),
                (m[0][0]*m[2][2] - m[0][2]*m[2][0]),
                -(m[0][0]*m[1][2] - m[0][2]*m[1][0])
            ],
            [
                (m[1][0]*m[2][1] - m[1][1]*m[2][0]),
                -(m[0][0]*m[2][1] - m[0][1]*m[2][0]),
                (m[0][0]*m[1][1] - m[0][1]*m[1][0])
            ]
        ];
        let inv = [];
        for (let i=0; i<3; i++) {
            inv[i] = [];
            for (let j=0; j<3; j++) {
                inv[i][j] = cof[j][i] * invDet;
            }
        }
        return inv;
    } else {
        throw 'Apenas matrizes 2x2 e 3x3 suportadas';
    }
}

// converte frase para matriz (colunas = ceil(tamanho / n))
function fraseParaMatriz(frase, n) {
    frase = frase.toLowerCase().replace(/[^a-z ]/g,'');
    let nums = [...frase].map(letraParaNumero);
    while (nums.length % n !== 0) nums.push(0); // preenche com zeros
    const colunas = nums.length / n;
    let matriz = [];
    for (let i=0; i<n; i++) {
        matriz[i] = [];
        for (let j=0; j<colunas; j++) {
            matriz[i][j] = nums[i + j*n];
        }
    }
    return matriz;
}

// converte matriz para frase (arredonda os números)
function matrizParaFrase(matriz) {
    const n = matriz.length;
    const colunas = matriz[0].length;
    let chars = [];
    for (let j=0; j<colunas; j++) {
        for (let i=0; i<n; i++) {
            chars.push(numeroParaLetra(Math.round(matriz[i][j])));
        }
    }
    while (chars.length && chars[chars.length-1] === ' ') chars.pop();
    return chars.join('');
}

// formata matriz para string exibida
function matrizParaTexto(matriz) {
    return matriz.map(linha => linha.map(x => x.toFixed(2)).join(' ')).join('\n');
}

// parse string para matriz a partir do textarea (mesmo formato)
function textoParaMatriz(texto) {
    let linhas = texto.trim().split('\n');
    return linhas.map(linha => linha.trim().split(/\s+/).map(Number));
}

function criptografar() {
    try {
        const texto = document.getElementById('texto').value;
        const chaveText = document.getElementById('matrizChave').value;
        const matrizChave = parseMatriz(chaveText);
        const n = matrizChave.length;

        // Converte frase em matriz numérica
        const matrizTexto = fraseParaMatriz(texto, n);

        // Multiplica matriz chave pela matriz do texto
        const cifrada = multiplicarMatrizes(matrizChave, matrizTexto);

        // Mostra resultado formatado
        document.getElementById('resultado').textContent = matrizParaTexto(cifrada);

        // Preenche a textarea de descriptografia automaticamente
        document.getElementById('matrizCriptografada').value = matrizParaTexto(cifrada);

        document.getElementById('decifrado').textContent = '';
    } catch (e) {
        alert('Erro: ' + e);
    }
}

function descriptografar() {
    try {
        const chaveText = document.getElementById('matrizChave').value;
        const matrizChave = parseMatriz(chaveText);
        const matrizCifradaText = document.getElementById('matrizCriptografada').value;

        const matrizCifrada = textoParaMatriz(matrizCifradaText);
        const n = matrizChave.length;

        // Verifica dimensões
        if (matrizCifrada.length !== n) throw 'Matriz criptografada deve ter mesma ordem que a matriz chave';

        // Calcula inversa da matriz chave
        const invChave = inversa(matrizChave);

        // Multiplica inversa pela matriz cifrada
        const decifradaMat = multiplicarMatrizes(invChave, matrizCifrada);

        // Converte para texto
        const frase = matrizParaFrase(decifradaMat);

        document.getElementById('decifrado').textContent = frase;
    } catch (e) {
        alert('Erro: ' + e);
    }
}
