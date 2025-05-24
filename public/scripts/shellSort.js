// Función para ordenar la lista utilizando Shell Sort
function shellSort(arr) {
  const len = arr.length;
  for (let gap = Math.floor(len / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < len; i++) {
      let temp = arr[i];
      let j;
      for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
        arr[j] = arr[j - gap];
      }
      arr[j] = temp;
    }
  }
  return arr;
}

// Función de evento para el botón "Shell Sort"
function shellSortEventHandler(listaAleatoria) {
  let listaOrdenada;
  const inputNormal = document.getElementById("inputNormal");
  const inputLabel = document.getElementById("inputLabel");
  const inputAleatorio = document.getElementById("inputAleatorio");
  const numElements = document.getElementById("numElements");
  const lowerLimit = document.getElementById("lowerLimit");
  const upperLimit = document.getElementById("upperLimit");
  const outputLabel = document.getElementById("outputLabel");
  const performanceLabel = document.getElementById("performanceLabel");
  const heightFactor = 1.5; // Factor de altura para la visualización

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
    generarGrafico(lista, heightFactor); // Crear el gráfico inicial
    shellSortGrafico(copy, heightFactor); // Ordenar y visualizar
    listaOrdenada = shellSort(lista); // Crear una nueva copia del arreglo ordenado
  } else if (inputAleatorio.checked) {
    console.log("Input aleatorio activado");
    if (!listaAleatoria) { // Solo genera la lista si aún no está definida
      const numElementsVal = parseInt(numElements.value);
      const lowerLimitVal = parseInt(lowerLimit.value);
      const upperLimitVal = parseInt(upperLimit.value);
      listaAleatoria = generarListaAleatoria(numElementsVal, lowerLimitVal, upperLimitVal);
    }
    generarGrafico(listaAleatoria, heightFactor); // Crear el gráfico inicial
    const copy = [...listaAleatoria];
    shellSortGrafico(copy, heightFactor); // Ordenar y visualizar
    listaOrdenada = shellSort(listaAleatoria);
    listaAleatoria = listaOrdenada;
 // Crear una nueva copia del arreglo ordenado
  }

  outputLabel.textContent = listaOrdenada.join(", ");
  const rendimiento = listaOrdenada.length ** (3/2); // Rendimiento ajustado
  performanceLabel.textContent = `Rendimiento: ${rendimiento.toFixed(1)}`;
}

// Función auxiliar para pausar la ejecución por un tiempo determinado
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Función para visualizar el proceso de Shell Sort
async function shellSortGrafico(arr, heightFactor) {
  let bars = document.getElementsByClassName("bar");
  let n = arr.length;

  // Inicio del intervalo de valores
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    // Hacer inserciones de acuerdo al intervalo
    for (let i = gap; i < n; i++) {
      let temp = arr[i];
      let j;

      // Insertar arr[i] en la secuencia ordenada arr[gap..i-1]
      for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
        arr[j] = arr[j - gap];
        bars[j].style.height = arr[j] * heightFactor + 'px';
        bars[j].style.backgroundColor = "orange";
        bars[j - gap].style.backgroundColor = "white";
        await sleep(30);
      }

      // Colocar el elemento temporal en su posición correcta
      arr[j] = temp;
      bars[j].style.height = arr[j] * heightFactor + 'px';
      bars[j].style.backgroundColor = "orange";
      await sleep(30);
    }
  }

  // Cambiar el color de las barras a verde después de ordenar
  for (let k = 0; k < bars.length; k++) {
    bars[k].style.backgroundColor = "#A2F314";
  }

  return arr;
}

function generarGrafico(lista, heightFactor) {
  const maxValue = Math.max(...lista); // Obtener el valor máximo en la lista
  const container = document.getElementById("containerGrafico");
  container.innerHTML = ""; // Limpiar el contenedor antes de agregar nuevas barras

  for (let i = 0; i < lista.length; i++) {
    const bar = document.createElement("div");
    const barHeight = (lista[i] / maxValue) * 100 + "%";
    bar.style.height = barHeight;
    bar.classList.add("bar");
    container.appendChild(bar);
  }
}