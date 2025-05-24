let grafo;
let nodosDataSet;
let aristasDataSet;
let seleccionado;
let modoEliminarArista = false;
let modoEliminarNodo = false;
let modoAgregarNodo = false; 
let modoAgregarArista = false;
let modoAgregarArista2 = false;
let btnActivos = 0;
let dobleClicEnNodoManejado = false;
let ids = 0;
let modoCambiarColorNodo = false;


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

function desactivarBotones(){
    grafo.off('click',eliminarArista);
    modoEliminarArista = false;
    grafo.off('click', eliminarNodo);
    modoEliminarNodo = false;
    grafo.off('click', clicEnNodo);
    modoAgregarArista = false;
    grafo.off('click', clicEnNodo2);
    modoAgregarArista2 = false;
    grafo.off('click',agregarNodo);  
    modoAgregarNodo = false; 
    grafo.off('click', cambiarColorNodo);
    modoCambiarColorNodo = false;
    btnActivos = 0;
}

function clicEnNodo(propiedades) {
  const { nodes } = propiedades;
  if (nodes.length > 0) {
    if (seleccionado === undefined) {
      seleccionado = nodes[0];
    } else {
      if (seleccionado !== nodes[0]) {
        aristasDataSet.add({ from: seleccionado, to: nodes[0], arrows: 'to' });
        seleccionado = undefined;
      } else {
        aristasDataSet.add({ from: seleccionado, to: seleccionado, arrows: 'to' });
        seleccionado = undefined;
      }
    }
  }
}

function clicEnNodo2(propiedades) {
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



function eliminarAristaSeleccionada() {
  toggleButton('deleteEdgeButton');
    setActiveButton('deleteEdgeButton');
    if (modoEliminarArista) {
        btnActivos--;
        modoEliminarArista = false;
        grafo.off('click', eliminarArista);
    } else {
        if(btnActivos > 0){
            desactivarBotones();
        }
        btnActivos++;
        modoEliminarArista = true;
        grafo.on('click', eliminarArista);
    }
}


function eliminarArista(event) {
    const edgeId = event.edges[0]; 
    aristasDataSet.remove({ id: edgeId }); 
}


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

function agregarAristaSeleccionada2(){
  toggleButton('edge2Button');
  setActiveButton('edge2Button');
  if(modoAgregarArista2){
      btnActivos--;
      modoAgregarArista2 = false;
      grafo.off('click', clicEnNodo2);
  }
  else{
      if(btnActivos > 0){
          desactivarBotones();
      }
      btnActivos++;
      modoAgregarArista2 = true;
      grafo.on('click', clicEnNodo2);
  }
  
}

function agregarNodoSeleccionado(){
    toggleButton('nodeButton');
    setActiveButton('nodeButton');
    if(modoAgregarNodo){
        btnActivos--;
        modoAgregarNodo = false;
        grafo.off('click',agregarNodo);   
    }
    else{
        if(btnActivos > 0){
            desactivarBotones();
        }
        btnActivos++;
        modoAgregarNodo = true;
        grafo.on('click',agregarNodo);  
    }
}

function agregarNodo(event){
    nodosDataSet.add({ id: ids, label: 'Nodo ' + (ids + 1 ), x: event.pointer.canvas.x, y: event.pointer.canvas.y });
    ids++;
}

  

function eliminarNodoSeleccionado() {
    toggleButton('deleteNodeButton');
    setActiveButton('deleteNodeButton');
    if (modoEliminarNodo) {
        btnActivos--;
        modoEliminarNodo = false;
        grafo.off('click', eliminarNodo);
    } else {
        if(btnActivos > 0){
            desactivarBotones();
        }
        btnActivos++;
        modoEliminarNodo = true;
        grafo.on('click', eliminarNodo);
    }
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
function eliminarNodo(event) {
    const nodeId = event.nodes[0]; 
    const aristasAEliminar = aristasDataSet.get({ filter: item => item.from === nodeId || item.to === nodeId });
    nodosDataSet.remove({ id: nodeId });
    aristasAEliminar.forEach(arista => {
        aristasDataSet.remove({ id: arista.id });
    });

    
}



function limpiar(){  

    document.getElementById('matriz').innerHTML = '';
    document.getElementById('solucion').innerHTML = '';


    inicializarGrafo();
    
}



document.addEventListener('DOMContentLoaded', () => {
  inicializarGrafo();
});