function toggleMenu() {
    var menu = document.getElementById("menu");
    if (menu.style.right === "" || menu.style.right === "-270px") {
        menu.style.right = "0";
    } else {
        menu.style.right = "-270px";
    }
}
