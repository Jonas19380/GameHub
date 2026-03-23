import { criarTexto, criarBotao, time } from "./util.js";

// ===== Utilidades de save =====
function salvarJogo(slot, dados) {
  localStorage.setItem(`bot_slot_${slot}`, JSON.stringify(dados));
}

function carregarJogo(slot) {
  var dados = localStorage.getItem(`bot_slot_${slot}`);
  if (!dados) return null;
  return JSON.parse(dados);
}

function carregar(slot) {
  var dados = carregarJogo(slot);

  if (!dados) {
    criarTexto("❌ Nenhum salvamento encontrado.");
    return;
  }

  // salva TEMPORARIAMENTE para a outra página
  localStorage.setItem("saveJogoBot", JSON.stringify(dados));

  criarTexto("📂 Carregando jogo...");

  // redireciona para o jogo
  window.location.href = "jogo-bot.html";
}


// ===== Jogo atual =====
const saveJogoBot = JSON.parse(localStorage.getItem("saveJogoBot")) || {};

// ===== Salvar =====
function salvarComNome(slot) {
  if (!saveJogoBot.nome) {
    alert("Nenhum jogo para salvar!");
    return;
  }

  let nomeSlot = prompt("Nome do salvamento:");
  if (!nomeSlot) nomeSlot = "Sem nome";

  saveJogoBot.nomeSlot = nomeSlot;
  saveJogoBot.data = new Date().toLocaleString("pt-BR");

  salvarJogo(slot, saveJogoBot);
  alert("Jogo salvo!");
}

// ===== Botões =====
document.getElementById("salvar1").addEventListener("click", () => salvarComNome(1));
document.getElementById("salvar2").addEventListener("click", () => salvarComNome(2));
document.getElementById("salvar3").addEventListener("click", () => salvarComNome(3));

document.getElementById("carregar1").addEventListener("click", () => carregarESeguir(1));
document.getElementById("carregar2").addEventListener("click", () => carregarESeguir(2));
document.getElementById("carregar3").addEventListener("click", () => carregarESeguir(3));

function carregarESeguir(slot) {
  const save = carregarJogo(slot);
  if (!save) {
    alert("Slot vazio!");
    return;
  }
  localStorage.setItem("saveJogoBot", JSON.stringify(save));
  window.location.href = "jogo-bot.html";
}

// ===== Apagar =====
async function apagarSlot(slot) {
  const slots = document.getElementById(`slot${slot}`)
  const botaoConfirmar = criarBotao("Confirmar");
  const botaoCancelar = criarBotao("Cancelar");
  slots.appendChild(botaoConfirmar)
  botaoConfirmar.id = "btnConfirmar"
  botaoCancelar.id = "btnCancelar"
  slots.appendChild(botaoCancelar)
  botaoConfirmar.addEventListener("click", async () => {
    botaoConfirmar.remove()
    botaoCancelar.remove()
    localStorage.removeItem(`bot_slot_${slot}`)
    const excluido = criarTexto("Salvamento excluído.")
    slots.appendChild(excluido)
    await time(1500)
    excluido.remove()
  });
  botaoCancelar.addEventListener("click", async () => {
    botaoConfirmar.remove()
    botaoCancelar.remove()
    const cancelado = criarTexto("Cancelado.")
    slots.appendChild(cancelado)
    await time(1500)
    cancelado.remove()
  });
}

document.getElementById("btnApagar1").addEventListener("click", () => apagarSlot(1));
document.getElementById("btnApagar2").addEventListener("click", () => apagarSlot(2));
document.getElementById("btnApagar3").addEventListener("click", () => apagarSlot(3));
