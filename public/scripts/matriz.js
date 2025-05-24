function generarMatriz() {
    desactivarBotones();
    desactivarBotones2();
    const nodos = nodosDataSet.get({ fields: ['id', 'label'] });
    const matriz = [];
    const matrizObj = {};
    nodos.forEach(nodo => {
      matrizObj[nodo.id] = {};
    });
    const aristasArr = aristasDataSet.get();
    aristasArr.forEach((arista) => {
      const value = parseInt(arista.label || 1);
      matrizObj[arista.from][arista.to] = value;
    });
    nodos.forEach(nodo => {
      const fila = [];
      nodos.forEach(otroNodo => {
        fila.push(matrizObj[nodo.id][otroNodo.id] || 0); 
      });
      matriz.push(fila);
    });
    mostrarMatriz(nodos, matriz);
  }
  
  function mostrarMatriz(nodos, matriz) {
    desactivarBotones();
    desactivarBotones2();
    const contenedorMatriz = document.getElementById('matriz');
    if(nodos.length > 0){
    let html = '<h2>Matriz de Adyacencia</h2>';
    let entradas=[];
    let entradas2=[];
    html += '<table>';
    html += '<tr><th style = " background: #473179;"></th>';
    let columna = 0;
    nodos.forEach((nodo, index) => {
      html += `<th style = " background: #9E7DD4;">${nodo.label}</th>`;
      entradas[columna] = 0;
      entradas2[columna] = 0;
      columna++;
    });
    html += '<th style = " background: #FBAD41;">Grado de salida</th><th style = " background: #FD918F;">Suma de salida</th>';
    html += '</tr>';
   
    matriz.forEach((fila, index) => {
      html += `<tr><th style = " background: #9E7DD4;">${nodos[index].label}</th>`;
      let salidas = 0;
      let salida = 0;
      columna = 0;
      fila.forEach(valor => {
        html += `<td style = " background: #BCB9D8;">${valor}</td>`;
        if(valor != 0){
          salidas++;
          salida+=valor;
          entradas[columna]++;
          entradas2[columna]+=valor;
        }
        columna++;
      });
      
      html += `<th style = " background: #fdd092;">${salidas}</th>`;
      html += `<th style = " background: #f8b3b2;">${salida}</th>`;
    });
    
    html += '</tr><th style = " background: #FBAD41;">Grado de Entrada</th>';
    columna = 0;
    entradas.forEach(element => {
      html += `<th style = " background: #fdd092;">${element}</th>`;
      if(element > 0){
        columna += element;
      }
    });
    html += `<th style = " background: #f8be6d;">${columna}</th>`;
    html += '<th style = " background: #f8b3b2;"></th>';
    html += '<tr>'
    html += '</tr><th style = " background: #FD918F;">Suma de Entrada</th>';
    columna = 0;
    entradas2.forEach(element => {
      html += `<th style = " background: #f8b3b2;">${element}</th>`;
      if(element > 0){
        columna += element;
      }
    });
    html += '<th style = " background: #f8b3b2;"></th>';
    html += `<th style = " background: #fd9a98;">${columna}</th>`;
    html += '<tr>'
    html += '</table>';
    contenedorMatriz.innerHTML = html;
    }
  }

  function getMatriz() {

    desactivarBotones();
    desactivarBotones2();
    const nodos = nodosDataSet.get({ fields: ['id', 'label'] });
    const matriz = [];
    const matrizObj = {};
    nodos.forEach(nodo => {
      matrizObj[nodo.id] = {};
    });
    const aristasArr = aristasDataSet.get();
    aristasArr.forEach((arista) => {
      const value = parseInt(arista.label || 1);
      matrizObj[arista.from][arista.to] = value;
    });
    nodos.forEach(nodo => {
      const fila = [];
      nodos.forEach(otroNodo => {
        fila.push(matrizObj[nodo.id][otroNodo.id] || 0); 
      });
      matriz.push(fila);
    });
    return matriz;
  }