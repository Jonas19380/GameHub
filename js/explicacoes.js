const btn = document.querySelector(".btn");
const menu = document.getElementById("menu");

// abrir menu
btn.addEventListener("click", (e) => {
  e.stopPropagation(); // impede fechar imediatamente
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
});

// fechar ao clicar fora
document.addEventListener("click", (e) => {
  if (!menu.contains(e.target) && e.target !== btn) {
    menu.style.display = "none";
  }
});
