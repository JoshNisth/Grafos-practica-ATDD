function inicializarGrafo() {
  const lienzo = document.getElementById('lienzo');
  nodosDataSet = new vis.DataSet();
  aristasDataSet = new vis.DataSet();
  const data = { nodes: nodosDataSet, edges: aristasDataSet };
  const opciones = {};
  grafo = new vis.Network(lienzo, data, opciones);
  desactivarBotones();
  desactivarBotones2();
  ids = 0;
  grafo.on('doubleClick', dobleClicEnNodo);
  grafo.on('doubleClick', dobleClicEnArista);
  grafo.on('oncontext', editarCoordenadasNodo);
}

function editarCoordenadasNodo(propiedades) {
  const { nodes } = propiedades;
  if (nodes.length > 0) {
      const nodeId = nodes[0];
      const nuevoX = prompt('Ingrese la nueva coordenada X para el nodo:', nodosDataSet.get(nodeId).x);
      const nuevoY = prompt('Ingrese la nueva coordenada Y para el nodo:', nodosDataSet.get(nodeId).y);
      if (nuevoX !== null && nuevoY !== null) {
          nodosDataSet.update({ id: nodeId, x: parseFloat(nuevoX), y: parseFloat(nuevoY) });
      }
  }
}

// Función para mostrar modales con mensajes
function showModal(message) {
  var modal = document.getElementById("modal");
  var span = document.getElementsByClassName("close")[0];
  document.getElementById("message").innerText = message;

  modal.style.display = "block";

  span.onclick = function() {
      modal.style.display = "none";
  }

  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }
}

function mostrarCoordenadasNodos() {
  const nodos = nodosDataSet.get(); // Obtener todos los nodos del DataSet
  if (nodos.length === 0) {
      showModal("No hay nodos en el lienzo.");
      return;
  }

  let coordenadas = "Coordenadas de los nodos:\n";
  nodos.forEach(nodo => {
      coordenadas += `Nodo ${nodo.label}: (${nodo.x.toFixed(2)}, ${nodo.y.toFixed(2)})\n`;
  });

  showModal(coordenadas);
}

function calcularPuntoMedioTotal() {
  const nodos = nodosDataSet.get(); // Obtener todos los nodos del DataSet
  if (nodos.length < 3) {
      showModal("Se necesitan al menos tres nodos para calcular el punto medio total.");
      return;
  }

  let sumX = 0, sumY = 0;
  nodos.forEach(nodo => {
      sumX += nodo.x;
      sumY += nodo.y;
  });
  let centroX = sumX / nodos.length;
  let centroY = sumY / nodos.length;

  // Actualizar o crear un nodo en el centro
  let centroId = 'centro'; // ID único para el nodo central
  let centroNodo = nodosDataSet.get(centroId);
  if (centroNodo) {
      nodosDataSet.update({id: centroId, x: centroX, y: centroY});
  } else {
      nodosDataSet.add({id: centroId, label: '', x: centroX, y: centroY, color: {background: 'red', border: 'red'}});
  }

  showModal(`El punto medio total es: (${centroX.toFixed(2)}, ${centroY.toFixed(2)})`);
}


// Función para calcular el punto medio entre dos puntos
function calcularPuntoMedio(punto1, punto2) {
  let x = (punto1.x + punto2.x) / 2;
  let y = (punto1.y + punto2.y) / 2;
  return { x: x, y: y };
}