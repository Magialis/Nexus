const header = document.querySelector(".header");
const botaoMenu = document.querySelector(".nav-toggle");
const menu = document.querySelector(".nav");
const links = document.querySelectorAll(".nav__link");
const paginas = document.querySelectorAll(".page");
const tituloDoSite = document.title;

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
    paginas.forEach((pagina) => pagina.classList.toggle("active", pagina === alvo));
    links.forEach((link) => {
        const ativo = link.hash === `#${alvo.id}`;
        link.classList.toggle("nav__link--active", ativo);
        if (ativo) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
        // A aba do navegador mostra em que página a pessoa está.
        if (ativo) document.title = alvo === paginas[0] ? tituloDoSite : `${link.textContent.trim()} | Nexus`;
    });
    window.scrollTo({ top: 0, behavior: "instant" });
}

// Troca de página feita pelo JS (links internos): atualiza o endereço sem o salto do navegador,
// e o botão "voltar" continua funcionando.
function irParaPagina(id) {
    mostrarPagina(id);
    if (location.hash !== `#${id}`) history.pushState(null, "", `#${id}`);
}
links.forEach((link) => link.addEventListener("click", () => alternarMenu(false)));
window.addEventListener("hashchange", () => mostrarPagina(location.hash.slice(1)));
mostrarPagina(location.hash.slice(1));

/* ---------- Altura do header ---------- */
// O header é fixo, então o conteúdo precisa começar abaixo dele.
// O ResizeObserver acompanha qualquer mudança de altura: resize, fonte carregando etc.
function atualizarAlturaHeader() {
    document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
}
atualizarAlturaHeader();
new ResizeObserver(atualizarAlturaHeader).observe(header);

/* ---------- Hero: indicador de rolagem ----------
   O botão com data-scroll-next rola até a seção seguinte ao hero.
   (Não usa link com #, porque o hash troca de página neste site.) */
document.querySelectorAll("[data-scroll-next]").forEach((botao) => {
    botao.addEventListener("click", () => {
        const destino = botao.closest(".hero")?.nextElementSibling;
        destino?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

/* ---------- Filtros genéricos ---------- */
document.querySelectorAll("[data-filter-group]").forEach((grupo) => {
    const nome = grupo.dataset.filterGroup;
    const alvo = document.querySelector(`[data-filter-target="${nome}"]`);
    const botoes = grupo.querySelectorAll("[data-filter]");
    if (!alvo || !botoes.length) return;
    const itens = alvo.querySelectorAll("[data-category]");
    function aplicarFiltro(filtro) {
        itens.forEach((item) => {
            item.hidden = filtro !== "all" && item.dataset.category !== filtro;
        });
        botoes.forEach((botao) => {
            const ativo = botao.dataset.filter === filtro;
            botao.classList.toggle("is-active", ativo);
            botao.setAttribute("aria-pressed", String(ativo));
        });
    }
    botoes.forEach((botao) => botao.addEventListener("click", () => aplicarFiltro(botao.dataset.filter)));
    const inicial = grupo.querySelector("[data-filter].is-active") || botoes[0];
    aplicarFiltro(inicial.dataset.filter);
});

/* ---------- Linha do tempo interativa do Arquivo Histórico ---------- */
(function () {
    const arquivo = document.querySelector("[data-arquivo-marco]")?.closest(".arquivo");
    if (!arquivo) return;
    const marcos = [...arquivo.querySelectorAll("[data-arquivo-marco]")];
    const painel = arquivo.querySelector(".arquivo__registro");
    if (!marcos.length || !painel) return;

    const registros = [
        {
            fonte: "BOLETIM CLIMÁTICO · ÚLTIMOS ALERTAS",
            manchete: "Crise climática atinge ponto crítico",
            chamada: "O planeta já não conseguia esconder os sinais. O que antes parecia distante passou a fazer parte do cotidiano.",
            narrativa: "Temperaturas extremas, eventos climáticos mais intensos e alertas sucessivos marcaram o início de uma crise que governos e comunidades já não podiam tratar como uma ameaça futura.",
            consequencia: "A emergência climática deixa de ser previsão e passa a orientar decisões de sobrevivência.",
            periodo: "Antes da grande submersão",
            imagem: "./assets/images/cartaz1.png"
        },
        {
            fonte: "OBSERVATÓRIO COSTEIRO · ALERTA DE MARÉ",
            manchete: "Nível do mar sobe e ameaça cidades",
            chamada: "Bairros costeiros desaparecem sob a água; milhares de famílias recebem ordens de evacuação.",
            narrativa: "A subida do nível do mar avançou sobre portos, estradas e centros urbanos. As barreiras de proteção já não davam conta, e a mudança deixou de ser apenas uma notícia distante: comunidades inteiras precisaram abandonar suas casas.",
            consequencia: "O deslocamento em massa começa, enquanto recursos e abrigos se tornam cada vez mais escassos.",
            periodo: "O avanço das águas",
            imagem: "./assets/images/cartaz2.png"
        },
        {
            fonte: "REDE INTERNACIONAL DE PESQUISA · COMUNICADO EXTRAORDINÁRIO",
            manchete: "Cientistas alertam: Uma grande onda se aproxima",
            chamada: "Sensores registram uma perturbação oceânica de escala sem precedentes. O tempo para reagir é curto.",
            narrativa: "Pesquisadores cruzaram dados de correntes, atividade sísmica e alterações no oceano. O aviso chegou em meio ao caos, e nem todas as regiões conseguiram receber ou compreender a dimensão do perigo a tempo.",
            consequencia: "Rotas de fuga são reorganizadas às pressas; a comunicação entre regiões começa a falhar.",
            periodo: "O último aviso",
            imagem: "./assets/images/cartaz3.png"
        },
        {
            fonte: "EDIÇÃO ESPECIAL · CENTRAL DE BUSCA E REENCONTRO",
            manchete: "Desaparecidos após a submersão: famílias buscam respostas",
            chamada: "Com regiões inteiras inacessíveis, listas de desaparecidos crescem e famílias aguardam notícias.",
            narrativa: "Depois da catástrofe, o silêncio passou a ser parte da tragédia. Comunicações interrompidas, arquivos perdidos e áreas tomadas pela água dificultaram o reencontro de parentes e a confirmação do destino de milhares de pessoas.",
            consequencia: "A busca por sobreviventes se transforma também em uma missão para preservar nomes, histórias e vínculos.",
            periodo: "Depois da catástrofe",
            imagem: "./assets/images/cartaz4.png"
        },
        {
            fonte: "REGISTRO COMUNITÁRIO · PRIMEIRAS CÚPULAS",
            manchete: "Sobreviventes constroem moradias no fundo do mar",
            chamada: "Entre estruturas improvisadas e novas tecnologias, começa a construção de um lugar para recomeçar.",
            narrativa: "Diante de um mundo transformado, os sobreviventes uniram conhecimento, materiais recuperados e tecnologias de suporte à vida para erguer abrigos submarinos. Aos poucos, as estruturas se tornaram bairros, serviços e instituições. A necessidade de resistir deu lugar à construção de uma comunidade.",
            consequencia: "Nasce a base de Atläntida: não apenas um refúgio, mas uma cidade mantida pelas pessoas que decidiram reconstruir juntas.",
            periodo: "O início de Atläntida",
            imagem: "./assets/images/cartaz5.png"
        }
    ];

    const campos = {
        numero: arquivo.querySelector("[data-arquivo-numero]"),
        fonte: arquivo.querySelector("[data-arquivo-fonte]"),
        manchete: arquivo.querySelector("[data-arquivo-manchete]"),
        chamada: arquivo.querySelector("[data-arquivo-chamada]"),
        narrativa: arquivo.querySelector("[data-arquivo-narrativa]"),
        consequencia: arquivo.querySelector("[data-arquivo-consequencia]"),
        periodo: arquivo.querySelector("[data-arquivo-periodo]"),
        imagem: arquivo.querySelector("[data-arquivo-imagem]")
    };

    function selecionarMarco(indice, moverFoco = false) {
        const registro = registros[indice];
        if (!registro) return;
        marcos.forEach((marco, i) => {
            const ativo = i === indice;
            marco.classList.toggle("is-active", ativo);
            marco.setAttribute("aria-selected", String(ativo));
            marco.tabIndex = ativo ? 0 : -1;
        });
        painel.setAttribute("aria-labelledby", marcos[indice].id);
        const pad = (n) => String(n).padStart(2, "0");
        campos.numero.textContent = `REGISTRO ${pad(indice + 1)} / ${pad(registros.length)}`;
        ["fonte", "manchete", "chamada", "narrativa", "consequencia", "periodo"].forEach((campo) => {
            campos[campo].textContent = registro[campo];
        });
        campos.imagem.src = registro.imagem;
        campos.imagem.alt = `Jornal recuperado do acervo: ${registro.manchete}`;
        painel.classList.remove("is-changing");
        void painel.offsetWidth;
        painel.classList.add("is-changing");
        if (moverFoco) marcos[indice].focus();
    }

    marcos.forEach((marco, indice) => {
        marco.addEventListener("click", () => selecionarMarco(indice));
        marco.addEventListener("keydown", (evento) => {
            let proximo = indice;
            if (evento.key === "ArrowRight" || evento.key === "ArrowDown") proximo = (indice + 1) % marcos.length;
            else if (evento.key === "ArrowLeft" || evento.key === "ArrowUp") proximo = (indice - 1 + marcos.length) % marcos.length;
            else if (evento.key === "Home") proximo = 0;
            else if (evento.key === "End") proximo = marcos.length - 1;
            else return;
            evento.preventDefault();
            selecionarMarco(proximo, true);
        });
    });
    selecionarMarco(0);
})();

/* ---------- Painel interativo da Fauna ----------
   Desktop: o item escolhido é copiado para o painel lateral.
   Tablet/mobile: o painel fica escondido (CSS) e o próprio item abre.
   Só uma espécie fica selecionada por vez; clicar de novo, no X ou em Esc fecha. */
(function () {
    const fauna = document.querySelector("[data-fauna]");
    if (!fauna) return;

    const itens = [...fauna.querySelectorAll("[data-fauna-item]")];
    const painel = fauna.querySelector("[data-fauna-painel]");
    const campo = (nome) => painel.querySelector(`[data-fauna-${nome}]`);
    const vazio = campo("vazio");
    const conteudo = campo("conteudo");
    const empilhado = window.matchMedia("(max-width: 1024px)");
    let itemAtual = null;

    const botaoDe = (item) => item.querySelector(".fauna__card");

    function selecionar(item) {
        itemAtual = item;
        itens.forEach((outro) => {
            const selecionado = outro === item;
            outro.classList.toggle("is-selected", selecionado);
            botaoDe(outro).setAttribute("aria-expanded", String(selecionado));
        });
        vazio.hidden = Boolean(item);
        conteudo.hidden = !item;
        if (item) preencherPainel(item);
    }

    function preencherPainel(item) {
        const nome = item.querySelector(".fauna__nome").textContent.trim();
        const imagem = campo("imagem");
        imagem.src = item.querySelector(".fauna__thumb img").src;
        imagem.alt = nome;
        campo("nome").textContent = nome;
        campo("tipo").textContent = item.querySelector(".fauna__tipo").textContent.trim();
        campo("texto").textContent = item.querySelector(".fauna__texto").textContent.trim();
        campo("fatos").innerHTML = item.querySelector(".fauna__fatos").innerHTML;

        // Reinicia a animação de entrada a cada troca de espécie.
        conteudo.classList.remove("is-entering");
        void conteudo.offsetWidth;
        conteudo.classList.add("is-entering");
    }

    function alternar(item) {
        if (item === itemAtual) return selecionar(null);
        selecionar(item);
        if (empilhado.matches) item.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    itens.forEach((item) => botaoDe(item).addEventListener("click", () => alternar(item)));

    campo("fechar").addEventListener("click", () => {
        const anterior = itemAtual;
        selecionar(null);
        anterior?.querySelector(".fauna__card").focus();
    });

    document.addEventListener("keydown", (evento) => {
        // offsetParent é null quando a Fauna está escondida (outra aba ou outra página).
        if (evento.key === "Escape" && itemAtual && fauna.offsetParent) selecionar(null);
    });

    // Em telas grandes a primeira espécie já vem aberta, para o painel não ficar vazio.
    // Em telas menores os cartões começam recolhidos, para não ocupar a página toda.
    function ajustarAoTamanho() {
        if (empilhado.matches) selecionar(null);
        else if (!itemAtual) selecionar(itens[0]);
    }
    empilhado.addEventListener("change", ajustarAoTamanho);
    ajustarAoTamanho();
})();

/* ---------- Mapa: marcadores e instituições ----------
   Clicar num marcador mostra só a instituição dele; clicar de novo (ou em Esc,
   ou no título da lista) volta a mostrar todas. */
(function () {
    const marcadores = [...document.querySelectorAll(".mundo__marcador")];
    const instituicoes = [...document.querySelectorAll(".mundo__instituicao")];
    const titulo = document.querySelector(".mundo__instituicoes-titulo");
    if (!marcadores.length || !instituicoes.length) return;

    const telaEmpilhada = window.matchMedia("(max-width: 1024px)");
    let marcadorAtual = null;

    function definirAberta(instituicao, aberta) {
        instituicao.classList.toggle("is-open", aberta);
        instituicao.querySelector(".mundo__instituicao-nome").setAttribute("aria-expanded", String(aberta));
    }

    // Só uma instituição aberta por vez.
    function alternar(instituicao) {
        const abrir = !instituicao.classList.contains("is-open");
        instituicoes.forEach((item) => definirAberta(item, item === instituicao && abrir));
    }

    function mostrarTodas() {
        marcadorAtual = null;
        instituicoes.forEach((item) => {
            item.hidden = false;
            definirAberta(item, false);
        });
    }

    function selecionarMarcador(marcador) {
        const instituicao = document.getElementById(marcador.id.replace("marcador-", ""));
        if (!instituicao) return;
        marcadorAtual = marcador;
        instituicoes.forEach((item) => {
            item.hidden = item !== instituicao;
            definirAberta(item, item === instituicao);
        });
        if (telaEmpilhada.matches) instituicao.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function alternarMarcador(marcador) {
        if (marcadorAtual === marcador) mostrarTodas();
        else selecionarMarcador(marcador);
    }

    // Os marcadores são <span> sobre a imagem: viram botões com Enter e Espaço.
    function tornarBotao(elemento, acao) {
        elemento.setAttribute("role", "button");
        elemento.tabIndex = 0;
        elemento.addEventListener("click", acao);
        elemento.addEventListener("keydown", (evento) => {
            if (evento.key !== "Enter" && evento.key !== " ") return;
            evento.preventDefault();
            acao();
        });
    }

    instituicoes.forEach((item) => {
        item.querySelector(".mundo__instituicao-nome").addEventListener("click", () => alternar(item));
    });

    marcadores.forEach((marcador) => {
        const nome = marcador.querySelector(".mundo__marcador-texto")?.textContent ?? "";
        marcador.setAttribute("aria-label", `Ver instituição: ${nome}`);
        tornarBotao(marcador, () => alternarMarcador(marcador));
    });

    titulo?.addEventListener("click", mostrarTodas);
    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") mostrarTodas();
    });

    // "Ver no mapa" (em Habitantes): vai ao mapa já com a instituição escolhida.
    document.querySelectorAll("[data-map-target]").forEach((link) => {
        link.addEventListener("click", (evento) => {
            evento.preventDefault();
            const marcador = document.getElementById(`marcador-${link.dataset.mapTarget}`);
            if (!marcador) return;
            irParaPagina("mundo");
            requestAnimationFrame(() => {
                selecionarMarcador(marcador);
                document.querySelector(".mundo__mapa").scrollIntoView({ behavior: "smooth", block: "start" });
            });
        });
    });
})();

/* ---------- Habitantes: "Conheça quem faz parte deste lugar" (vem do mapa) ---------- */
document.querySelectorAll("[data-person-target]").forEach((link) => {
    link.addEventListener("click", (evento) => {
        evento.preventDefault();
        irParaPagina("habitantes");
        // Se algum filtro estiver ativo, ele poderia esconder a pessoa procurada.
        document.querySelector('[data-filter-group="habitantes"] [data-filter="all"]')?.click();
        requestAnimationFrame(() => {
            const pessoa = document.getElementById(`morador-${link.dataset.personTarget}`);
            if (!pessoa) return;
            pessoa.scrollIntoView({ behavior: "smooth", block: "center" });
            pessoa.classList.add("habitante--destacado");
            window.setTimeout(() => pessoa.classList.remove("habitante--destacado"), 1800);
        });
    });
});

/* ---------- Formulário: validação e confirmação ---------- */
(function () {
    const formulario = document.querySelector("[data-form]");
    if (!formulario) return;
    const obrigatorios = formulario.querySelectorAll("[required]");
    const confirmacao = formulario.querySelector(".form__success");
    const mensagens = {
        name: "Informe seu nome.",
        dome: "Selecione sua cúpula de origem.",
        subject: "Informe o assunto da mensagem.",
        message: "Escreva sua mensagem."
    };
    function validarCampo(campo) {
        const grupo = campo.closest(".field");
        const erro = grupo.querySelector(".field__error");
        const invalido = campo.value.trim() === "";
        grupo.classList.toggle("field--invalid", invalido);
        campo.setAttribute("aria-invalid", String(invalido));
        erro.textContent = invalido ? (mensagens[campo.name] || "Preencha este campo.") : "";
        erro.hidden = !invalido;
        return !invalido;
    }
    obrigatorios.forEach((campo) => {
        campo.addEventListener("blur", () => validarCampo(campo));
        campo.addEventListener("input", () => {
            if (campo.closest(".field").classList.contains("field--invalid")) validarCampo(campo);
        });
    });
    formulario.addEventListener("input", () => { confirmacao.hidden = true; });
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        confirmacao.hidden = true;
        let primeiroInvalido = null;
        obrigatorios.forEach((campo) => {
            if (!validarCampo(campo) && !primeiroInvalido) primeiroInvalido = campo;
        });
        if (primeiroInvalido) { primeiroInvalido.focus(); return; }
        formulario.reset();
        confirmacao.hidden = false;
    });
})();

/* ---------- Habitantes: história abre sobre os cards e só uma fica aberta ---------- */
(() => {
    const historias = document.querySelectorAll(".habitante__historia");
    const fecharOutras = (atual) => historias.forEach((d) => { if (d !== atual) d.open = false; });
    historias.forEach((d) => d.addEventListener("toggle", () => { if (d.open) fecharOutras(d); }));
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".habitante__historia")) fecharOutras(null);
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") fecharOutras(null);
    });
})();