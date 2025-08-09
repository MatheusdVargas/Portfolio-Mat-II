function calcularTrigonometria() {
  const anguloGraus = parseFloat(document.getElementById("angulo").value);
  const tipo = document.getElementById("tipoCateto").value;
  const medida = parseFloat(document.getElementById("medida").value);
  const resultadoDiv = document.getElementById("resultado-trigonometria");

  if (isNaN(anguloGraus) || isNaN(medida) || anguloGraus <= 0 || anguloGraus >= 90 || medida <= 0) {
    resultadoDiv.textContent = "Erro: Forneça um ângulo entre 0 e 90 graus e uma medida válida.";
    return;
  }

  const anguloRad = anguloGraus * Math.PI / 180;
  let seno, cosseno, tangente;

  if (tipo === "oposto") {
    seno = medida / 1;
    cosseno = Math.cos(anguloRad);
    tangente = Math.tan(anguloRad);
    seno = Math.sin(anguloRad);
  } else {
    cosseno = medida / 1;
    seno = Math.sin(anguloRad);
    tangente = Math.tan(anguloRad);
    cosseno = Math.cos(anguloRad);
  }

  resultadoDiv.innerText =
    `Ângulo: ${anguloGraus}°\n` +
    `sen(${anguloGraus}) = ${seno.toFixed(4)}\n` +
    `cos(${anguloGraus}) = ${cosseno.toFixed(4)}\n` +
    `tg(${anguloGraus})  = ${tangente.toFixed(4)}`;
}
