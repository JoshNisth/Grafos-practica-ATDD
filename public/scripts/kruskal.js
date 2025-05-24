// Implementación de Kruskal para el algoritmo de expansión mínima
function kruskalMaxMin(modo) {
  // Restablece el color y el grosor de todas las aristas antes de comenzar
  aristasDataSet.forEach(function(arista) {
      aristasDataSet.update({
          id: arista.id,
          color: { color: '#848484' }, // Puedes usar el color original de tus aristas
          width: 1  // Grosor original de tus aristas
      });
  });

  const edges = aristasDataSet.get({
      filter: function(item) {
          return true;
      }
  });

  // Ordena las aristas dependiendo del modo (Maximizar o Minimizar)
  edges.sort((a, b) => {
      return modo === 'maximizar' ? b.label - a.label : a.label - b.label;
  });

  const parent = {};
  const rank = {};

  // Funciones para manejar el conjunto disjunto
  function find(data) {
      if (parent[data] !== data) {
          parent[data] = find(parent[data]);
      }
      return parent[data];
  }

  function union(data1, data2) {
      let root1 = find(data1);
      let root2 = find(data2);

      if (root1 !== root2) {
          if (rank[root1] > rank[root2]) {
              parent[root2] = root1;
          } else if (rank[root1] < rank[root2]) {
              parent[root1] = root2;
          } else {
              parent[root2] = root1;
              rank[root1] += 1;
          }
      }
  }

  // Inicializa el conjunto disjunto
  nodosDataSet.get().forEach(node => {
      parent[node.id] = node.id;
      rank[node.id] = 0;
  });

  const mst = [];
  edges.forEach(edge => {
      let root1 = find(edge.from);
      let root2 = find(edge.to);

      if (root1 !== root2) {
          mst.push(edge);
          union(root1, root2);
          // Marcar la arista en el grafo con color y grosor específicos
          aristasDataSet.update({
              id: edge.id,
              color: { color: modo === 'maximizar' ? 'green' : 'purple' },
              width: 3  // Grosor destacado para las aristas del MST
          });
      }
  });

  console.log("MST includes:", mst);
  return mst; // Retorna las aristas del árbol de expansión mínima
}

function actualizarResultadosKruskal(mst, modo) {
  // Calcular la suma total de las longitudes de las aristas del MST
  const totalLength = mst.reduce((acc, edge) => acc + parseFloat(edge.label), 0);
  const camino = mst.map(edge => edge.label).join(', ');

  // Determinar el mensaje basado en el modo
  const mensajeLongitud = modo === 'maximizar' ? 'La longitud máxima recorrida es: ' : 'La longitud mínima recorrida es: ';

  // Actualizar el contenido del elemento con id 'solucion' en el HTML
  const solucionContainer = document.getElementById('solucion');
  solucionContainer.innerHTML = `<strong>${mensajeLongitud}</strong>${totalLength.toFixed(2)}<br><strong>Camino:</strong> ${camino}`;
}

// Modificar los listeners de los botones para incluir la actualización de resultados
document.getElementById('minimizar').addEventListener('click', function() {
  const mst = kruskalMaxMin('minimizar');
  actualizarResultadosKruskal(mst, 'minimizar');
});

document.getElementById('maximizar').addEventListener('click', function() {
  const mst = kruskalMaxMin('maximizar');
  actualizarResultadosKruskal(mst, 'maximizar');
});

