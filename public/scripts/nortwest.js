let numFilas = 0;
let numColumnas = 0;
let f=0;
let c=0;
function inicializar() {
    numFilas = parseInt(document.getElementById('filas').value);
    f = numFilas;
    numColumnas = parseInt(document.getElementById('columnas').value);
    c=numColumnas;
}

document.getElementById('matrizForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe automáticamente
    inicializar();

    // Obtener el div donde se colocarán los inputs de la matriz
    const matrizInputsDiv = document.getElementById('matrizInputs');
    
    // Generar los inputs de la matriz
    let matrizInputsHTML = '<table>'; // Usar una tabla para organizar los inputs y los encabezados

    // Encabezados de columnas
    matrizInputsHTML += '<tr>'; // Espacio para el encabezado de filas
    for (let j = 0; j < numColumnas; j++) {
        if(j==0){
            matrizInputsHTML += '<td></td>'
        }
        matrizInputsHTML += `<td contenteditable="true">Col ${j + 1}</td>`; // Encabezado de columna editable
    }
    matrizInputsHTML += `<td contenteditable="false">Disponibilidad</td>`; 
    matrizInputsHTML += '<td></td></tr>';

    for (let i = 0; i < numFilas; i++) {
        matrizInputsHTML += '<tr>';
        // Encabezado de fila
        matrizInputsHTML += `<td contenteditable="true">Fila ${i + 1}</td>`;
        for (let j = 0; j < numColumnas+1; j++) {
            let inputId = `valor-${i}-${j}`;
            if(j==numColumnas){
                inputId = `demanda-${i}`;
            }
            matrizInputsHTML += `<td><input type="number" id="${inputId}" name="${inputId}" min="0" value="0"></td>`;
        }
        // Botón para eliminar la fila
        matrizInputsHTML += `<td><button class="eliminarFila"  onclick="eliminarFila(this)">Eliminar Fila</button></td>`;
        matrizInputsHTML += '</tr>';
    }
    matrizInputsHTML += `<td contenteditable="true">Demanda</td>`;
    for (let j = 0; j < numColumnas; j++) {
            const inputId = `demanda-${j}`;
            matrizInputsHTML += `<td><input type="number" id="${inputId}" name="${inputId}" min="0" value="0"></td>`;
        }

    // Agregar una fila adicional al final con botones para agregar y eliminar columnas
    matrizInputsHTML += '<tr>';
    for (let j = 0; j <= numColumnas; j++) {
        if(j==0){
            matrizInputsHTML += '<td></td>'
        }
        else{
            matrizInputsHTML += `<td><button class="eliminarColumna" onclick="eliminarColumna(this)">Eliminar Columna</button></td>`;
        }
    }
    matrizInputsHTML += '</tr>';

    matrizInputsHTML += '</table>';
    // Agregar botones para agregar fila y columna
    matrizInputsHTML += '<button id="addFila">Agregar fila</button> <button id="addColumna">Agregar columna</button>';

    // Agregar los inputs de la matriz al div
    matrizInputsDiv.innerHTML = matrizInputsHTML;


    // Agregar event listeners para los botones de agregar fila y columna
    document.getElementById('addFila').addEventListener('click', function() {
        const tabla = document.querySelector('#matrizInputs table');
        agregarFila( tabla.rows.length -2, tabla.rows[0].cells.length-2 );
    });

    document.getElementById('addColumna').addEventListener('click', function() {
        const tabla = document.querySelector('#matrizInputs table');
        agregarColumna(tabla.rows[0].cells.length-2,  tabla.rows.length-2);
    });

});

function agregarFila(fila, columnas) {
    f++;
    const tabla = document.querySelector('#matrizInputs table');
    const nuevaFila = tabla.insertRow(fila); // Insertar antes de la última fila de botones
    nuevaFila.innerHTML += `<td contenteditable="true">Fila ${f}</td>`;
    for (let j = 0; j < columnas; j++) {
        const inputId = `valor-${fila - 1}-${j}`;
        nuevaFila.innerHTML += `<td><input type="number" id="${inputId}" name="${inputId}" min="0" value="0"></td>`;
    }
    nuevaFila.innerHTML += `<td><button class="eliminarFila" onclick="eliminarFila(this)">Eliminar Fila</button></td>`;
}

function eliminarFila(button) {
    const fila = button.closest('tr'); // Obtener la fila más cercana (tr) que contiene el botón
    fila.remove(); // Eliminar la fila de la tabla
}

function agregarColumna(columna, filas) {
    c++;
    const tabla = document.querySelector('#matrizInputs table');

    // Insertar celda de encabezado en la primera fila
    const encabezadoColumna = document.createElement('td');
    encabezadoColumna.contentEditable = true;
    encabezadoColumna.textContent = `Col ${c}`;
    tabla.rows[0].insertBefore(encabezadoColumna, tabla.rows[0].cells[columna]);

    // Insertar celdas de input en cada fila
    for (let i = 1; i <= filas; i++) {
        const nuevaCelda = document.createElement('td');
        const inputId = `valor-${i - 1}-${columna-1}`;
        nuevaCelda.innerHTML = `<input type="number" id="${inputId}" name="${inputId}" min="0" value="0">`;
        tabla.rows[i].insertBefore(nuevaCelda, tabla.rows[i].cells[columna]);
    }

    // Insertar botón de eliminar columna en la última fila
    const nuevaCeldaBoton = document.createElement('td');
    nuevaCeldaBoton.innerHTML = `<button class="eliminarColumna" onclick="eliminarColumna(this)">Eliminar Columna</button>`;
    tabla.rows[filas + 1].insertBefore(nuevaCeldaBoton, tabla.rows[filas + 1].cells[columna]);
}

function eliminarColumna(button) {
    const columnaIndex = button.parentElement.cellIndex; // Obtener el índice de la celda que contiene el botón
    //console.log(columnaIndex);
    const tabla = button.closest('table'); // Obtener la tabla más cercana que contiene el botón

    const filas = tabla.rows.length;
    for (let i = 0; i < filas; i++) {
        tabla.rows[i].deleteCell(columnaIndex);
    }
    

}


function crearMatriz(){
    let matriz = [];
    let columnasNombres = [];
    let filasNombres = [];
    let demanda = [];
    let disponibilidad = [];
    const tabla = document.querySelector('#matrizInputs table');

    for(let i = 1; i < tabla.rows[0].cells.length-2; i++ ){
        columnasNombres.push(tabla.rows[0].cells[i].textContent);
    }

    for(let i = 1; i < tabla.rows.length-2; i++){
        filasNombres.push(tabla.rows[i].cells[0].textContent);
    }

    for(let i = 1; i < tabla.rows.length-2; i++){
        let fila = [];
        for(let j = 1; j < tabla.rows[i].cells.length-2; j++ ){
            fila.push(parseInt(tabla.rows[i].cells[j].querySelector('input[type="number"]').value));
        }
        matriz.push(fila);
    }

    for(let i = 1; i < tabla.rows[tabla.rows.length-2].cells.length; i++ ){
        demanda.push(parseInt(tabla.rows[tabla.rows.length-2].cells[i].querySelector('input[type="number"]').value));
    }

    for(let i = 1; i < tabla.rows.length-2; i++){
        disponibilidad.push(parseInt(tabla.rows[i].cells[tabla.rows[i].cells.length-2].querySelector('input[type="number"]').value));
    }

    mostrarMatrizNW(filasNombres, columnasNombres, matriz, demanda, disponibilidad);
    let maximizedCosts = maximizarCostos2(matriz, demanda, disponibilidad);  // Asume que la función devuelve un resultado directamente
    imprimirCostos(filasNombres, columnasNombres, matriz, demanda, disponibilidad, maximizedCosts);
}



function mostrarMatrizNW(fNom, cNom, matriz,demanda,disponibilidad) {
    const contenedorMatriz = document.getElementById('matriz');
    generarGrafoDesdeMatriz(fNom, cNom, matriz);
    let html = '<h2>Disponibilidad vs Demanda</h2>';
    html += '<table>';
    html += '<tr><th style = " background: #473179;"></th>';
    cNom.forEach((valor, index) => {
      html += `<th style = " background: #9E7DD4;">${valor}</th>`;

    });
    html += '<th style = " background: #FBAD41;">Disponibilidad</th>';
    html += '</tr>';
   
    matriz.forEach((fila, index) => {
      html += `<tr><th style = " background: #9E7DD4;">${fNom[index]}</th>`;
      let salida = 0;
      columna = 0;
      fila.forEach(valor => {
        html += `<td style = " background: #BCB9D8;">${valor}</td>`;
      });
      
      html += `<th style = " background: #f8b3b2;">${disponibilidad[index]}</th>`;
    });
    
    html += '</tr><th style = " background: #FBAD41;">Demanda</th>';
    columna = 0;
    demanda.forEach(element => {
      html += `<th style = " background: #f8b3b2;">${element}</th>`;
      if(element > 0){
        columna += element;
      }
    });
    columna2 = 0;
    disponibilidad.forEach(element => {
      if(element > 0){
        columna2 += element;
      }
    });
    html += `<th style = " background: #fd9a98;">${columna}/${columna2}</th>`;
    html += '<tr>'
    html += '</table>';
    contenedorMatriz.innerHTML = html;
}
function obtenerNombresColumnas() {
    const tabla = document.querySelector('#matrizInputs table');
    let columnasNombres = [];
    for (let i = 1; i < tabla.rows[0].cells.length - 2; i++) {
        columnasNombres.push(tabla.rows[0].cells[i].textContent);
    }
    return columnasNombres;
}

function obtenerNombresFilas() {
    const tabla = document.querySelector('#matrizInputs table');
    let filasNombres = [];
    for (let i = 1; i < tabla.rows.length - 2; i++) {
        filasNombres.push(tabla.rows[i].cells[0].textContent);
    }
    return filasNombres;
}

function obtenerDemanda() {
    const tabla = document.querySelector('#matrizInputs table');
    let demanda = [];
    for (let i = 1; i < tabla.rows[tabla.rows.length - 2].cells.length; i++) {
        demanda.push(parseInt(tabla.rows[tabla.rows.length - 2].cells[i].querySelector('input[type="number"]').value));
    }
    return demanda;
}

function obtenerDisponibilidad() {
    const tabla = document.querySelector('#matrizInputs table');
    let disponibilidad = [];
    for (let i = 1; i < tabla.rows.length - 2; i++) {
        disponibilidad.push(parseInt(tabla.rows[i].cells[tabla.rows[i].cells.length - 2].querySelector('input[type="number"]').value));
    }
    return disponibilidad;
}
function maximizarCostos2(costos, demanda, disponibilidad) {
    let problem = {
        optimize: 'costo',
        opType: 'max',
        constraints: {},
        variables: {}
    };

    costos.forEach((fila, i) => {
        fila.forEach((costo, j) => {
            let variableName = `x${i}${j}`;
            problem.variables[variableName] = {
                costo: costo
            };
            problem.constraints[`demand${j}`] = { max: demanda[j] };
            problem.constraints[`supply${i}`] = { max: disponibilidad[i] };
            problem.variables[variableName][`demand${j}`] = 1;
            problem.variables[variableName][`supply${i}`] = 1;
        });
    });

    let solverResult = solver.Solve(problem);
    console.log(solverResult);
    return solverResult;
}


function imprimirCostos(fNom, cNom,costos, demanda, disponibilidad, solucion){
    const contenedorMatriz = document.getElementById('solucion');
    let matrizSol = [];
    let html = '<h2>Solucion</h2><br>';
    html += '<table>';
    html += '<tr><th style = " background: #473179;"></th>';
    cNom.forEach((valor, index) => {
      html += `<th style = " background: #9E7DD4;">${valor}</th>`;

    });
    html += '<th style = " background: #FBAD41;">Disponibilidad</th>';
    html += '</tr>';
   let total = 0;
    for(let i = 0;i < fNom.length; i++) {
      html += `<tr><th style = " background: #9E7DD4;">${fNom[i]}</th>`;
      let salida = 0;
      columna = 0;
      let fila = [];
      for(let j = 0;j < cNom.length; j++) {
        let valor='x'+i+j;
       valor= solucion[valor];
        
        if(valor!=undefined){
            
            html += `<td style = " background: #BCB9D8;">${valor}</td>`;
            total += valor*costos[i][j];
            
        }
        else{
            html += `<td style = " background: #BCB9D8;">0</td>`;
            valor = 0;
        }
        fila.push(parseInt(valor));

        
      }
      matrizSol.push(fila);
      
      html += `<th style = " background: #f8b3b2;">${disponibilidad[i]}</th>`;
    }
    
    html += '</tr><th style = " background: #FBAD41;">Demanda</th>';
    columna = 0;
    demanda.forEach(element => {
      html += `<th style = " background: #f8b3b2;">${element}</th>`;
      if(element > 0){
        columna += element;
      }
    });
    columna2 = 0;
    disponibilidad.forEach(element => {
      if(element > 0){
        columna2 += element;
      }
    });
    html += `<th style = " background: #fd9a98;">${columna}/${columna2}</th>`;
    html += '<tr>'
    html += `</table> <br><h3>Total maximo: ${total} </h3>`;
    contenedorMatriz.innerHTML = html;
    console.log("solucion",solucion);
}


function crearMatriz2() {
    let matriz = obtenerMatrizInicial();
    let columnasNombres = obtenerNombresColumnas();
    let filasNombres = obtenerNombresFilas();
    let demanda = obtenerDemanda();
    let disponibilidad = obtenerDisponibilidad();

    let resultado = minimizarCostosCostoMinimo(matriz, demanda, disponibilidad);
    mostrarMatrizNW(filasNombres, columnasNombres, matriz, demanda, disponibilidad);
    mostrarNortWestMinimo(filasNombres, columnasNombres, resultado.asignaciones, demanda, disponibilidad, resultado.totalCosto);
}

function mostrarNortWestMinimo(fNom, cNom, matriz,demanda,disponibilidad, minimoTotal) {
    console.log('se muestra la matriz');
    const contenedorMatriz = document.getElementById('solucion');
    console.log('se muestra la matriz despues del document');
    let html = '<h2>Solucion</h2>';
    html += '<table>';
    html += '<tr><th style = " background: #473179;"></th>';
    cNom.forEach((valor, index) => {
      html += `<th style = " background: #9E7DD4;">${valor}</th>`;

    });
    html += '<th style = " background: #FBAD41;">Disponibilidad</th>';
    html += '</tr>';
   
    matriz.forEach((fila, index) => {
      html += `<tr><th style = " background: #9E7DD4;">${fNom[index]}</th>`;
      let salida = 0;
      columna = 0;
      fila.forEach(valor => {
        html += `<td style = " background: #BCB9D8;">${valor}</td>`;
      });
      
      html += `<th style = " background: #f8b3b2;">${disponibilidad[index]}</th>`;
    });
    
    html += '</tr><th style = " background: #FBAD41;">Demanda</th>';
    columna = 0;
    demanda.forEach(element => {
      html += `<th style = " background: #f8b3b2;">${element}</th>`;
      if(element > 0){
        columna += element;
      }
    });
    columna2 = 0;
    disponibilidad.forEach(element => {
      if(element > 0){
        columna2 += element;
      }
    });
    html += `<th style = " background: #fd9a98;">${columna}/${columna2}</th>`;
    html += '<tr>'
    html += '</table>';
    html += `</table> <br><h3>Total minimo: ${minimoTotal} </h3>`;
    contenedorMatriz.innerHTML = html;
}
function crearMatrizNortwestMinima(fNom, cNom, demanda, disponibilidad) {
    const numFilas = disponibilidad.length;
    const numColumnas = demanda.length;
    let nortwest = new Array(numFilas).fill().map(() => new Array(numColumnas).fill(0));
    let demandaRestante = [...demanda];
    let disponibilidadRestante = [...disponibilidad];

    let i = 0, j = 0;
    while (i < numFilas && j < numColumnas) {
        const asignacion = Math.min(demandaRestante[j], disponibilidadRestante[i]);
        nortwest[i][j] = asignacion;
        demandaRestante[j] -= asignacion;
        disponibilidadRestante[i] -= asignacion;

        if (demandaRestante[j] === 0) j++;
        if (disponibilidadRestante[i] === 0) i++;
    }

    let minimoTotal = calcularCostoTotal(nortwest, obtenerMatrizInicial());
    mostrarNortWestMinimo(fNom, cNom, nortwest, demanda, disponibilidad, minimoTotal);
}
function calcularCostoTotal(nortwest, costos) {
    let total = 0;
    for (let i = 0; i < nortwest.length; i++) {
        for (let j = 0; j < nortwest[i].length; j++) {
            total += nortwest[i][j] * costos[i][j];
        }
    }
    return total;
}
function obtenerValorMinimo(i, j) {
    const tabla = document.querySelector('#matrizInputs table');
    return parseInt(tabla.rows[i + 1].cells[j + 1].querySelector('input[type="number"]').value);
}
function obtenerMatrizInicial() {
    let matriz = [];
    const tabla = document.querySelector('#matrizInputs table');
    // Obtener valores de la matriz
    for (let i = 1; i < tabla.rows.length - 2; i++) {
        let fila = [];
        for (let j = 1; j < tabla.rows[i].cells.length - 2; j++) {
            fila.push(parseInt(tabla.rows[i].cells[j].querySelector('input[type="number"]').value));
        }
        matriz.push(fila);
    }
    return matriz;
}

function crearMatrizResultante(matrizNortwest, matrizInicial) {
    // Encontrar las posiciones relevantes en la matriz inicial
    const posicionesRelevantes = [];
    matrizNortwest.forEach((filaNortwest, i) => {
        filaNortwest.forEach((asignacion, j) => {
            if (asignacion !== 0) {
                posicionesRelevantes.push({ fila: i, columna: j });
            }
        });
    });

    // Crear la matriz resultante con ceros en todas las posiciones
    const matrizResultante = new Array(matrizNortwest.length).fill().map(() => new Array(matrizInicial[0].length).fill(0));

    // Llenar la matriz resultante con los costos relevantes
    posicionesRelevantes.forEach(({ fila, columna }) => {
        matrizResultante[fila][columna] = matrizInicial[fila][columna];
    });

    // Ajustar la demanda y la disponibilidad
    const demandaResultante = [...matrizNortwest.map(fila => fila.reduce((acc, asignacion) => acc - asignacion, 0))];
    const disponibilidadResultante = [...matrizNortwest.reduce((acc, fila) => {
        fila.forEach((asignacion, j) => {
            acc[j] -= asignacion;
        });
        return acc;
    }, [...matrizInicial.map(fila => fila.reduce((acc, costo) => acc + costo, 0))])];

    return { matriz: matrizResultante, demanda: demandaResultante, disponibilidad: disponibilidadResultante };
}

function generarGrafoDesdeMatriz(filas, columnas, matriz) {
    ids = 0;
    // Actualizar nodos correspondientes a las filas
    filas.forEach((filaNombre, filaIndex) => {
      nodosDataSet.update({ id: filaIndex, label: filaNombre, color: { background: 'lightgreen', border: 'green' } }); // Establecer el color verde
      ids++;
    });
    // Obtener el valor máximo de los IDs de los nodos de las filas
    const ultimoIdFila = ids - 1;
  
    // Actualizar nodos correspondientes a las columnas
    columnas.forEach((columnaNombre, columnaIndex) => {
      nodosDataSet.update({ id: ultimoIdFila + columnaIndex + 1, label: columnaNombre }); // Establecer el nombre como etiqueta
      ids++;
    });

    // Limpiar aristas existentes
    aristasDataSet.clear();
  
    // Agregar aristas con valores desde la matriz
    filas.forEach((filaNombre, filaIndex) => {
      columnas.forEach((columnaNombre, columnaIndex) => {
        const valor = matriz[filaIndex][columnaIndex];
        if (valor !== 0) {
          const fromId = filaIndex;
          const toId = ultimoIdFila + columnaIndex + 1;
          // Agregar arista con ID y valor
          const edgeId = `edge_${fromId}_${toId}`;
          aristasDataSet.add({ id: edgeId, from: fromId, to: toId, label: String(valor), arrows: 'to' });
        }
      });
    });

    // Actualizar la red con los nuevos datos
    grafo.setData({ nodes: nodosDataSet, edges: aristasDataSet });
}
function multiplicacionYSuma(matriz1, matriz2) {
    if (matriz1.length === 0 || matriz2.length === 0 || matriz1.length !== matriz2.length || matriz1[0].length !== matriz2[0].length) {
        console.error('Las matrices no tienen dimensiones válidas para la operación.');
        return null;
    }
    let suma= 0;
    for (let i = 0; i < matriz1.length; i++) {
        for (let j = 0; j < matriz1[i].length; j++) {
            suma+= matriz1[i][j] * matriz2[i][j];
        }
    }
    return suma;

}
function generarGrafoDesdeMatriz(filas, columnas, matriz) {
    ids = 0;
    // Actualizar nodos correspondientes a las filas
    filas.forEach((filaNombre, filaIndex) => {
      nodosDataSet.update({ id: filaIndex, label: filaNombre, color: { background: 'lightgreen', border: 'green' } }); // Establecer el color verde
      ids++;
    });
  
    // Obtener el valor máximo de los IDs de los nodos de las filas
    const ultimoIdFila = ids - 1;
  
    // Actualizar nodos correspondientes a las columnas
    columnas.forEach((columnaNombre, columnaIndex) => {
      nodosDataSet.update({ id: ultimoIdFila + columnaIndex + 1, label: columnaNombre }); // Establecer el nombre como etiqueta
      ids++;
    });
  
    // Limpiar aristas existentes
    aristasDataSet.clear();
  
    // Agregar aristas con valores desde la matriz
    filas.forEach((filaNombre, filaIndex) => {
      columnas.forEach((columnaNombre, columnaIndex) => {
        const valor = matriz[filaIndex][columnaIndex];
        if (valor !== 0) {
          const fromId = filaIndex;
          const toId = ultimoIdFila + columnaIndex + 1;
          // Agregar arista con ID y valor
          const edgeId = `edge_${fromId}_${toId}`;
          aristasDataSet.add({ id: edgeId, from: fromId, to: toId, label: String(valor), arrows: 'to' });
        }
      });
    });
  
    // Actualizar la red con los nuevos datos
    grafo.setData({ nodes: nodosDataSet, edges: aristasDataSet });
}
function minimizarCostosCostoMinimo(costos, demanda, disponibilidad) {
    let totalCosto = 0;
    let asignaciones = Array.from({ length: costos.length }, () => Array(costos[0].length).fill(0));
    let demandaRestante = [...demanda];
    let disponibilidadRestante = [...disponibilidad];

    while (demandaRestante.some(d => d > 0) && disponibilidadRestante.some(s => s > 0)) {
        let { i, j } = encontrarMenorCosto(costos, demandaRestante, disponibilidadRestante);
        let cantidad = Math.min(disponibilidadRestante[i], demandaRestante[j]);
        asignaciones[i][j] += cantidad;
        totalCosto += cantidad * costos[i][j];
        disponibilidadRestante[i] -= cantidad;
        demandaRestante[j] -= cantidad;
    }

    return { asignaciones, totalCosto };
}

function encontrarMenorCosto(costos, demandaRestante, disponibilidadRestante) {
    let minCosto = Infinity;
    let minPos = { i: -1, j: -1 };
    for (let i = 0; i < costos.length; i++) {
        for (let j = 0; j < costos[i].length; j++) {
            if (costos[i][j] < minCosto && disponibilidadRestante[i] > 0 && demandaRestante[j] > 0) {
                minCosto = costos[i][j];
                minPos = { i, j };
            }
        }
    }
    return minPos;
}
