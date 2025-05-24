function findIndex(array, value) {
  for (let i = 0; i < array.length; i++) {
      if (array[i] === value) return i;
  }
  return -1;
}

function buildTreeFromList(list) {
  nodosDataSet.clear();
  aristasDataSet.clear();

  // Configuración específica para el layout del árbol
  grafo.setOptions({
    layout: {
      hierarchical: {
        enabled: true,
        levelSeparation: 100,
        nodeSpacing: 100,
        treeSpacing: 200,
        direction: 'UD',
        sortMethod: 'directed'
      }
    },
    physics: {
      enabled: false
    }
  });

  if (list.length === 0) {
    console.log("La lista está vacía.");
    return; // Salir de la función sin hacer nada más
  }

  // Convertir todos los valores a enteros (si no lo son)
  list = list.map(Number);

  // Crear un nodo raíz con el primer elemento de la lista
  const rootValue = list[0];
  const rootId = ids++;
  addNodeAndEdgesToGraph(rootId, rootValue.toString(), null, null);

  // Función para insertar cada valor en el árbol correctamente
  function insertIntoBST(parentId, value) {
    let currentNode = nodosDataSet.get(parentId);
    if (value < currentNode.label) {
      let leftChildId = getLeftChildId(parentId);
      if (leftChildId === null) {
        const newNodeId = ids++;
        addNodeAndEdgesToGraph(newNodeId, value.toString(), null, null);
        aristasDataSet.add({ from: parentId, to: newNodeId, id: ids++ });
      } else {
        insertIntoBST(leftChildId, value);
      }
    } else {
      let rightChildId = getRightChildId(parentId);
      if (rightChildId === null) {
        const newNodeId = ids++;
        addNodeAndEdgesToGraph(newNodeId, value.toString(), null, null);
        aristasDataSet.add({ from: parentId, to: newNodeId, id: ids++ });
      } else {
        insertIntoBST(rightChildId, value);
      }
    }
  }

  // Recorrer el resto de la lista y agregar nodos y aristas al árbol
  for (let i = 1; i < list.length; i++) {
    insertIntoBST(rootId, list[i]);
  }
}


// Función auxiliar para obtener el ID del hijo izquierdo de un nodo
function getLeftChildId(nodeId) {
  const node = nodosDataSet.get(nodeId);
  const edges = aristasDataSet.get({ filter: (edge) => edge.from === nodeId && edge.to !== null });
  if (edges.length > 0) {
    return edges[0].to;
  }
  return null;
}

// Función auxiliar para obtener el ID del hijo derecho de un nodo
function getRightChildId(nodeId) {
  const node = nodosDataSet.get(nodeId);
  const edges = aristasDataSet.get({ filter: (edge) => edge.from === nodeId && edge.to !== null });
  if (edges.length > 1) {
    return edges[1].to;
  }
  return null;
}
function addNodeAndEdgesToGraph(nodeId, label, leftId, rightId) {
    // Usa la variable global 'ids' para asignar un ID único
    nodosDataSet.add({id: nodeId, label: label});
    if (leftId !== null) {
        aristasDataSet.add({from: nodeId, to: leftId, id: ids++});
    }
    if (rightId !== null) {
        aristasDataSet.add({from: nodeId, to: rightId, id: ids++});
    }
}

function buildTreeFromPreIn(preorder, inorder, nodeIdCounter) {
  if (inorder.length === 0) return null;
  let rootValue = preorder.shift();
  let rootId = ids++; // Utiliza el ID global para asignar un nuevo ID de nodo
  let index = findIndex(inorder, rootValue);

  let inLeft = inorder.slice(0, index);
  let inRight = inorder.slice(index + 1);
  let preLeft = preorder.slice(0, inLeft.length);
  let preRight = preorder.slice(inLeft.length);

  let leftChildId = buildTreeFromPreIn(preLeft, inLeft, nodeIdCounter);
  let rightChildId = buildTreeFromPreIn(preRight, inRight, nodeIdCounter);

  addNodeAndEdgesToGraph(rootId, rootValue, leftChildId, rightChildId);
  return rootId;
}

function buildTreeFromInPost(inorder, postorder, nodeIdCounter) {
  if (inorder.length === 0) return null;
  let rootValue = postorder.pop();
  let rootId = ids++; // Utiliza el ID global para asignar un nuevo ID de nodo
  let index = findIndex(inorder, rootValue);

  let inLeft = inorder.slice(0, index);
  let inRight = inorder.slice(index + 1);
  let postLeft = postorder.slice(0, inLeft.length);
  let postRight = postorder.slice(inLeft.length);

  let leftChildId = buildTreeFromInPost(inLeft, postLeft, nodeIdCounter);
  let rightChildId = buildTreeFromInPost(inRight, postRight, nodeIdCounter);

  addNodeAndEdgesToGraph(rootId, rootValue, leftChildId, rightChildId);
  return rootId;
}

function buildTreeFromPrePost(preorder, postorder, nodeIdCounter) {
  if (preorder.length === 0 || postorder.length === 0) return null;
  if (preorder.length === 1) {
      let rootId = ids++; // Utiliza el ID global para asignar un nuevo ID de nodo
      addNodeAndEdgesToGraph(rootId, preorder[0], null, null);
      return rootId;
  }

  let rootValue = preorder[0];
  let rootId = ids++; // Utiliza el ID global para asignar un nuevo ID de nodo
  let leftRoot = preorder[1]; // El primer elemento después de la raíz en el preorden es la raíz del subárbol izquierdo
  let leftRootIndexInPost = postorder.indexOf(leftRoot);

  let leftSubtreePre = preorder.slice(1, leftRootIndexInPost + 2);
  let leftSubtreePost = postorder.slice(0, leftRootIndexInPost + 1);
  let rightSubtreePre = preorder.slice(leftRootIndexInPost + 2);
  let rightSubtreePost = postorder.slice(leftRootIndexInPost + 1, postorder.length - 1);

  let leftChildId = buildTreeFromPrePost(leftSubtreePre, leftSubtreePost, nodeIdCounter);
  let rightChildId = buildTreeFromPrePost(rightSubtreePre, rightSubtreePost, nodeIdCounter);

  addNodeAndEdgesToGraph(rootId, rootValue, leftChildId, rightChildId);
  return rootId;
}

function addNodeAndEdgesToGraph(nodeId, label, leftId, rightId) {
  nodosDataSet.add({id: nodeId, label: label});
  if (leftId !== null) {
      aristasDataSet.add({from: nodeId, to: leftId, id: ids++}); // Asigna un ID único a cada arista
  }
  if (rightId !== null) {
      aristasDataSet.add({from: nodeId, to: rightId, id: ids++}); // Asigna un ID único a cada arista
  }
}
function listasIguales(lista1, lista2) {
  if (lista1.length !== lista2.length) {
    return false;
  }
  const copiaLista1 = lista1.map(String).sort(); // Convertir todos los elementos a String y luego ordenar
  const copiaLista2 = lista2.map(String).sort(); // Convertir todos los elementos a String y luego ordenar
  for (let i = 0; i < copiaLista1.length; i++) {
    if (copiaLista1[i] !== copiaLista2[i]) {
      return false;
    }
  }
  return true;
}

function tresListasIguales(lista1, lista2, lista3) {
  return listasIguales(lista1, lista2) && listasIguales(lista2, lista3);
}


function generarArbol() {
  nodosDataSet.clear();
  aristasDataSet.clear();

  grafo.setOptions({
    layout: {
      hierarchical: {
        enabled: true,
        levelSeparation: 100,
        nodeSpacing: 100,
        treeSpacing: 200,
        direction: 'UD',
        sortMethod: 'directed'
      }
    },
    physics: {
      enabled: false
    }
  });

  let nodeIdCounter = { value: 1 };
  const listaInput = document.getElementById("listaInput").value.split(",").map(Number).filter(x => !isNaN(x));
  const preordenInput = document.getElementById("preordenInput").value.split(",").map(x => x.trim()).filter(x => x !== "");
  const inordenInput = document.getElementById("inordenInput").value.split(",").map(x => x.trim()).filter(x => x !== "");
  const postordenInput = document.getElementById("postordenInput").value.split(",").map(x => x.trim()).filter(x => x !== "");

  if (preordenInput.length > 0 && inordenInput.length > 0 && postordenInput.length > 0) {
    if (tresListasIguales(preordenInput, inordenInput, postordenInput)) {
      buildTreeFromPreIn(preordenInput, inordenInput, nodeIdCounter);
      return;  // Agrega un return para evitar ejecutar múltiples bloques
    }
  } else if (preordenInput.length > 0 && inordenInput.length > 0) {
    if (listasIguales(preordenInput, inordenInput)) {
      buildTreeFromPreIn(preordenInput, inordenInput, nodeIdCounter);
      return;
    }
  } else if (inordenInput.length > 0 && postordenInput.length > 0) {
    if (listasIguales(inordenInput, postordenInput)) {
      buildTreeFromInPost(inordenInput, postordenInput, nodeIdCounter);
      return;
    }
  } else if (preordenInput.length > 0 && postordenInput.length > 0) {
    if (listasIguales(preordenInput, postordenInput)) {
      buildTreeFromPrePost(preordenInput, postordenInput, nodeIdCounter);
      return;
    }
  } else if (listaInput.length > 0) {
    buildTreeFromList(listaInput);
    return;
  }

  alert("Al menos una de las condiciones necesarias para generar un árbol no se cumple.");
}








function obtenerNodoRaiz() {
  const nodos = nodosDataSet.get({ returnType: "Object" });
  const aristas = aristasDataSet.get({ returnType: "Object" });

  // Convertir nodos y aristas a arrays si es necesario
  const nodosArray = Array.isArray(nodos) ? nodos : Object.values(nodos);
  const aristasArray = Array.isArray(aristas) ? aristas : Object.values(aristas);

  // Encontrar el nodo que no tiene aristas entrantes
  const nodoRaiz = nodosArray.find(nodo => !aristasArray.some(arista => arista.to === nodo.id));

  return nodoRaiz;
}
// Función para crear un objeto de nodo a partir de un objeto de vis.js
function crearNodoArbol(nodoVis) {
  const nodo = {
    id: nodoVis.id,
    label: nodoVis.label,
    hijos: []
  };

  return nodo;
}

// Función para construir el árbol a partir de los nodos y aristas
function construirArbol() {
  const nodos = nodosDataSet.get({ returnType: "Object" });
  const aristas = aristasDataSet.get({ returnType: "Object" });

  // Convertir nodos y aristas a arrays si es necesario
  const nodosArray = Array.isArray(nodos) ? nodos : Object.values(nodos);
  const aristasArray = Array.isArray(aristas) ? aristas : Object.values(aristas);

  const nodoRaiz = obtenerNodoRaiz();
  if (!nodoRaiz) {
    console.log("No se encontró un nodo raíz en el grafo.");
    return null;
  }
  const arbol = crearNodoArbol(nodoRaiz);

  const colaHijos = [arbol];

  while (colaHijos.length > 0) {
    const nodoActual = colaHijos.shift();
    const aristasHijo = aristasArray.filter(arista => arista.from === nodoActual.id);

    aristasHijo.forEach(arista => {
      const nodoHijo = nodosArray.find(nodo => nodo.id === arista.to);
      const nodoHijoArbol = crearNodoArbol(nodoHijo);
      nodoActual.hijos.push(nodoHijoArbol);
      colaHijos.push(nodoHijoArbol);
    });
  }

  return arbol;
}

// Función para recorrer el árbol en preorden
function preorden(nodo) {
  const resultado = [];

  function recorrerPreorden(nodoActual) {
    resultado.push(nodoActual.label);

    nodoActual.hijos.forEach(hijo => {
      recorrerPreorden(hijo);
    });
  }

  recorrerPreorden(nodo);
  return resultado;
}

// Función para recorrer el árbol en inorden
function inorden(nodo) {
  const resultado = [];

  function recorrerInorden(nodoActual) {
    if (nodoActual.hijos.length > 0) {
      recorrerInorden(nodoActual.hijos[0]);
    }

    resultado.push(nodoActual.label);

    if (nodoActual.hijos.length > 1) {
      for (let i = 1; i < nodoActual.hijos.length; i++) {
        recorrerInorden(nodoActual.hijos[i]);
      }
    }
  }

  recorrerInorden(nodo);
  return resultado;
}

// Función para recorrer el árbol en postorden
function postorden(nodo) {
  const resultado = [];

  function recorrerPostorden(nodoActual) {
    nodoActual.hijos.forEach(hijo => {
      recorrerPostorden(hijo);
    });

    resultado.push(nodoActual.label);
  }

  recorrerPostorden(nodo);
  return resultado;
}

// Función para manejar los eventos de los botones
function manejarBotonOrden(orden) {
  const arbol = construirArbol();
  if (!arbol) {
    console.log("No se pudo construir el árbol");
    return;
  }

  let resultado;
  switch (orden) {
    case 'preorden':
      resultado = preorden(arbol);
      break;
    case 'inorden':
      resultado = inorden(arbol);
      break;
    case 'postorden':
      resultado = postorden(arbol);
      break;
    default:
      resultado = [];
      break;
  }

  // Mostrar el resultado en el contenedor de solución
  const solucionContainer = document.getElementById('solucion');
  solucionContainer.innerHTML = ''; // Limpiar el contenido previo

  const titulo = document.createElement('h3');
  titulo.textContent = `${orden.charAt(0).toUpperCase() + orden.slice(1)}:`;
  titulo.style.color = 'navy'; // Agrega un color al título

  const resultadoParrafo = document.createElement('p');
  resultadoParrafo.textContent = resultado.join(', ');
  resultadoParrafo.style.padding = '10px'; // Agrega un padding para mayor legibilidad
  resultadoParrafo.style.border = '1px solid gray'; // Agrega un borde para formar un recuadro
  resultadoParrafo.style.backgroundColor = '#f9f9f9'; // Un color de fondo suave
  resultadoParrafo.style.borderRadius = '5px'; // Bordes redondeados
  resultadoParrafo.style.margin = '10px 0'; // Margen para separar de otros elementos

  solucionContainer.appendChild(titulo);
  solucionContainer.appendChild(resultadoParrafo);
}
