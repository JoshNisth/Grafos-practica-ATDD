let caminito = [];

function generarGrafoAristas() {
    return aristasDataSet.get().map((arista) => ({
      src: arista.from,
      weight: parseInt(arista.label || 1),
      dest: arista.to,
    }));
  }
    

function calcularGrados(matriz) {
    const gradosEntrada = new Array(matriz[0].length).fill(0);
    const gradosSalida = new Array(matriz[0].length).fill(0);

    matriz.forEach((fila, i) => {
        fila.forEach((valor, j) => {
            if (valor !== 0) {
                gradosSalida[i]++;
                gradosEntrada[j]++;
            }
        });
    });

    return { gradosEntrada, gradosSalida };
}


function nodoOrigen(){
    let nodoOrigen = document.getElementById("nodoInicial").value;
    let origen = nodosDataSet.get({filter: nodo=> nodo.label == nodoOrigen});
    //console.log(origen[0].id);
    return origen[0].id;
}
function nodoDestino(){
    let nodoDestino = document.getElementById("nodoFinal").value;
    let destino = nodosDataSet.get({filter: nodo=> nodo.label == nodoDestino});
    //console.log(origen[0].id);
    return destino[0].id;
}


function solveMinimum() {
    grafo.setOptions({ physics: false });
    const matriz = getMatriz();
    console.log(matriz);
    const from = nodoOrigen();
    const to = nodoDestino();
    if (from != null && to != null) {
        console.log("Nodo origen " + from);
        console.log("Nodo Destino " + to);
        const nodos = nodosDataSet.get({ fields: ['id', 'label'] });

        // Inicializar distancias
        let distancias = Array(nodos.length).fill(Infinity);
        distancias[from] = 0;

        // Array para almacenar los nodos visitados
        let visitados = Array(nodos.length).fill(false);

        // Función auxiliar para encontrar el nodo no visitado con la distancia más corta
        function nodoNoVisitadoConDistanciaMasCorta() {
            let minDistancia = Infinity;
            let minNodo = -1;
            for (let i = 0; i < nodos.length; i++) {
                if (!visitados[i] && distancias[i] < minDistancia) {
                    minDistancia = distancias[i];
                    minNodo = i;
                }
            }
            return minNodo;
        }

        // Ejecutar Dijkstra para encontrar el camino más corto
        for (let count = 0; count < nodos.length - 1; count++) {
            const u = nodoNoVisitadoConDistanciaMasCorta();
            visitados[u] = true;
            for (let v = 0; v < nodos.length; v++) {
                if (!visitados[v] && matriz[u][v] !== 0 && distancias[u] != Infinity &&
                    distancias[u] + matriz[u][v] < distancias[v]) {
                    distancias[v] = distancias[u] + matriz[u][v];
                }
            }
        }

        // Obtener el camino más corto desde el nodo de destino
        let camino = [to];
        let nodoActual = to;
        while (nodoActual != from) {
            for (let i = 0; i < nodos.length; i++) {
                if (matriz[i][nodoActual] !== 0 && distancias[i] != Infinity &&
                    distancias[i] + matriz[i][nodoActual] === distancias[nodoActual]) {
                    camino.unshift(i);
                    nodoActual = i;
                    break;
                }
            }
        }

        console.log('Distancias:', distancias);
        console.log('Camino más corto:', camino);
        pintarCamino(camino);
        mostrarSolucion(distancias, camino);

    } else {
        alert('Llene de los nodos Origen y Destino');
    }
}

function solveMaximum() {
    grafo.setOptions({ physics: false });
    const matriz = getMatriz();
    console.log(matriz);
    const from = nodoOrigen();
    const to = nodoDestino();
    if (from != null && to != null) {
        console.log("Nodo origen " + from);
        console.log("Nodo Destino " + to);
        const nodos = nodosDataSet.get({ fields: ['id', 'label'] });

        // Inicializar distancias
        let distancias = Array(nodos.length).fill(-Infinity);
        distancias[from] = 0;

        // Array para almacenar los nodos visitados
        let visitados = Array(nodos.length).fill(false);

        // Función auxiliar para encontrar el nodo no visitado con la distancia más larga
        function nodoNoVisitadoConDistanciaMasLarga() {
            let maxDistancia = -Infinity;
            let maxNodo = -1;
            for (let i = 0; i < nodos.length; i++) {
                if (!visitados[i] && distancias[i] > maxDistancia) {
                    maxDistancia = distancias[i];
                    maxNodo = i;
                }
            }
            return maxNodo;
        }

        // Ejecutar Dijkstra para encontrar el camino más largo
        for (let count = 0; count < nodos.length - 1; count++) {
            const u = nodoNoVisitadoConDistanciaMasLarga();
            visitados[u] = true;
            for (let v = 0; v < nodos.length; v++) {
                if (!visitados[v] && matriz[u][v] !== 0 && distancias[u] != -Infinity &&
                    distancias[u] + matriz[u][v] > distancias[v]) {
                    distancias[v] = distancias[u] + matriz[u][v];
                }
            }
        }

        // Obtener el camino más largo desde el nodo de destino
        let camino = [to];
        let nodoActual = to;
        while (nodoActual != from) {
            for (let i = 0; i < nodos.length; i++) {
                if (matriz[i][nodoActual] !== 0 && distancias[i] != -Infinity &&
                    distancias[i] + matriz[i][nodoActual] === distancias[nodoActual]) {
                    camino.unshift(i);
                    nodoActual = i;
                    break;
                }
            }
        }

        console.log('Distancias:', distancias);
        console.log('Camino más largo:', camino);
        pintarCamino(camino);
        mostrarSolucion(distancias, camino);
        

    } else {
        alert('Llene de los nodos Origen y Destino');
    }
}

function pintarCamino(camino) {
    grafo.setOptions({ physics: false });

    // Reseteamos los colores y bordes de todos los nodos y aristas
    nodosDataSet.forEach(nodo => {
        nodo.color = { background: '#97C2FC' };
        nodo.borderWidth = 1;
        nodo.shadow = false;
        nodosDataSet.update(nodo);
    });

    aristasDataSet.forEach(arista => {
        arista.color = { color: '#2B7CE9', highlight: '#2B7CE9' };
        arista.width = 1;
        aristasDataSet.update(arista);
    });

    // Pintamos el camino
    camino.forEach(nodoId => {
        const nodo = nodosDataSet.get(nodoId);
        if (nodo) {
            nodo.color = { background: '#FD918F' };
            nodo.shadow = true;
            nodosDataSet.update(nodo);
        }
    });

    for (let i = 0; i < camino.length - 1; i++) {
        const src = camino[i];
        const dest = camino[i + 1];

        const aristasFiltradas = aristasDataSet.get({ filter: item => item.from == src && item.to === dest });
        aristasFiltradas.forEach(arista => {
            arista.color = { color: '#FD918F' };
            arista.width = 4;
        });

        aristasDataSet.update(aristasFiltradas);
    }


    grafo.setOptions({ physics: true });
}

function mostrarSolucion(distancias){
    const contenedor = document.getElementById('solucion');
    let destino = nodoDestino();
    let html = `<h3>Total : ${distancias[destino]}</h3><table>`;
    contenedor.innerHTML = html;
}

function limpiar2(){  
    document.getElementById('matriz').innerHTML = '';
    document.getElementById('solucion').innerHTML = '';
    document.getElementById('nodoInicial').value = "";
    document.getElementById('nodoFinal').value = "";
    inicializarGrafo();
    
}













 
