// Esconde o painel até o servidor confirmar que existe uma sessão ativa.
document.documentElement.style.visibility = "hidden";
 
function liberarPagina() {
    document.documentElement.style.visibility = "";
}
 
function irParaLogin() {
    window.location.replace("login.html");
}
 
// Se o usuário voltar pelo botão "voltar" do navegador após sair, recarrega e revalida.
window.addEventListener("pageshow", (evento) => {
    if (evento.persisted) window.location.reload();
});
 
 
const $ = (id) => document.getElementById(id);
 
function preencher(id, valor, padrao = "—") {
    const campo = $(id);
 
    if (campo) {
        campo.textContent =
            valor !== null && valor !== undefined && String(valor).trim() !== ""
                ? String(valor)
                : padrao;
    }
}
 
function hectares(valor) {
    if (valor === null || valor === undefined || valor === "") {
        return "Não informado";
    }
 
    const numero = Number(valor);
 
    if (!Number.isFinite(numero)) {
        return "Não informado";
    }
 
    return numero.toLocaleString("pt-BR", {
        maximumFractionDigits: 2
    }) + " ha";
}
 
function mostrarErro(texto) {
    const campo = $("mensagemErro");
    if (campo) campo.textContent = texto;
}
 
async function carregarPainel() {
    try {
        mostrarErro("");
 
        const resposta = await fetch("api.php?acao=perfil", {
            credentials: "same-origin",
            cache: "no-store"
        });
 
        let resultado = null;
 
        try {
            resultado = JSON.parse(await resposta.text());
        } catch (e) {
            // Resposta que não é JSON: o PHP não está respondendo, então não há sessão válida.
            irParaLogin();
            return;
        }
 
        if (resposta.status === 401 || !resultado || resultado.sucesso !== true) {
            if (resposta.status >= 500) {
                liberarPagina();
                throw new Error(resultado?.mensagem || "Erro no servidor.");
            }
            irParaLogin();
            return;
        }
 
        liberarPagina();
 
        const usuario = resultado.usuario;
        const propriedade = resultado.propriedade;
 
        preencher("nomeUsuario", usuario.nome, "Produtor");
        preencher("emailUsuario", usuario.email, "Produtor rural");
 
 
        if (!propriedade) {
            preencher("propriedadeUsuario", "Minha propriedade");
            preencher("areaTotal", "Não informado");
            preencher("areaPlantada", "Não informado");
            preencher("culturaPrincipal", "Não informada");
            preencher("localizacaoUsuario", "Não informada");
            preencher("estadoUsuario", "Cadastre os dados da propriedade");
            preencher(
                "detalhesPropriedade",
                "Ainda não há uma propriedade cadastrada nesta conta."
            );
            return;
        }
 
        preencher(
            "propriedadeUsuario",
            propriedade.nome,
            "Minha propriedade"
        );
 
        preencher("areaTotal", hectares(propriedade.area_total));
        preencher("areaPlantada", hectares(propriedade.hectares_plantados));
        preencher(
            "culturaPrincipal",
            propriedade.cultura_principal,
            "Não informada"
        );
 
        preencher("localizacaoUsuario", propriedade.cidade, "Não informada");
        preencher("estadoUsuario", propriedade.estado, "Estado não informado");
 
        const detalhes = [
            propriedade.endereco,
            [propriedade.cidade, propriedade.estado].filter(Boolean).join(" - "),
            propriedade.cultura_principal
                ? "Cultura principal: " + propriedade.cultura_principal
                : "",
            propriedade.outras_culturas
                ? "Outras culturas: " + propriedade.outras_culturas
                : "",
            propriedade.epoca_plantio
                ? "Época de plantio: " + propriedade.epoca_plantio
                : "",
            propriedade.irrigacao
                ? "Irrigação: " + propriedade.irrigacao
                : "",
            propriedade.observacoes
        ].filter(Boolean);
 
        preencher(
            "detalhesPropriedade",
            detalhes.join(" • "),
            "Nenhum detalhe adicional cadastrado."
        );
 
    } catch (erro) {
        if (erro instanceof TypeError) {
            irParaLogin();
            return;
        }
 
        liberarPagina();
        console.error("Erro ao carregar o painel:", erro);
        mostrarErro(
            "Não foi possível carregar os dados. Confira o servidor PHP e o banco MySQL e tente novamente."
        );
    }
}
 
$("logout")?.addEventListener("click", async () => {
    const botao = $("logout");
    botao.disabled = true;
 
    try {
        await fetch("api.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ acao: "logout" })
        });
 
        window.location.replace("login.html");
    } catch (erro) {
        console.error("Erro ao sair:", erro);
        mostrarErro("Não foi possível sair da conta. Tente novamente.");
        botao.disabled = false;
    }
});
 
document.querySelectorAll(".menu[data-section]").forEach((botao) => {
    botao.addEventListener("click", () => {
        const secao = $(botao.dataset.section);
 
        if (!secao) return;
 
        document.querySelectorAll(".menu").forEach((item) => {
            item.classList.remove("active");
        });
 
        botao.classList.add("active");
        secao.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});
 
carregarPainel();