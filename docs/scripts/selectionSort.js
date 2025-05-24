// Función para ordenar la lista utilizando Selection Sort
function selectionSort(arr) {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    let min = i;
    for (let j = i + 1; j < len; j++) {
      if (arr[j] < arr[min]) {
        min = j;
      }
    }
    if (min !== i) {
      let temp = arr[i];
      arr[i] = arr[min];
      arr[min] = temp;
    }
  }
  return arr;
}

// Función de evento para el botón "Selection Sort"
function selectionSortEventHandler(listaAleatoria) {
  let listaOrdenada;
  const inputNormal = document.getElementById("inputNormal");
  const inputLabel = document.getElementById("inputLabel");
  const inputAleatorio = document.getElementById("inputAleatorio");
  const numElements = document.getElementById("numElements");
  const lowerLimit = document.getElementById("lowerLimit");
  const upperLimit = document.getElementById("upperLimit");
  const outputLabel = document.getElementById("outputLabel");
  const performanceLabel = document.getElementById("performanceLabel");

  if (inputNormal.checked) {
    console.log("Input normal activado");
    const input = inputLabel.value.trim();
    const elementos = input.split(",");
    if (elementos.length <= 1) {
      alert("Los elementos deben estar separados por comas.");
      return;
    }
    const lista = elementos.map(elemento => parseInt(elemento.trim()));
    const copy = [...lista];
    const moves = selectionSortGrafico(copy);
    generarGraficoSelection(lista, 0);
    animate(moves, copy, generarGraficoSelection);
    listaOrdenada = selectionSort(lista);
  } else if (inputAleatorio.checked) {
    generarGraficoSelection(listaAleatoria, 0);
    const copy = [...listaAleatoria];
    const moves = selectionSortGrafico(copy);
    animate(moves, copy, generarGraficoSelection);
    console.log("Input aleatorio activado");
    if (!listaAleatoria) {
      const numElementsVal = parseInt(numElements.value);
      const lowerLimitVal = parseInt(lowerLimit.value);
      const upperLimitVal = parseInt(upperLimit.value);
      listaAleatoria = generarListaAleatoria(numElementsVal, lowerLimitVal, upperLimitVal);
    }
    listaOrdenada = selectionSort(listaAleatoria);
    listaAleatoria = listaOrdenada; // Update listaAleatoria with the sorted array
  }

  outputLabel.textContent = listaOrdenada.join(", ");
  const rendimiento = (listaOrdenada.length ** 2) / 2;
  performanceLabel.textContent = `Rendimiento: ${rendimiento}`;
}

function generarGraficoSelection(lista, move) {
  const maxValue = Math.max(...lista);
  const container = document.getElementById("containerGrafico");
  container.innerHTML = "";

  for (let i = 0; i < lista.length; i++) {
    const bar = document.createElement("div");
    const barHeight = (lista[i] / maxValue) * 100 + "%";
    bar.style.height = barHeight;
    bar.classList.add("bar");
    if (move && move.indices.includes(i)) {
      bar.style.backgroundColor = move.type === "swap" ? "red" : "blue";
    } else {
      bar.style.backgroundColor = "#000000";
    }
    container.appendChild(bar);
  }
}

function animate(moves, lista, graficarFuncion) {
  if (moves.length === 0) {
    graficarFuncion(lista);
    return;
  }

  const move = moves.shift();
  const [i, j] = move.indices;

  graficarFuncion(lista, { indices: move.indices, type: move.type });

  if (move.type === "swap") {
    [lista[i], lista[j]] = [lista[j], lista[i]];
  }

  setTimeout(function () {
    animate(moves, lista, graficarFuncion);
  }, 200);
}

function selectionSortGrafico(array) {
  const moves = [];
  const n = array.length;
  const auxiliarArray = [...array]; // Create a copy of the original array

  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      moves.push({ indices: [i, j], type: "comp" });
      if (auxiliarArray[j] < auxiliarArray[minIdx]) {
        moves.push({ indices: [minIdx, j], type: "comp" });
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      moves.push({ indices: [i, minIdx], type: "swap" });
      [auxiliarArray[i], auxiliarArray[minIdx]] = [auxiliarArray[minIdx], auxiliarArray[i]]; // Swap the actual values
    } else if (i === n - 1) {
      // Caso especial: si es la última iteración y el elemento está en su posición correcta
      moves.push({ indices: [i, i], type: "comp" }); // Agregar movimiento de comparación final
    }
  }
  return moves;
}