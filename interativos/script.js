function lerMatriz(textareaId) {
  const texto = document.getElementById(textareaId).value.trim();
  if (!texto) return null;
  return texto.split('\n').map(linha => linha.trim().split(/\s+/).map(Number));
}

function exibirMatriz(matriz) {
  const topo = '⎡';
  const meio = '⎢';
  const base = '⎣';
  const direitaTopo = '⎤';
  const direitaMeio = '⎥';
  const direitaBase = '⎦';

  // calcula o maior número de caracteres em cada coluna para alinhamento
  const colWidths = matriz[0].map((_, colIndex) =>
    Math.max(...matriz.map(row => String(row[colIndex]).length))
  );

  return matriz.map((linha, i, arr) => {
    const colcheteEsq = i === 0 ? topo : (i === arr.length - 1 ? base : meio);
    const colcheteDir = i === 0 ? direitaTopo : (i === arr.length - 1 ? direitaBase : direitaMeio);
    const linhaFormatada = linha.map((val, j) => String(val).padStart(colWidths[j], ' ')).join(' ');
    return `${colcheteEsq} ${linhaFormatada} ${colcheteDir}`;
  }).join('\n');
}



function soma(A, B) {
  return A.map((linha, i) => linha.map((val, j) => val + B[i][j]));
}

function subtrai(A, B) {
  return A.map((linha, i) => linha.map((val, j) => val - B[i][j]));
}

function multiplica(A, B) {
  const result = [];
  for (let i = 0; i < A.length; i++) {
    result[i] = [];
    for (let j = 0; j < B[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < A[0].length; k++) {
        sum += A[i][k] * B[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

function multiplicaPorEscalar(A, escalar) {
  return A.map(l => l.map(val => val * escalar));
}

function transposta(A) {
  return A[0].map((_, j) => A.map(linha => linha[j]));
}

function inversa(matriz) {
  const n = matriz.length;
  const I = matriz.map((_, i) => Array.from({ length: n }, (_, j) => i === j ? 1 : 0));
  const M = matriz.map(linha => linha.slice());

  for (let i = 0; i < n; i++) {
    let fator = M[i][i];
    if (fator === 0) throw "Matriz não inversível!";
    for (let j = 0; j < n; j++) {
      M[i][j] /= fator;
      I[i][j] /= fator;
    }
    for (let k = 0; k < n; k++) {
      if (k === i) continue;
      let f = M[k][i];
      for (let j = 0; j < n; j++) {
        M[k][j] -= f * M[i][j];
        I[k][j] -= f * I[i][j];
      }
    }
  }
  return I;
}

function calcularMatriz() {
  const op = document.getElementById("operacao").value;
  const A = lerMatriz("matrizA");
  const B = lerMatriz("matrizB");
  const escalar = parseFloat(document.getElementById("escalar").value);
  const resDiv = document.getElementById("resultado");

  try {
    let resultado;
    switch (op) {
      case "soma":
        if (!A || !B) throw "Forneça as duas matrizes.";
        resultado = soma(A, B);
        break;
      case "subtracao":
        if (!A || !B) throw "Forneça as duas matrizes.";
        resultado = subtrai(A, B);
        break;
      case "multiplicacao":
        if (!A || !B) throw "Forneça as duas matrizes.";
        resultado = multiplica(A, B);
        break;
      case "escalar":
        if (!A || isNaN(escalar)) throw "Forneça a matriz A e um escalar.";
        resultado = multiplicaPorEscalar(A, escalar);
        break;
      case "transposta":
        if (!A) throw "Forneça a matriz A.";
        resultado = transposta(A);
        break;
      case "inversa":
        if (!A) throw "Forneça a matriz A quadrada.";
        if (A.length !== A[0].length) throw "Somente matrizes quadradas podem ser invertidas.";
        resultado = inversa(A);
        break;
    }
    resDiv.innerText = `Resultado:\n${exibirMatriz(resultado)}`;
  } catch (erro) {
    resDiv.innerText = `Erro: ${erro}`;
  }
}

document.getElementById("operacao").addEventListener("change", () => {
  const op = document.getElementById("operacao").value;
  document.getElementById("escalar").style.display = (op === "escalar") ? "inline-block" : "none";
});
