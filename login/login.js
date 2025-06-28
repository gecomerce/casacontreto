window.addEventListener("load", function () {

  function mostrarTela() {
    const loginContainer = document.getElementById("container-login");
    if (loginContainer) loginContainer.style.display = "none";

    const telaContainer = document.querySelector(".screen-logged");
    if (telaContainer) telaContainer.style.display = "flex";

    const iframe = document.getElementById("tela");
    if (iframe) iframe.src = "dash.html";
  }


  if (this.sessionStorage.getItem("logon") === "1") {
    mostrarTela();
    return;
  }

  configurarFormularioLogin();

  function configurarFormularioLogin() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const username = document.getElementById("username").value.trim().toLowerCase();
      const password = document.getElementById("password").value.trim();

      if (!username || !password) {
        exibirAlerta("Usuário e senha são obrigatórios!");
        return;
      }

      await validarCredenciais(username, password);
    });
  }

  async function obterDadosPlanilha() {
    try {
      const response = await fetch("keys.json");
      if (!response.ok) throw new Error("Erro ao carregar arquivo keys.json");

      const data = await response.json();
      if (!data.length || !data[0].base) throw new Error("Formato inválido do JSON.");

      const planilhaURL = data[0].base;

      const planilhaResponse = await fetch(planilhaURL);
      if (!planilhaResponse.ok) throw new Error("Erro ao carregar a planilha.");

      const csvText = await planilhaResponse.text();

      return processarCSV(csvText);
    } catch (error) {
      console.error("Erro:", error);
      exibirAlerta("Erro ao carregar dados.");
      return [];
    }
  }

  function processarCSV(csvText) {
    const linhas = csvText.trim().split(/\r?\n/).filter(l => l);
    const cabecalho = linhas[0].split(",").map(h => h.trim().toLowerCase());

    return linhas.slice(1).map(linha => {
      const valores = linha.split(",").map(v => v.trim());
      let obj = {};
      cabecalho.forEach((chave, index) => {
        obj[chave] = valores[index] || "";
      });
      return obj;
    });
  }

  async function validarCredenciais(username, password) {
    const usuarios = await obterDadosPlanilha();

    const user = usuarios.find(u =>
      u.user?.toLowerCase() === username &&
      u.password === password 
    );

    if (!user) {
      exibirAlerta("Usuário ou senha inválidos.");
      return;
    }

    if ((user.status || "").toLowerCase() !== "liberado") {
      exibirAlerta("Usuário bloqueado.");
      return;
    }

    realizarLogin(user);
  }

  function realizarLogin(userData) {
    sessionStorage.setItem("logon", "1");
    sessionStorage.setItem("currentUser", userData.user);
    sessionStorage.setItem("user_name", userData.nickname || userData.user);

    mostrarTela();

    window.dispatchEvent(new Event("storage"));
  }

  function exibirAlerta(mensagem) {
    const alert = document.getElementById("alert");
    if (!alert) return;

    alert.innerText = mensagem;
    alert.style.display = "block";

    setTimeout(() => {
      alert.style.display = "none";
    }, 4000);
  }

});
