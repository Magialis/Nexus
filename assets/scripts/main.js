const header = document.querySelector(".header");
const botaoMenu = document.querySelector(".nav-toggle");
const menu = document.querySelector(".nav");
const links = document.querySelectorAll(".nav__link");
const paginas = document.querySelectorAll(".page");

/* ---------- Menu do celular ---------- */

function alternarMenu(abrir) {
    const aberto = menu.classList.toggle("nav--open", abrir);

    botaoMenu.setAttribute("aria-expanded", aberto);
    botaoMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
}

botaoMenu.addEventListener("click", () => alternarMenu());

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") alternarMenu(false);
});

/* ---------- Troca de páginas ---------- */

function mostrarPagina(id) {
    const alvo = [...paginas].find((pagina) => pagina.id === id) || paginas[0];

    paginas.forEach((pagina) => {
        pagina.classList.toggle("active", pagina === alvo);
    });

    links.forEach((link) => {
        const ativo = link.hash === `#${alvo.id}`;

        link.classList.toggle("nav__link--active", ativo);

        if (ativo) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    window.scrollTo({ top: 0, behavior: "instant" });
}

links.forEach((link) => {
    link.addEventListener("click", () => alternarMenu(false));
});

window.addEventListener("hashchange", () => {
    mostrarPagina(location.hash.slice(1));
});

mostrarPagina(location.hash.slice(1));

/* ---------- Altura do header ---------- */

// o header é fixo, então o conteúdo precisa começar abaixo dele
function atualizarAlturaHeader() {
    document.documentElement.style.setProperty(
        "--header-height",
        `${header.offsetHeight}px`
    );
}

atualizarAlturaHeader();
window.addEventListener("resize", atualizarAlturaHeader);
window.addEventListener("load", atualizarAlturaHeader);