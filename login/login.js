window.addEventListener("DOMContentLoaded", function () {
  configurarFormularioLogin();
});

function configurarFormularioLogin() {
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const password = document.getElementById("password").value.trim();
    const usuario = document.getElementById("user").value;


    if (!password || !usuario) {
      exibirAlerta("A senha é obrigatória!");
      return;
    }


    await validarCredenciais(password, usuario);
  });
}

async function validarCredenciais(password, usuario) {
  const spinner = document.getElementById('loading');
  spinner.style.display = 'flex';

  try {
    const response = await fetch("https://barretoapps.com.br/login_barreto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        usuario: usuario,
        senha: password 
      })
    });

    const result = await response.json();
    console.log("Resposta do backend:", result);

    if (response.ok && result.success) {
      spinner.style.display = 'none';
      realizarLogin(result);
    } else {
      exibirAlerta(result.message || "Senha incorreta!");
      spinner.style.display = 'none';
    }
  } catch (err) {
    console.error("Erro no fetch:", err);
    exibirAlerta("Erro ao tentar logar.");
    spinner.style.display = 'none';
  }
}

function realizarLogin(userData) {
  

  let empresa = userData.empresa || "";
  if (empresa.startsWith('"') && empresa.endsWith('"')) {
    empresa = empresa.slice(1, -1);
  }

  document.getElementById('container-login').style.display = "none";
  sessionStorage.setItem("logon", "1");
  document.getElementById('tela').src = "dash.html";

}


function exibirAlerta(mensagem) {
  const alert = document.getElementById("alert");
  alert.innerText = mensagem;
  alert.style.display = "block";
}