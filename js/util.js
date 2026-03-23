//Funções utilitárias.

export function criarTexto(texto) {
  const p = document.createElement("p");
  p.textContent = texto;
  return p;
}

export function criarBotao(texto) {
  const botao = document.createElement("button");
  botao.textContent = texto;
  return botao;
}

export function time(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function criarInput(placeholder) {
  const input = document.createElement("input");
  input.placeholder = placeholder;
  return input;
}

export function criarDivisor() {
  return document.createElement("hr");
}

export function criarListaNaoOrdenada(itens) {
  const ul = document.createElement("ul")

  for (let item of itens) {
    const li = document.createElement("li")
    li.textContent = item
    ul.appendChild(li)
  }

  return ul
}

export function criarListaOrdenada(itens) {
  const ol = document.createElement("ol")

  for (let item of itens) {
    const li = document.createElement("li")
    li.textContent = item
    ol.appendChild(li)
  }

  return ol
}
