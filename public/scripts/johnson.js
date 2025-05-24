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
    const matriz = getMatriz();
    //console.log(matriz);
    const { gradosEntrada, gradosSalida } = calcularGrados(matriz);
    let nodoOrigen=0;
  
    gradosEntrada.forEach((value, i) => {
        if(value == 0){
            nodoOrigen = i;
        }
    });
    return nodoOrigen;
}
function nodoDestino(){
    const matriz = getMatriz();

    const { gradosEntrada, gradosSalida } = calcularGrados(matriz);

    let nodoDestino=0;
    gradosSalida.forEach((value, i) => {
        if(value == 0){
            nodoDestino = i;
        }
    });
    return nodoDestino;
}

function solveMinimum() {
  const matriz = getMatriz();
  console.log(matriz);
  const from = nodoOrigen();
  const to = nodoDestino();
  console.log("Nodo origen " +from);
  console.log("Nodo destino " +to);
  const nodos = nodosDataSet.get({ fields: ['id', 'label'] });
  let disIzq = Array(nodos.length).fill(Infinity);
  let mejorCamino = [];

  disIzq[from] = 0;
  let listaActual = [from];
  while (listaActual.length) {
    const current = listaActual.shift();
    for (let i = 0; i < nodos.length; i++) {
      if (matriz[current][i] !== 0) {
        console.log('analizando camino de', current, 'a', i);
        if (disIzq[i] > disIzq[current] + matriz[current][i]) {
          console.log('encontro mejor camino de', current, 'a', i, '=', disIzq[current] + matriz[current][i]);
          disIzq[i] = disIzq[current] + matriz[current][i];
          listaActual.push(i);
        }
      }
    }
  }
  console.log('fin de de ida, los mejores pesos izquierda', disIzq);

  listaActual = [to];
  const distDerecha = Array(nodos.length).fill(-Infinity);
  distDerecha[to] = disIzq[to];
  while (listaActual.length) {
    const current = listaActual.shift();
    for (let i = 0; i < nodos.length; i++) {
      if (matriz[i][current] !== 0) { 
        console.log('analizando camino de', current, 'a', i);
        if (distDerecha[i] < distDerecha[current] - matriz[i][current]) {
          console.log('encontro mejor camino de', current, 'a', i, '=',  distDerecha[current] - matriz[i][current]);
          distDerecha[i] = distDerecha[current] - matriz[i][current];
          listaActual.push(i);
          mejorCamino[i] = current;
        }
      }
    }
  }
  console.log('fin de de regreso, los mejores pesos derecha', distDerecha);
  console.log('mejor camino', mejorCamino);
  for (let i = 0; i < nodos.length; i++) {
    console.log(i, distDerecha[i], disIzq[i]);
  }
  mejorCamino = corregirCamino(mejorCamino,holguras(distDerecha, disIzq));
  console.log('mejor camino corregido', mejorCamino);
  
  pintarMejorCamino(bestPath(holguras(distDerecha, disIzq)),distDerecha, disIzq,holguras(distDerecha, disIzq));
}

 
  
  function solveMaximum() {
    
    const matriz = getMatriz();
    console.log(matriz);
    const from = nodoOrigen();
    const to = nodoDestino();
    console.log("Nodo origen "+from);
    console.log("Nodo Destino "+to);
    const nodos = nodosDataSet.get({ fields: ['id', 'label'] });
    let disIzq = Array(nodos.length).fill(-Infinity);
    let mejorCamino = [];
    disIzq[from] = 0;
    let listaActual = [from];
    while (listaActual.length) {
      const current = listaActual.shift();
      for (let i = 0; i < nodos.length; i++) {
        if (matriz[current][i] !== 0) {
          console.log('analizando camino de', current, 'a', i);
          if (disIzq[i] < disIzq[current] + matriz[current][i]) {
            console.log('encontro mayor camino de', current, 'a', i, '=', disIzq[current] + matriz[current][i]);
            disIzq[i] = disIzq[current] + matriz[current][i];
            listaActual.push(i);
          }
        }
      }
    }
    console.log('fin de de ida, los mejores pesos izquierda', disIzq);
  
    listaActual = [to];
    const distDerecha = Array(nodos.length).fill(Infinity);
    distDerecha[to] = disIzq[to];
    while (listaActual.length) {
      const current = listaActual.shift();
      for (let i = 0; i < nodos.length; i++) {
        if (matriz[i][current] !== 0) { // al reves
          console.log('analizando camino de', current, 'a', i, 'distancias a evaluar', distDerecha[i], disIzq[current] - matriz[i][current]);
          if (distDerecha[i] > distDerecha[current] - matriz[i][current]) {
            console.log('encontro nueva derecha de', current, 'a', i, '=', disIzq[current] - matriz[i][current]);
            distDerecha[i] = distDerecha[current] - matriz[i][current];
            listaActual.push(i);
            mejorCamino[i] = current;
          }
        }
      }
    }
    console.log('fin de de regreso, los mejores pesos derecha', distDerecha);
    console.log('mejor camino', mejorCamino);
    for (let i = 0; i < nodos.length; i++) {
      console.log(i, distDerecha[i], disIzq[i]);
    }
    mejorCamino = corregirCamino(mejorCamino,holguras(distDerecha, disIzq));
    console.log('mejor camino corregido', mejorCamino);
    
    pintarMejorCamino(bestPath(holguras(distDerecha, disIzq)),distDerecha, disIzq,holguras(distDerecha, disIzq));
  }

  function holguras(distDerecha, disIzq) {
    const matrizAristas = generarGrafoAristas();
    const resultado = [];

    for (let i = 0; i < matrizAristas.length; i++) {
        const src = matrizAristas[i].src;
        const dest = matrizAristas[i].dest;
        const holgura = distDerecha[dest] - disIzq[src] - matrizAristas[i].weight;
        const holguraInfo = {
            src: src,
            dest: dest,
            holgura: holgura
        };
        resultado.push(holguraInfo);
    }
    console.log(resultado);
    return resultado;
}


function corregirCamino(mejorCamino, holguras) {
  for (let i = 0; i < holguras.length; i++) {
      const src = holguras[i].src;
      const dest = holguras[i].dest;
      if (dest == mejorCamino[src]) {
          if (holguras[i].holgura != 0) {
              mejorCamino[src] = -1;
          }
      }
  }
  //console.log(mejorCamino);
  return mejorCamino;
}


function pintarMejorCamino(mejorCamino,distDerecha, disIzq,holguras) {
  let total = 0;
  const nodoDestinoId = nodoDestino();
  grafo.setOptions({ physics: false });
  nodosDataSet.forEach(nodo => {
    nodo.color = { background: '#97C2FC' }; 
    nodo.borderWidth= 1;
    nodo.shadow = false;
    nodosDataSet.update(nodo); 
  });
  aristasDataSet.forEach(arista => {
    arista.color = { color: '#2B7CE9', highlight: '#2B7CE9' }; 
    arista.width = 1;
    aristasDataSet.update(arista);
});


  mejorCamino.forEach((value, i) => {
    console.log(value);
    if (value !== -1) {
      console.log("intenta pintarse");
      const nodo = nodosDataSet.get(i); 
      if (nodo) { 
        nodo.color = { background: '#FD918F' }; 
        nodo.shadow = true;
        nodosDataSet.update(nodo); 
      }
    }
  });
  const nodo = nodosDataSet.get(nodoDestinoId); 
      if (nodo) { 
        nodo.color = { background: '#FD918F' }; 
        nodo.shadow = true;
        nodosDataSet.update(nodo); 
      }

      for (let i = 0; i < holguras.length; i++) {
        const holgura = holguras[i].holgura; 
        
        if (holgura == 0) { 
            const src = holguras[i].src;
            const dest = holguras[i].dest;

            const aristasFiltradas = aristasDataSet.get({ filter: item => item.from == src && item.to === dest });
            aristasFiltradas.forEach(arista => {
                arista.color = { color: '#FD918F' }; 
                arista.width = 4;
                total += parseInt(arista.label);
            });
    
            aristasDataSet.update(aristasFiltradas);
        }
    }
    
    
    grafo.setOptions({ physics: true});
      mostrarSolucion(distDerecha, disIzq,holguras, total);
}

function mostrarSolucion(distDerecha, disIzq,holguras,total) {
  const contenedor = document.getElementById('solucion');
  let html = '<h3>Acumuladas</h3><table>';
  for (let i = 0; i < nodosDataSet.length; i++) {
    html += `<tr><th colspan="2" style="background: #9E7DD4;">${nodosDataSet.get(i).label}</th></tr><tr><td style="background: #BCB9D8;">${disIzq[i]}</td><td style="background: #BCB9D8;">${distDerecha[i]}</td></tr>`;
    console.log(i, distDerecha[i], disIzq[i]);
  }
  html += '</table>';
  html += '<h3>Holguras</h3><table>';

  for (let i = 0; i < holguras.length; i++) {
    const src = holguras[i].src;
    const dest = holguras[i].dest;
    const holgura = holguras[i].holgura;
    html += `<tr><th colspan="2" style="background: #FBAD41;">${nodosDataSet.get(src).label} ->  ${nodosDataSet.get(dest).label}</th> <td style="background:  #fdd092;"> ${holgura} </td></tr>`
  }
  html += '</table>';
  html += `<h3>Total : ${total}</h3><table>`;
  contenedor.innerHTML = html;
}


async function pintarMejorCamino2( ) {
  let total = 0;
  const nodoDestinoId = nodoDestino();
  const nodoOrigenId = nodoOrigen();
  grafo.setOptions({
    physics: {
      enabled: true,
      repulsion: {
        nodeDistance: 100, // Ajusta la distancia de repulsión entre nodos
      },
      barnesHut: {
        gravitationalConstant: -2000, // Ajusta la constante gravitacional de Barnes-Hut
        centralGravity: 0.3, // Ajusta la gravedad central de Barnes-Hut
        springLength: 150, // Ajusta la longitud del resorte entre nodos
        springConstant: 0.03, // Ajusta la constante del resorte entre nodos con un valor menor para reducir el rebote
      },
    },
  });
  
  
  // Volver todo a sus colores originales
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

  // Pintar el camino crítico con retrasos
  let i = nodoOrigenId;
  while (i != nodoDestinoId) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Retraso de medio segundo
      const nodo = nodosDataSet.get(i);
      if (nodo) {
          nodo.color = { background: '#FBAD41' };
          nodo.shadow = true;
          nodosDataSet.update(nodo);
      }

      const aristasFiltradas = aristasDataSet.get({ filter: item => item.from == i && item.to == caminito[i] });
      aristasFiltradas.forEach(arista => {
          arista.color = { color: '#FBAD41' };
          arista.width = 4;
          total += parseInt(arista.label);
      });

      aristasDataSet.update(aristasFiltradas);
      i = caminito[i];


  }

  // Pintar el nodo destino al final
  await new Promise(resolve => setTimeout(resolve, 500)); // Retraso de medio segundo para el nodo destino
  const nodo = nodosDataSet.get(nodoDestinoId);
  if (nodo) {
      nodo.color = { background: '#FBAD41' };
      nodo.shadow = true;
      nodosDataSet.update(nodo);
  }
  //grafo.setOptions({ physics: true });
}


function bestPath(holguras){
  let camino = [];
  let bestCamino = Array(nodosDataSet.length).fill(-1);
  for(let i = 0; i < holguras.length; i++){
    const src = holguras[i].src;
    const dest = holguras[i].dest;
    const holgura = holguras[i].holgura;
    if(holgura == 0){
      const caminoInfo = {
        src: src,
        dest: dest,
    };
    camino.push(caminoInfo);
    bestCamino[src] =  dest;
    }
  }
  //console.log("camino holgura 0", camino);
  caminito = bestCamino;
  return bestCamino;
}













 

