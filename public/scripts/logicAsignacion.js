let grafo;
let nodosDataSet;
let aristasDataSet;
let seleccionado;
let modoEliminarArista = false;
let modoEliminarNodo = false;
let modoAgregarArista = false;
let btnActivos = 0;
let dobleClicEnNodoManejado = false;
let nodoSeleccionadoId = null;

let modoAgregarNodoOrigen = false; 
let modoAgregarNodoDestino = false; 
let idsOrigen = 0;
let idsDestino = 0; 
let buttonStates = {
    nodeOrigenButton: false,
    nodeDestinoButton: false,
    edgeButton: false,
    deleteEdgeButton: false,
    matrixButton: false,
    matrixAsignacionButton: false,
    saveButton: false,
    deleteNodeButton: false
};
let maximizationMode = true;
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
}

//---PARA LOS BOTONES ACTIVOS---
function toggleButton(buttonId) {
    var button = document.getElementById(buttonId);
    button.classList.toggle('active'); 
}
function setActiveButton(buttonId) {
    for (const key in buttonStates) {
        if (key !== buttonId && buttonStates[key]) {
            toggleButton(key);
            buttonStates[key] = false;
        }
    }
    buttonStates[buttonId] = !buttonStates[buttonId];
}

function desactivarBotones(){
    grafo.off('click',eliminarArista);
    modoEliminarArista = false;
    grafo.off('click', eliminarNodo);
    modoEliminarNodo = false;
    grafo.off('click', clicEnNodo);
    modoAgregarArista = false;
    grafo.off('click', clicEnNodo2);
    modoAgregarArista2 = false;
    grafo.off('click', agregarNodoOrigen);
    modoAgregarNodoOrigen = false; 
    grafo.off('click', agregarNodoDestino);  
    modoAgregarNodoDestino = false;
    btnActivos = 0;
}
function desactivarBotones2() {
    for (const key in buttonStates) {
        if (buttonStates[key]) {
            toggleButton(key);
            buttonStates[key] = false;
        }
    }
}

// ---PARA LA MATRIZ DE ASIGNACION---
function changeOptimizationMode() {
    const optimizationSelect = document.getElementById("optimizationMode");
    const selectedValue = optimizationSelect.value;
    
    if (selectedValue === "maximization") {
        maximizationMode = true;
        console.log("Optimización por maximización activada");
    } else if (selectedValue === "minimization") {
        maximizationMode = false;
        console.log("Optimización por minimización activada");
    }
}
function asignacionMaximizacion(matrizCostos) {
    const asignaciones = [];
    const nodosOrigen = matrizCostos.length;
    const nodosDestino = matrizCostos[0].length;
    // Inicializar matrices de asignaciones y valores seleccionados
    const asignadosOrigen = new Array(nodosOrigen).fill(false);
    const asignadosDestino = new Array(nodosDestino).fill(false);
    let sumaOptima = 0;

    while (asignaciones.length < Math.min(nodosOrigen, nodosDestino)) {
        let maxValor = -Infinity;
        let maxOrigen = -1;
        let maxDestino = -1;
        // Encontrar el máximo valor no asignado en la matriz
        for (let i = 0; i < nodosOrigen; i++) {
            if (!asignadosOrigen[i]) {
                for (let j = 0; j < nodosDestino; j++) {
                    if (!asignadosDestino[j] && matrizCostos[i][j] > maxValor) {
                        maxValor = matrizCostos[i][j];
                        maxOrigen = i;
                        maxDestino = j;
                    }
                }
            }
        }

        // Marcar nodos como asignados y agregar asignación
        asignadosOrigen[maxOrigen] = true;
        asignadosDestino[maxDestino] = true;
        asignaciones.push({ origen: maxOrigen, destino: maxDestino, valor: maxValor });
        sumaOptima += maxValor;
    }

    return { asignaciones, sumaOptima };
}
function asignacionMinimizacion(matrizCostos) {
    const asignaciones = [];
    const nodosOrigen = matrizCostos.length;
    const nodosDestino = matrizCostos[0].length;

    // Inicializar matrices de asignaciones y valores seleccionados
    const asignadosOrigen = new Array(nodosOrigen).fill(false);
    const asignadosDestino = new Array(nodosDestino).fill(false);

    let sumaOptima = 0;

    // Realizar asignaciones mientras haya nodos disponibles
    while (asignaciones.length < Math.min(nodosOrigen, nodosDestino)) {
        let minValor = Infinity;
        let minOrigen = -1;
        let minDestino = -1;

        // Encontrar el mínimo valor no asignado en la matriz
        for (let i = 0; i < nodosOrigen; i++) {
            if (!asignadosOrigen[i]) {
                for (let j = 0; j < nodosDestino; j++) {
                    if (!asignadosDestino[j] && matrizCostos[i][j] < minValor) {
                        minValor = matrizCostos[i][j];
                        minOrigen = i;
                        minDestino = j;
                    }
                }
            }
        }

        // Marcar nodos como asignados y agregar asignación
        asignadosOrigen[minOrigen] = true;
        asignadosDestino[minDestino] = true;
        asignaciones.push({ origen: minOrigen, destino: minDestino, valor: minValor });
        sumaOptima += minValor;
    }

    return { asignaciones, sumaOptima };
}
function generarMatrizAsignacion() {
    console.log("Se está generando la matriz de asignación");
    desactivarBotones();
    desactivarBotones2();
    const nodosOrigen = nodosDataSet.get({ filter: item => item.group === 'origen' });
    const nodosDestino = nodosDataSet.get({ filter: item => item.group === 'destino' });
    const matrizCostos = [];
    // Llenar la matriz de costos
    nodosOrigen.forEach((origen, i) => {
        matrizCostos[i] = [];
        nodosDestino.forEach((destino, j) => {
            const arista = aristasDataSet.get({ filter: item => item.from === origen.id && item.to === destino.id });
            matrizCostos[i][j] = arista.length > 0 ? parseInt(arista[0].label) : 0;
        });
    });

    // Seleccionar el algoritmo de asignación según el modo
    let { asignaciones, sumaOptima } = maximizationMode ? asignacionMaximizacion(matrizCostos) : asignacionMinimizacion(matrizCostos);

    // Mostrar la matriz y asignaciones en la interfaz
    mostrarMatrizAsignacion(nodosOrigen, nodosDestino, matrizCostos, asignaciones, sumaOptima);
}
function mostrarMatrizAsignacion(nodosOrigen, nodosDestino, matrizCostos, asignaciones, sumaOptima) {
    const contenedorMatriz = document.getElementById('matriz');
    if (nodosOrigen.length > 0 && nodosDestino.length > 0) {
        let html = '<h2>Matriz de Asignación</h2>';
        html += '<table>';
        html += '<tr><th></th>';
        nodosDestino.forEach(nodo => {
            html += `<th>${nodo.label}</th>`;
        });
        html += '</tr>';
        matrizCostos.forEach((fila, index) => {
            html += `<tr><th>${nodosOrigen[index].label}</th>`;
            fila.forEach(valor => {
                html += `<td>${valor}</td>`;
            });
            html += '</tr>';
        });
        html += '</table>';

        html += `<h2>Asignaciones Óptimas</h2>`;
        html += `<p>Suma Óptima: ${sumaOptima}</p>`;
        html += `<table>`;
        html += `<tr><th>Origen</th><th>Destino</th><th>Valor</th></tr>`;
        asignaciones.forEach(asignacion => {
            const origenLabel = nodosOrigen[asignacion.origen].label;
            const destinoLabel = nodosDestino[asignacion.destino].label;
            html += `<tr><td>${origenLabel}</td><td>${destinoLabel}</td><td>${asignacion.valor}</td></tr>`;
        });
        html += `</table>`;

        contenedorMatriz.innerHTML = html;
    }
}


//---FUNCIONES DE AGREGAR NODOS Y ARISTAS---
function agregarAristaSeleccionada(){
    toggleButton('edgeButton');
    setActiveButton('edgeButton');
    if(modoAgregarArista){
        btnActivos--;
        modoAgregarArista = false;
        grafo.off('click', clicEnNodo);
    }
    else{
        if(btnActivos > 0){
            desactivarBotones();
        }
        btnActivos++;
        modoAgregarArista = true;
        grafo.on('click', clicEnNodo);
    }
    
}
function agregarNodoOrigenSeleccionado() {
    toggleButton('nodeOrigenButton');
    setActiveButton('nodeOrigenButton');
    if (modoAgregarNodoOrigen) {
        btnActivos--;
        modoAgregarNodoOrigen = false;
        grafo.off('click', agregarNodoOrigen);
    } else {
        if (btnActivos > 0) {
            desactivarBotones();
        }
        btnActivos++;
        modoAgregarNodoOrigen = true;
        grafo.on('click', agregarNodoOrigen);
    }
}
function agregarNodoDestinoSeleccionado() {
    toggleButton('nodeDestinoButton');
    setActiveButton('nodeDestinoButton');
    if (modoAgregarNodoDestino) {
        btnActivos--;
        modoAgregarNodoDestino = false;
        grafo.off('click', agregarNodoDestino);
    } else {
        if (btnActivos > 0) {
            desactivarBotones();
        }
        btnActivos++;
        modoAgregarNodoDestino = true;
        grafo.on('click', agregarNodoDestino);
    }
}

function agregarNodoOrigen(event) {
    nodosDataSet.add({ id: 'origen_' + idsOrigen, label: 'Origen ' + (idsOrigen + 1), x: event.pointer.canvas.x, y: event.pointer.canvas.y, group: 'origen', color: '#FFD700' }); // Amarillo
    idsOrigen++;
}

function agregarNodoDestino(event) {
    nodosDataSet.add({ id: 'destino_' + idsDestino, label: 'Destino ' + (idsDestino + 1), x: event.pointer.canvas.x, y: event.pointer.canvas.y, group: 'destino', color: '#ADD8E6' }); // Celeste
    idsDestino++;
}
// ---FUNCIONES DE ELIMINAR NODOS Y ARISTAS---
function eliminarNodoSeleccionado() {
    toggleButton('deleteNodeButton');
    setActiveButton('deleteNodeButton');
    if (modoEliminarNodo) {
        btnActivos--;
        modoEliminarNodo = false;
        grafo.off('click', eliminarNodo);
    } else {
        if (btnActivos > 0) {
            desactivarBotones();
        }
        btnActivos++;
        modoEliminarNodo = true;
        grafo.on('click', eliminarNodo);
    }
}

function eliminarAristaSeleccionada() {
    toggleButton('deleteEdgeButton');
    setActiveButton('deleteEdgeButton');
    if (modoEliminarArista) {
        btnActivos--;
        modoEliminarArista = false;
        grafo.off('click', eliminarArista);
    } else {
        if (btnActivos > 0) {
            desactivarBotones();
        }
        btnActivos++;
        modoEliminarArista = true;
        grafo.on('click', eliminarArista);
    }
}

function eliminarNodo(event) {
    const nodeId = event.nodes[0];
    const aristasAEliminar = aristasDataSet.get({ filter: item => item.from === nodeId || item.to === nodeId });
    nodosDataSet.remove({ id: nodeId });
    aristasAEliminar.forEach(arista => {
        aristasDataSet.remove({ id: arista.id });
    });
}

function eliminarArista(event) {
    const edgeId = event.edges[0];
    aristasDataSet.remove({ id: edgeId });
}
// ---PARA LA MATRIZ DE ADYACENCIA---
function generarMatrizCostos() {
    desactivarBotones();
    desactivarBotones2();
    const nodos = nodosDataSet.get({ fields: ['id', 'label', 'group'] });
    const nodosOrigen = nodos.filter(nodo => nodo.group === 'origen');
    const nodosDestino = nodos.filter(nodo => nodo.group === 'destino');
    
    if (nodosOrigen.length === 0 || nodosDestino.length === 0) {
        alert('Debes agregar al menos un nodo de tipo origen y un nodo de tipo destino.');
        return;
    }

    if (nodosOrigen.length !== nodosDestino.length) {
        alert('La cantidad de nodos de origen debe ser igual a la cantidad de nodos de destino para generar una matriz de adyacencia cuadrada.');
        return;
    }

    const matriz = [];
    const matrizObj = {};

    nodos.forEach(nodo => {
        matrizObj[nodo.id] = {};
    });

    const aristasArr = aristasDataSet.get();
    aristasArr.forEach((arista) => {
        const value = parseInt(arista.label || 1);
        const nodoFromGroup = nodosDataSet.get(arista.from).group;
        const nodoToGroup = nodosDataSet.get(arista.to).group;
        if (nodoFromGroup === 'origen' && nodoToGroup === 'destino') {
            matrizObj[arista.from][arista.to] = value;
        }
    });

    nodosOrigen.forEach(nodoOrigen => {
        const fila = [];
        nodosDestino.forEach(nodoDestino => {
            fila.push(matrizObj[nodoOrigen.id][nodoDestino.id] || 0);
        });
        matriz.push(fila);
    });

    mostrarMatrizCostos(nodosOrigen, nodosDestino, matriz);
}

function mostrarMatrizCostos(nodosOrigen, nodosDestino, matriz) {
    desactivarBotones();
    desactivarBotones2();
    const contenedorMatriz = document.getElementById('matriz');
    if (nodosOrigen.length > 0 && nodosDestino.length > 0) {
        let html = '<h2>Matriz de Adyacencia</h2>';
        html += '<table>';
        html += '<tr><th></th>';
        nodosDestino.forEach(nodo => {
            html += `<th>${nodo.label}</th>`;
        });
        html += '</tr>';
        matriz.forEach((fila, index) => {
            html += `<tr><th>${nodosOrigen[index].label}</th>`;
            fila.forEach(valor => {
                html += `<td>${valor}</td>`;
            });
            html += '</tr>';
        });
        html += '</table>';
        contenedorMatriz.innerHTML = html;
    }
}
function limpiar() {
    inicializarGrafo();
}

// ---PARA LOS EVENTOS DE CLICKS EN NODOS Y ARISTAS---
document.addEventListener('DOMContentLoaded', () => {
    inicializarGrafo();
});

function clicEnNodo(propiedades) {
    console.log('clic en nodo');
    const { nodes } = propiedades;
    if (nodes.length > 0) {
        if (seleccionado === undefined) {
            seleccionado = nodes[0];
        } else {
            const grupoSeleccionado = nodosDataSet.get(seleccionado).group;
            const grupoActual = nodosDataSet.get(nodes[0]).group;
            if (grupoSeleccionado !== grupoActual && 
                ((grupoSeleccionado === 'origen' && grupoActual === 'destino'))) {
                // Verificar si se proporcionó un nombre para la arista
                let nombreArista = prompt('Ingrese el nombre para la arista:', '1');
                // Si no se proporciona un nombre, asignar el valor predeterminado de 1
                if (!nombreArista || isNaN(nombreArista.trim())) {
                    nombreArista = '1';
                }
                aristasDataSet.add({ from: seleccionado, to: nodes[0], arrows: 'to', label: nombreArista });
            }
            seleccionado = undefined;
        }
    }
}

function clicEnNodo2(propiedades) {
    console.log('clic en nodo 2');
  const { nodes } = propiedades;
  if (nodes.length > 0) {
    if (seleccionado === undefined) {
      seleccionado = nodes[0];
    } else {
      if (seleccionado !== nodes[0]) {
        aristasDataSet.add({ from: seleccionado, to: nodes[0], arrows: 'to' });
        aristasDataSet.add({ from: nodes[0], to: seleccionado, arrows: 'to' });
        seleccionado = undefined;
      } else {
        aristasDataSet.add({ from: seleccionado, to: seleccionado, arrows: 'to' });
        seleccionado = undefined;
      }
    }
  }
}

function dobleClicEnNodo(propiedades) {
    console.log('Doble clic en nodo');
    desactivarBotones();
    const { nodes } = propiedades;
    if (nodes.length > 0) {
        const nodeId = nodes[0];
        const nuevoNombre = prompt('Ingrese el nuevo nombre para el nodo:', nodosDataSet.get(nodeId).label);
        if (nuevoNombre !== null) {
            nodosDataSet.update({ id: nodeId, label: nuevoNombre });
        }
        dobleClicEnNodoManejado = true;
    }
}

function dobleClicEnArista(propiedades) {
    console.log('Doble clic en arista');
    desactivarBotones();
    if (dobleClicEnNodoManejado) {
        dobleClicEnNodoManejado = false;
        return;
    }
    const { edges } = propiedades;
    if (edges.length > 0) {
        const edgeId = edges[0];
        const nuevoNombre = prompt('Ingrese el nuevo nombre para la arista:', aristasDataSet.get(edgeId).label);
        if (nuevoNombre !== null) {
            aristasDataSet.update({ id: edgeId, label: nuevoNombre });
        }
    }
}

// COLOR PICKER Y HELP PAGE
function openColorPicker() {
    var colorSelector = document.getElementById('colorSelector');
    colorSelector.click(); 
}
function openColorPicker() {
    desactivarBotones();
    desactivarBotones2();
    var colorSelector = document.getElementById('colorSelector');
    colorSelector.click(); // Simular clic en el input de color
    const color = document.getElementById('colorSelector').value;
    const lienzo = document.getElementById('lienzo');
    lienzo.style.backgroundColor = color;
}
function cambiarColorLienzo() {
    const color = document.getElementById('colorSelector').value;
    const lienzo = document.getElementById('lienzo');
    lienzo.style.backgroundColor = color;
}
function openHelpPage() {
    // Especifica la URL de la página de ayuda
    var helpPageURL = 'help.html';
    // Abre una nueva ventana emergente
    window.open(helpPageURL, 'helpPage', 'width=800,height=500,top=100,left=100,resizable=yes,scrollbars=yes');
}


//IMPORTACION Y EXPORTACION
function guardarGrafo() {
    let nombreArchivo = prompt("Por favor, ingrese el nombre del archivo:", "grafoNodolandia.json");
  
    if (nombreArchivo != null) {
        let estadoGrafo = {
            nodos: nodosDataSet.get({ fields: ['id', 'label', 'x', 'y', 'color'] }),
            aristas: aristasDataSet.get({ fields: ['id', 'from', 'to', 'label', 'arrows'] })
        };
        let estadoJSON = JSON.stringify(estadoGrafo);
        let blob = new Blob([estadoJSON], { type: 'application/json' });
        let url = URL.createObjectURL(blob);
  
        let enlace = document.createElement('a');
        enlace.download = nombreArchivo;
        enlace.href = url;
        enlace.click();
        URL.revokeObjectURL(url);
    }
}
function cargarGrafo(event) {
    const archivo = event.target.files[0];
    if (!archivo) return;
  
    const lector = new FileReader();
    lector.onload = function() {
      const estadoJSON = lector.result;
      cargarGrafoDesdeJSON(estadoJSON);
    };
    lector.readAsText(archivo);
}
  
function cargarGrafoDesdeJSON(estadoJSON) {
    limpiar();
    const estadoGrafo = JSON.parse(estadoJSON);
    let nodosMayor = 0;
    estadoGrafo.nodos.forEach(nodo => {
        nodosDataSet.add({
            id: nodo.id,
            label: nodo.label,
            x: nodo.x,
            y: nodo.y,
            group: nodo.id.includes('origen') ? 'origen' : 'destino', // Determinar el grupo del nodo según el prefijo del ID
            color: nodo.color
        });
        const idNumerico = parseInt(nodo.id.split('_')[1]); // Obtener el número del ID para encontrar el mayor
        if(idNumerico > nodosMayor) {
            nodosMayor = idNumerico;
        }
    });

    estadoGrafo.aristas.forEach(arista => {
        aristasDataSet.add({
            id: arista.id,
            from: arista.from,
            to: arista.to,
            label: arista.label || '', // Establecer una cadena vacía si no hay etiqueta definida
            arrows: arista.arrows
        });
    });
    idsOrigen = nodosMayor + 1; // Incrementar el contador de IDs para nodos de origen
    idsDestino = nodosMayor + 1; // Incrementar el contador de IDs para nodos de destino
}
function importarArchivo() {
    const inputCargar = document.getElementById('cargarArchivo');
    inputCargar.value = ''; 
    inputCargar.click();
}
  
const inputCargar = document.getElementById('cargarArchivo');
inputCargar.addEventListener('change', cargarGrafo);
const btnDescargar = document.getElementById('descargar');
btnDescargar.addEventListener('click', guardarGrafo);