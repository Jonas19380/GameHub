import { criarTexto, criarBotao, criarDivisor, criarInput, time, criarListaNaoOrdenada, criarListaOrdenada } from "./util.js";

//Iniciando variáveis.
const jogoDoBot = document.getElementById("jogoDoBot");
let nome = undefined;
let idade = undefined;
let pontos = 0;
let nivel = 0;
let pontosNecessarios = 1000;
let parteHistoria = 0;
let progresso = undefined;
let finais = [];

function carregarJogoAutomaticamente() {
  const save = localStorage.getItem("saveJogoBot");

  if (!save) {
    introducao();
    return;
  }

  const dados = JSON.parse(save);

  nome = dados.nome;
  idade = dados.idade;
  pontos = dados.pontos;
  pontosNecessarios = dados.pontosNecessarios;
  parteHistoria = dados.parteHistoria;
  progresso = dados.progresso;
  finais = dados.finais || [];

  jogoDoBot.appendChild(criarTexto("📂 Jogo carregado com sucesso."));

  decidirHistoria();
}

function pegarValor(valor) {
  return valor.value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

// decide o que executar
function decidirHistoria() {
  if (!parteHistoria) {
    introducao();
  } else {
    executarParteHistoria(parteHistoria);
  }
}

async function animacaoDeCarregamento() {
  const pSalvamento = criarTexto("Indo para a página de salvamentos");
  jogoDoBot.appendChild(pSalvamento);

  let pontosAnim = 0;

  // animação por alguns ciclos
  for (let i = 0; i < 8; i++) {
    pontosAnim = (pontosAnim % 3) + 1;

    pSalvamento.textContent =
      "Indo para a página de salvamentos" + ".".repeat(pontosAnim);

    await time(500);
  }

  // redirecionamento  window.location.href = "salvamento-bot.html";
}

async function irParaSalvamento() {
  if (!nome) {
    alert("Erro! Dados faltando.");
    return;
  }

  localStorage.setItem("saveJogoBot", JSON.stringify({
    nome,
    idade,
    pontos,
    parteHistoria,
    pontosNecessarios,
    progresso,
    finais
  }));

  await animacaoDeCarregamento();
}

carregarJogoAutomaticamente();

const btnSalvar = document.getElementById("btnSalvar");

btnSalvar.addEventListener("click", irParaSalvamento);

async function comandos() {
  // Título do modo comandos
  jogoDoBot.appendChild(
    criarTexto("--- Modo Comandos (Digite 'sair' para continuar) ---")
  );

  // Linha do input + botão
  const linhaComando = document.createElement("div");
  linhaComando.style.display = "flex"

  const input = criarInput();
  input.placeholder = "Digite um comando";

  const botaoEnviar = criarBotao("Executar");

  linhaComando.appendChild(input);
  linhaComando.appendChild(botaoEnviar);
  jogoDoBot.appendChild(linhaComando);

  // Enter envia o comando
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") executarComando();
  });
  botaoEnviar.addEventListener("click", executarComando);

  async  function executarComando() {
    const comando = input.value.trim().toLowerCase();
    input.value = "";

    if (!comando) return;

    // Mostra o comando digitado
    jogoDoBot.appendChild(
      criarTexto("> " + comando)
    );

    if (comando === "pontos") {
      await time(1000);      jogoDoBot.appendChild(criarTexto(
        `Você tem ${pontos} pontos.`
      ));

    } else if (comando === "identidade") {
      await time(1000);
      jogoDoBot.appendChild(criarTexto(
        `Nome: ${nome} | Idade: ${idade}`
      ));

    } else if (comando === "nivel") {
      await time(1000);
      jogoDoBot.appendChild(criarTexto(
        `Nível ${nivel} | Faltam ${pontosNecessarios - pontos} pontos para subir de nível`
      ));

    } else if (comando === "progresso") {
      await time(1000);
      jogoDoBot.appendChild(criarTexto(
        `Progresso: ${progresso}. Continue jogando para aumentar seu progresso.`
      ));

    } else if (comando === "finais") {
      await time(1000);
      jogoDoBot.appendChild(criarTexto(
        `Finais: ${finais.length ? finais.join(", ") : "Nenhum"}`
      ));

    } else if (comando === "sair") {
      await time(1000);
      jogoDoBot.appendChild(criarTexto(
        "💾 Saindo do modo comandos..."
      ));
      linhaComando.remove();
      historia();

    } else {
      jogoDoBot.appendChild(criarTexto(
        "❓ Comando desconhecido"
      ));
    }
  }
}

async function verificarNivel(maisPontos) {
  if (pontos >= pontosNecessarios) {
    pontosNecessarios += maisPontos
    nivel += 1
    jogoDoBot.appendChild(criarTexto("Você subiu de nível! 🎉🎉"));
  }
}

async function introducao() {
  jogoDoBot.appendChild(criarDivisor());
  jogoDoBot.appendChild(criarTexto("Olá! Eu sou o Bot!"));
  await time(1500);
  jogoDoBot.appendChild(criarTexto("Você é um humano?"));
  await time(1000)
  const humanoBotao = criarBotao("Sim");
  jogoDoBot.appendChild(humanoBotao)
  humanoBotao.addEventListener("click", async () => {
    humanoBotao.disabled = true;
    await time(500);
    jogoDoBot.appendChild(criarTexto("Legal! Posso saber mais sobre você?"));
    const saberMaisBotao = criarBotao("Sim");
    jogoDoBot.appendChild(saberMaisBotao);    saberMaisBotao.addEventListener("click", async () => {
      saberMaisBotao.disabled = true;
      await time(500);
      novoJogo();
      pontos += 100
      verificarNivel(500)
    });
  });
}

function executarParteHistoria(parte) {
  criarTexto("➡️ Continuando na parte " + parte);
  historia()
}

function nomeValido(nome) {
  return /^[A-Za-zÀ-ÿ\s]+$/.test(nome);
}

function idadeValida(idade) {
  return /^\d+$/.test(idade);
}

async function novoJogo() {
  jogoDoBot.appendChild(criarTexto("Qual o seu nome?"));
  await time(1000);
  const nomeInput = criarInput("Nome");
  const nomeBotao = criarBotao("Confirmar");
  jogoDoBot.appendChild(nomeInput)
  jogoDoBot.appendChild(nomeBotao)
  nomeBotao.addEventListener("click", async () => {
    const nomeValor = nomeInput.value.trim();
    const erroNome = criarTexto("Esse não é um nome válido.");
    if (!nomeValido(nomeValor)) {
      jogoDoBot.appendChild(erroNome);
      await time(1500);
      erroNome.remove();
      return;
    } else if (nomeValor === "") {
      jogoDoBot.appendChild(erroNome);
      await time(1500);
      erroNome.remove()
      return;
    } else {
      nome = nomeValor;
      nomeInput.readOnly = true;
      nomeBotao.disabled = true;
      await time(500)
      jogoDoBot.appendChild(criarTexto(`${nome} é um nome bonito.`));
    }
    jogoDoBot.appendChild(criarTexto("Deseja falar sua idade?"));
    await time(1000);
    const idadeBotaoSim = criarBotao("Sim");
    const idadeBotaoNao = criarBotao("Não");
    jogoDoBot.appendChild(idadeBotaoSim);
    jogoDoBot.appendChild(idadeBotaoNao)
    idadeBotaoSim.addEventListener("click", async () => {
      idadeBotaoSim.disabled = true
      idadeBotaoNao.disabled = true
      await time(500)
      jogoDoBot.appendChild(criarTexto("Qual a sua idade?"));
      await time(1000);
      const idadeInput = criarInput("Idade");
      const idadeBotao = criarBotao("Confirmar");
      jogoDoBot.appendChild(idadeInput);
      jogoDoBot.appendChild(idadeBotao);      idadeBotao.addEventListener("click", async () => {
        const idadeValor = idadeInput.value.trim();
        const erroIdade = criarTexto("Essa não é uma idade valida.");
        if (!idadeValida(idadeValor)) {
          jogoDoBot.appendChild(erroIdade);
          await time(1500);
          erroIdade.remove();
          return;
        } else if (idadeValor === "") {
          jogoDoBot.appendChild(erroIdade);
          await time(1500);
          erroIdade.remove();
          return;
        } else {
          idade = idadeValor;
          idadeInput.readOnly = true;
          idadeBotao.disabled = true;
          await time(500);
          jogoDoBot.appendChild(criarTexto(`Então vamos lá. Seu nome é ${nome} e você tem ${idade} anos.`));
          pontos += 500;
          verificarNivel(1000)
          parteHistoria = 1
          comandos();
        }
      });
    });
    idadeBotaoNao.addEventListener("click", async () => {
      idadeBotaoNao.disabled = true;
      idadeBotaoSim.disabled = true;
      jogoDoBot.appendChild(criarTexto("Então vamos continuar sem eu saber sua idade."));
      await time(2000);
      jogoDoBot.appendChild(criarTexto(`Vamos lá. Seu nome é ${nome} e você tem idade indefinida.`));
      pontos += 500;
      verificarNivel(1000)
      parteHistoria = 1
      comandos();
    });
  });
}

async function historia() {
  if (parteHistoria === 1) {
    jogoDoBot.appendChild(criarTexto(`${nome}, você quer fazer algumas aventuras comigo?`));
    const botaoAventuraSim = criarBotao("Sim");
    jogoDoBot.appendChild(botaoAventuraSim);
    botaoAventuraSim.addEventListener("click", async () => {
      botaoAventuraSim.disabled = true
      jogoDoBot.appendChild(criarTexto("Eba!!!"));
      await time(1500);
      jogoDoBot.appendChild(criarTexto(`${nome}, antes de começar, quero contar um pouco da minha história.`));
      await time(5000);
      jogoDoBot.appendChild(criarTexto("Eu era de uma cidade chamada..."));
      await time(2200);
      jogoDoBot.appendChild(criarTexto("Eu esqueci... 😥"));
      await time(1500);
      jogoDoBot.appendChild(criarTexto("Eu tinha uma vida feliz, até que..."));
      await time(2000);
      jogoDoBot.appendChild(criarTexto("Tudo mudou."));
      await time(1500);
      jogoDoBot.appendChild(criarTexto("Eles pareciam não ter mais vida..."));
      await time(2500);
      jogoDoBot.appendChild(criarTexto("Antes, eles eram alegres, mas..."));
      await time(2500);
      jogoDoBot.appendChild(criarTexto("Eu já percebera seus comportamentos."));
      await time(2200);
      jogoDoBot.appendChild(criarTexto("Após um tempo, começaram a me tratar mal; então decidi ir embora."));      await time(4700);
      jogoDoBot.appendChild(criarTexto("Fui andando pela escuridão."))
      await time(2000);
      jogoDoBot.appendChild(criarTexto("Após um tempo, encontrei algumas luzes..."));
      await time(3000);
      jogoDoBot.appendChild(criarTexto("Era uma vila!"));
      await time(1500);
      jogoDoBot.appendChild(criarTexto("No próximo dia, havia lhe encontrado;"));
      await time(3000);
      jogoDoBot.appendChild(criarTexto("Virei seu amigo e depois lhe conheci."));
      await time(2700);
      jogoDoBot.appendChild(criarTexto("Depois de tudo isso, resultou no que é hoje."));
      pontos += 1000
      parteHistoria = 2
      verificarNivel(2000)
      comandos()
    });
  }
  if (parteHistoria === 2) {
    jogoDoBot.appendChild(criarTexto("Qual aventura você quer fazer?"));
    await time(1600)
    const aventuraInput = criarInput("Coloque o nome da aventura");
    const aventuraBotao = criarBotao("Confirmar");
    jogoDoBot.appendChild(aventuraInput);
    jogoDoBot.appendChild(aventuraBotao);
    jogoDoBot.appendChild(criarTexto("Para uma lista de aventuras digite 'ajuda'"));
    aventuraBotao.addEventListener("click", async () => {
      aventuraBotao.disabled = true
      aventuraInput.readOnly = true
      const aventura = pegarValor(aventuraInput)
      if (aventura === "ajuda" && nivel < 5) {
        jogoDoBot.appendChild(criarListaNaoOrdenada([
          "Procurar a cidade do Bot;", "Passear;", "Fazer um acampamento na floresta."
        ]))
        await time(1200)
        aventuraBotao.disabled = false
        aventuraInput.readOnly = false
      } else if (aventura === "ajuda" && nivel >= 5 && nivel < 10) {
          jogoDoBot.appendChild(criarListaNaoOrdenada([
            "Procurar a cidade do Bot;",
            "Passear;",
            "Fazer um acampamento na floresta;",
            "Seguir um caminho desconhecido."
          ]))
          await time(1200)
          aventuraBotao.disabled = false
          aventuraInput.readOnly = false
      } else if (aventura === "ajuda" && nivel >= 10) {
          jogoDoBot.appendChild(criarListaNaoOrdenada([
            "Procurar a cidade do Bot;",
            "Passear;",
            "Fazer um acampamento na floresta;",
            "Seguir um caminho desconhecido;",
            "Aventura misteriosa."]))
          await time(1200)
          aventuraBotao.disabled = false
          aventuraInput.readOnly = false
      } else if (aventura === "procurar a cidade do bot") {
          if (nivel < 5) {
            const cidadeInput1= criarInput("Escolha por irá.")
            const cidadeBotao1 = criarBotao("Confirmar")
            jogoDoBot.appendChild(cidadeInput1)
            jogoDoBot.appendChild(cidadeBotao1)
            jogoDoBot.appendChild(["Ir na direção que ele veio;", "??? (nível 5)", "??? (nível 10)"]));
            cidadeBotao1.addEventListener("click", async () => {
              const cidade1 = pegarValor(cidadeInput1)              if (cidade1 === "ir na direcao que ele veio" {
                console.log("Pera aí!")
              }
              else if
            })
          } else if (nivel >= 5 && nivel < 10) {
            console.log("vou colocar depois")
          } else if (nivel >= 10) {
              console.log("as coisas")
          }
      } else {
          const erroAventura = criarTexto("❓️ Aventura desconhecida")
          jogoDoBot.appendChild(erroAventura)
          erroAventura.style.color = "red"
          await time(1200)
          erroAventura.remove()
          aventuraBotao.disabled = false
          aventuraInput.readOnly = false
      }
    });
  }
}


//Início do Jogo.
