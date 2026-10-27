// tema.js - Aplica a cor salva no navegador
const temaSalvo = localStorage.getItem("agromapTema");

if (temaSalvo === "dark") {
    document.body.classList.add("dark-theme");
}