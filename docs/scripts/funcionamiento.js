

let nodoSeleccionadoId = null;

let buttonStates = {
    nodeButton: false,
    nodeOfertaButton:false,
    nodeDemandaButton:false,
    edgeButton: false,
    edge2Button: false,
    deleteEdgeButton: false,
    matrixButton: false,
    importButton: false,
    exportButton: false,
    saveButton: false,
    deleteNodeButton: false
};
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
function desactivarBotones2() {
    for (const key in buttonStates) {
        if (buttonStates[key]) {
            toggleButton(key);
            buttonStates[key] = false;
        }
    }
}

function openHelpPage() {
  desactivarBotones();
  desactivarBotones2();
  var helpPageURL = 'help.html';
  window.open(helpPageURL, 'helpPage', 'width=800,height=500,top=100,left=100,resizable=yes,scrollbars=yes');
}
function openHelpPageKruskal() {
    desactivarBotones();
    desactivarBotones2();
    var helpPageURL = 'helpKruskal.html';
    window.open(helpPageURL, 'helpPage', 'width=800,height=500,top=100,left=100,resizable=yes,scrollbars=yes');
  }
function openHelpPageCompet() {
    desactivarBotones();
    desactivarBotones2();
    var helpPageURL = 'helpCompet.html';
    window.open(helpPageURL, 'helpPage', 'width=800,height=500,top=100,left=100,resizable=yes,scrollbars=yes');
  }
function openHelpPageSort() {
    desactivarBotones();
    desactivarBotones2();
    var helpPageURL = 'helpSort.html';
    window.open(helpPageURL, 'helpSortPage', 'width=800,height=500,top=100,left=100,resizable=yes,scrollbars=yes');
  }
/*
function dobleClicEnNodo(propiedades) {
    const { nodes } = propiedades;
    if (nodes.length > 0) {
        const nodeId = nodes[0];
        mostrarHerramientas(nodeId);
    }
}

function dobleClicEnArista(propiedades) {
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

*/


function cambiarColorLienzo() {
  desactivarBotones();
  desactivarBotones2();
  const color = document.getElementById('colorSelector').value;
  const lienzo = document.getElementById('lienzo');
  lienzo.style.backgroundColor = color;
}

function cambiarColorNodo(event) {
    const nodeId = event.nodes[0];
    if (nodeId !== undefined && nodeId === nodoSeleccionadoId) {
        const color = document.getElementById('colorSelectorNode').value;
        nodosDataSet.update({ id: nodeId, color: { background: color, border: color } });
    }
}

function cambiarColorNodoSeleccionado() {
    const colorSelectorNode = document.getElementById('colorSelectorNode');

    if (modoCambiarColorNodo) {
        
        btnActivos--;
        modoCambiarColorNodo = false;
        grafo.off('click'); 
        colorSelectorNode.style.display = 'none'; 
        nodoSeleccionadoId = null; 
    } else {
        if (btnActivos > 0) {
            desactivarBotones();
        }
        btnActivos++;
        modoCambiarColorNodo = true;
        grafo.on('click', function (event) {
            const nodeId = event.nodes[0];
            if (nodeId !== undefined) {
                colorSelectorNode.style.display = 'inline-block'; 
                colorSelectorNode.onchange = function () {
                    const color = colorSelectorNode.value;
                    nodosDataSet.update({ id: nodeId, color: { background: color, border: color } });
                    colorSelectorNode.style.display = 'none'; 
                    nodoSeleccionadoId = null; 
                };

               
                nodoSeleccionadoId = nodeId;
            }
        });
    }
}



function exportarAJSON() {
  const nodos = nodosDataSet.get({ returnType: "Object" });
  const aristas = aristasDataSet.get({ returnType: "Object" });
  const aristasConFlechas = aristas.map(arista => {
      return {
          id: arista.id,
          from: arista.from,
          to: arista.to,
          label: arista.label,
          arrows: arista.arrows  
      };
  });

  const informacion = {
      nodos: nodos,
      aristas: aristasConFlechas  
  };
  const informacionJSON = JSON.stringify(informacion, null, 2);
  const blob = new Blob([informacionJSON], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const enlace = document.createElement('a');
  enlace.download = 'informacion.json';
  enlace.href = url;
  enlace.click();
  URL.revokeObjectURL(url);
}


function openColorPicker() {
    var colorSelector = document.getElementById('colorSelector');
    colorSelector.click(); 
}


function guardarGrafo() {
  let nombreArchivo = prompt("Por favor, ingrese el nombre del archivo:", "grafoNodolandia.json");

  if (nombreArchivo != null) {
      let estadoGrafo = {
          nodos: nodosDataSet.get({ fields: ['id', 'label', 'x', 'y', 'color', 'image','shape'] }),
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
            color: nodo.color,
            image: nodo.image,
            shape: nodo.shape,
        });
        if(nodo.id > nodosMayor){
          nodosMayor = nodo.id;
        }
    });

    estadoGrafo.aristas.forEach(arista => {
        aristasDataSet.add({
            id: arista.id,
            from: arista.from,
            to: arista.to,
            label: arista.label,
            arrows: arista.arrows
        });
    });
    ids = nodosMayor + 1;
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

  