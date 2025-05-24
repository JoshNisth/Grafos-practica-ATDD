function mergeSortEventHandler(listaAleatoria) {
  let listaOriginal;
  let listaOrdenada;
  const inputNormal = document.getElementById("inputNormal");
  const inputLabel = document.getElementById("inputLabel");
  const inputAleatorio = document.getElementById("inputAleatorio");
  const numElements = document.getElementById("numElements");
  const lowerLimit = document.getElementById("lowerLimit");
  const upperLimit = document.getElementById("upperLimit");
  const outputLabel = document.getElementById("outputLabel");
  const performanceLabel = document.getElementById("performanceLabel");
  const heightFactor = 1.5; // Declarar heightFactor como variable local

  if (inputNormal.checked) {
    console.log("Input normal activado");
    const input = inputLabel.value.trim();
    const elementos = input.split(",");
    if (elementos.length <= 1) {
      alert("Los elementos deben estar separados por comas.");
      return;
    }
    const lista = elementos.map(elemento => parseInt(elemento.trim()));
    listaOriginal = [...lista]; // Guardar una copia del arreglo original
    generarGrafico(lista, heightFactor); // Crear el gráfico inicial
    mergeSort(lista, heightFactor); // Ordenar y visualizar
    listaOrdenada = mergeSortSync(lista);
  } else if (inputAleatorio.checked) {
    if (!listaAleatoria) { // Solo genera la lista si aún no está definida
      const numElementsVal = parseInt(numElements.value);
      const lowerLimitVal = parseInt(lowerLimit.value);
      const upperLimitVal = parseInt(upperLimit.value);
      listaAleatoria = generarListaAleatoria(numElementsVal, lowerLimitVal, upperLimitVal);
    }
    listaOriginal = [...listaAleatoria]; // Guardar una copia del arreglo original
    generarGrafico(listaAleatoria, heightFactor); // Crear el gráfico inicial
    mergeSort(listaAleatoria, heightFactor); // Ordenar y visualizar
    listaOrdenada = mergeSortSync(listaAleatoria);
    listaAleatoria = listaOrdenada; // Update listaAleatoria with the sorted array
  }

  outputLabel.textContent = listaOrdenada.join(", ");
  const rendimiento = listaOrdenada.length * Math.log2(listaOrdenada.length); // Rendimiento ajustado
  performanceLabel.textContent = `Rendimiento: ${rendimiento.toFixed(1)}`;
}

function mergeSortSync(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const middle = Math.floor(arr.length / 2);
  const left = arr.slice(0, middle);
  const right = arr.slice(middle);

  return mergeSync(
    mergeSortSync(left),
    mergeSortSync(right)
  );
}

function mergeSync(left, right) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

async function mergeSort(arr, heightFactor) {
  let bars = document.getElementsByClassName("bar");
  n = arr.length
  var curr_size;
  var left_start;
  for (curr_size = 1; curr_size <= n - 1; curr_size = 2 * curr_size) {
    for (left_start = 0; left_start < n - 1; left_start += 2 * curr_size) {
      var mid = Math.min(left_start + curr_size - 1, n - 1);
      var right_end = Math.min(left_start + 2 * curr_size - 1, n - 1);
      await mergeSortHelper(arr, left_start, mid, right_end, heightFactor);
    }
    await sleep(200);
  }
  for (let k = 0; k < bars.length; k++) {
    bars[k].style.backgroundColor = "#A2F314";
  }
}

async function mergeSortHelper(arr, l, m, r, heightFactor) {
  let bars = document.getElementsByClassName("bar");
  var i, j, k;
  var n1 = m - l + 1;
  var n2 = r - m;
  var L = Array(n1).fill(0);
  var R = Array(n2).fill(0);

  for (i = 0; i < n1; i++)
    L[i] = arr[l + i];
  for (j = 0; j < n2; j++)
    R[j] = arr[m + 1 + j];

  i = 0;
  j = 0;
  k = l;
  while (i < n1 && j < n2) {
    bars[i].style.height = arr[i] * heightFactor + "px";
    bars[i].style.backgroundColor = "red";
    await sleep(30);
    if (L[i] <= R[j]) {
      arr[k] = L[i];
      bars[k].style.height = arr[k] * heightFactor + "px";
      bars[k].style.backgroundColor = "red";
      i++;
    } else {
      arr[k] = R[j];
      bars[k].style.height = arr[k] * heightFactor + "px";
      bars[k].style.backgroundColor = "red";
      j++;
    }
    k++;
  }

  while (i < n1) {
    arr[k] = L[i];
    bars[k].style.height = arr[k] * heightFactor + "px";
    bars[k].style.backgroundColor = "red";
    i++;
    k++;
  }

  while (j < n2) {
    arr[k] = R[j];
    bars[k].style.height = arr[k] * heightFactor + "px";
    bars[k].style.backgroundColor = "red";
    j++;
    k++;
  }
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
// Función auxiliar para pausar la ejecución por un tiempo determinado
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
