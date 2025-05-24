function toggleHerramientas() {
    var herramientas = document.getElementById("menu");
    if (herramientas.style.left === "" || herramientas.style.left === "-270px") {
        herramientas.style.left = "0";
    } else {
        herramientas.style.left = "-270px";
    }
}
function mostrarHerramientas(nodeId) {
    var herramientas = document.getElementById("menu");
    herramientas.style.left = "0";

    // Cambiar nombre del nodo
    document.getElementById("nombreNodo").addEventListener("change", function() {
        var nuevoNombre = this.value;
        nodosDataSet.update({ id: nodeId, label: nuevoNombre }); // Actualizar solo el nodo seleccionado
    });

    // Cambiar color del nodo
    document.getElementById("colorSelectorNode").addEventListener("change", function() {
        var color = this.value;
        nodosDataSet.update({ id: nodeId, color: { background: color } }); // Actualizar solo el nodo seleccionado
    });
}

// Agregar event listener al lienzo para ocultar las herramientas al hacer clic en otra parte
document.addEventListener('click', function(event) {
    var herramientas = document.getElementById("menu");
    var lienzo = document.getElementById('lienzo');
    // Verificar si las herramientas están visibles y si el clic no ocurrió dentro del lienzo ni en las herramientas
    if (herramientas.style.left === "0px" && !lienzo.contains(event.target) && event.target !== herramientas) {
        herramientas.style.left = "-270px"; // Ocultar las herramientas
    }
});



