
window.addEventListener("load", function () {

    sessionStorage.clear();
    localStorage.clear();

    configurarFormularioLogin();

    function configurarFormularioLogin() {
        const loginForm = document.getElementById("loginForm");
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const username = document.getElementById("input-user").value.trim();
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
            const response = await fetch("./js/keys.json");
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

    async function validarCredenciais(username, password) {
        const usuarios = await obterDadosPlanilha();
        const user = usuarios.find(u => u.user === username && u.password === password);

        if (user) {
            realizarLogin(user);
        } else {
            exibirAlerta("Usuário ou senha incorretos!");
        }
    }

    function processarCSV(csvText) {
        const linhas = csvText.split("\n").map(l => l.trim()).filter(l => l);
        const cabecalho = linhas[0].split(",").map(h => h.trim());

        return linhas.slice(1).map(linha => {
            const valores = linha.split(",").map(v => v.trim());
            let obj = {};
            cabecalho.forEach((chave, index) => {
                obj[chave] = valores[index] || "";
            });
            return obj;
        });
    }

    function exibirAlerta(mensagem) {
        const alert = document.getElementById("alert");
        alert.innerText = mensagem;
        alert.style.display = "block";
    }

    function realizarLogin(userData) {
        sessionStorage.setItem("logon", "1");
        sessionStorage.setItem("currentUser", userData.user);

        window.dispatchEvent(new Event("storage")); 

        sessionStorage.setItem("user_name", userData.nickname);
        
        atualizarInterface(userData);
    }

    function atualizarInterface(userData) {
        const sidebar = document.getElementById("sidebar");


        sidebar.querySelectorAll("button").forEach(botao => botao.remove());

        let primeiroModuloLiberado = null;


        Object.keys(userData).forEach(modulo => {
            if (modulo !== "user" && modulo !== "password" && userData[modulo].toLowerCase() === "liberado") {
                let botao = document.createElement("button");
                botao.textContent = modulo;
                botao.onclick = function () {
                    document.getElementById("iframe").src = `${modulo}.html`;
                    toggleMenu();
                };

            
                sidebar.appendChild(botao);
                
                if (!primeiroModuloLiberado) {
                    primeiroModuloLiberado = modulo;
                }
            }
        });

        if (primeiroModuloLiberado) {
            document.getElementById("iframe").src = `${primeiroModuloLiberado}.html`;
        }

        document.getElementById("container-login").classList.add("desapear");
        document.getElementById("logged-message").innerHTML = userData.nickname;

    }
});

function toggleMenu() {
    var sidebar = document.getElementById("sidebar");
    sidebar.style.left = (sidebar.style.left === "0px") ? "-250px" : "0px";
}

document.getElementById("menu-icon").addEventListener("click", toggleMenu);

function Exit() {
    sessionStorage.removeItem("logon");
    sessionStorage.removeItem("currentUser");

    document.getElementById("container-login").classList.remove("desapear");
    document.getElementById("iframe").src = "";
    document.getElementById("logged-message").innerHTML = "";
    window.location.reload();
}
