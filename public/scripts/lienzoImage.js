const lienzo = document.getElementById('lienzo');
let scale = 1;

lienzo.addEventListener('wheel', (event) => {
    event.preventDefault(); // Prevent default scroll behavior
    if (event.deltaY > 0) {
        // Zoom out
        scale -= 0.1;
    } else {
        // Zoom in
        scale += 0.1;
    }
    scale = Math.max(0.1, scale); // Prevent scaling to a non-positive value
    lienzo.style.backgroundSize = `${scale * 100}%`;
    
});

function changeImageHandler(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        lienzo.style.backgroundImage = `url(${e.target.result})`;
        lienzo.style.backgroundSize = 'cover'; 
    };
    reader.readAsDataURL(file);
}

const changeImage = document.getElementById('imagenFondo');
changeImage.addEventListener('change', changeImageHandler);