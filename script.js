/**
 * PROJETO: Boas Práticas Escolares, Diversidade e Inclusão Social
 * SCRIPT: Controle de interações dinâmicas e acessibilidade ativa.
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. CONTROLE DO MODO ESCURO (DARK MODE) ---
    const alternadorTema = document.getElementById("alternador-tema");
    const iconeTema = alternadorTema.querySelector("i");
    
    // Verifica preferência anterior salva pelo usuário
    const temaSalvo = localStorage.getItem("tema") || "light";
    document.documentElement.setAttribute("data-tema", temaSalvo);
    atualizarIconeTema(temaSalvo);

    alternadorTema.addEventListener("click", () => {
        const temaAtual = document.documentElement.getAttribute("data-tema");
        const novoTema = temaAtual === "light" ? "dark" : "light";
        
        document.documentElement.setAttribute("data-tema", novoTema);
        localStorage.setItem("tema", novoTema);
        atualizarIconeTema(novoTema);
    });

    function atualizarIconeTema(tema) {
        if (tema === "dark") {
            iconeTema.className = "ph ph-sun";
            alternadorTema.setAttribute("aria-label", "Alternar para Modo Claro");
        } else {
            iconeTema.className = "ph ph-moon";
            alternadorTema.setAttribute("aria-label", "Alternar para Modo Escuro");
        }
    }

    // --- 2. MENU HAMBÚRGUER RESPONSIVO ---
    const btnHamburguer = document.querySelector(".menu-hamburguer");
    const listaNav = document.getElementById("links-navegacao");

    btnHamburguer.addEventListener("click", () => {
        const expandido = btnHamburguer.getAttribute("aria-expanded") === "true";
        btnHamburguer.setAttribute("aria-expanded", !expandido);
        listaNav.classList.toggle("ativo");
    });

    // Fecha o menu mobile ao clicar em um dos links
    listaNav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            listaNav.classList.remove("ativo");
            btnHamburguer.setAttribute("aria-expanded", "false");
        });
    });

    // --- 3. BOTÃO VOLTAR AO TOPO ---
    const btnTopo = document.getElementById("btn-topo");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            btnTopo.classList.add("visivel");
        } else {
            btnTopo.classList.remove("visivel");
        }
    });
    btnTopo.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // --- 4. ANIMAÇÕES SUAVES AO ROLAR A PÁGINA (SCROLL OBSERVER) ---
    const elementosParaAnimar = document.querySelectorAll(".animate-scroll");
    const observadorScroll = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("animado");
                // Desobserva para executar a animação apenas uma única vez
                observadorScroll.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.15 });

    elementosParaAnimar.forEach(el => observadorScroll.observe(el));

    // --- 5. CONTADORES NUMÉRICOS ANIMADOS ---
    const contadores = document.querySelectorAll(".numero-contador");
    const secaoEstatisticas = document.querySelector(".secao-estatisticas");
    let contagemExecutada = false;

    const observadorEstatisticas = new IntersectionObserver((entradas) => {
        const [entrada] = entradas;
        if (entrada.isIntersecting && !contagemExecutada) {
            contadores.forEach(contador => {
                const alvo = parseInt(contador.getAttribute("data-alvo"), 10);
                let atual = 0;
                const incremento = alvo / 50; // Ajusta a velocidade do efeito incremental
                
                const atualizarNumero = () => {
                    atual += incremento;
                    if (atual < alvo) {
                        contador.innerText = Math.ceil(atual) + (contador.innerText.includes("%") ? "%" : "");
                        setTimeout(atualizarNumero, 30);
                    } else {
                        contador.innerText = alvo + "%";
                    }
                };
                atualizarNumero();
            });
            contagemExecutada = true;
        }
    }, { threshold: 0.3 });

    if (secaoEstatisticas) observadorEstatisticas.observe(secaoEstatisticas);

    // --- 6. BANCO DE DADOS E LÓGICA DO QUIZ INTERATIVO ---
    const perguntasQuiz = [
        {
            pergunta: "Qual das seguintes atitudes melhor define uma postura de Empatia no ambiente escolar?",
            opcoes: [
                "Ignorar conflitos alheios para focar exclusivamente nos próprios estudos.",
                "Ouvir atentamente o colega que passa por dificuldades, validando seus sentimentos.",
                "Discutir em tom ríspido sempre que houver divergência de opiniões em trabalhos."
            ],
            correta: 1
        },
        {
            pergunta: "Como a acessibilidade física e digital beneficia a comunidade acadêmica como um todo?",
            opcoes: [
                "Garante que apenas alunos com laudos específicos frequentem as aulas comuns.",
                "Reduz o ritmo acadêmico geral das turmas regulares de ensino.",
                "Assegura autonomia, igualdade de oportunidades e convívio democrático a todos."
            ],
            correta: 2
        },
        {
            pergunta: "Diante de um caso flagrante de Cyberbullying envolvendo colegas, qual a conduta ideal?",
            opcoes: [
                "Interromper o compartilhamento e reportar a situação imediatamente à gestão escolar.",
                "Apenas excluir a mensagem do próprio aparelho e manter o silêncio protetor.",
                "Repassar o conteúdo adiante para que mais pessoas tomem conhecimento da ofensa."
            ],
            correta: 0
        },
        {
            pergunta: "O que representa o conceito pedagógico de Desenho Universal de Aprendizagem?",
            opcoes: [
                "Criar exames idênticos e inflexíveis para testar todos de forma idêntica.",
                "Estruturar o ensino com múltiplas formas de engajamento, representação e expressão.",
                "Separar os alunos por faixas de rendimento socioemocional em blocos isolados."
            ],
            correta: 1
        },
        {
            pergunta: "Qual o papel do Grêmio Estudantil na consolidação de uma escola plural?",
            opcoes: [
                "Promover canais abertos de escuta para propor soluções coletivas à direção.",
                "Definir punições administrativas severas para os alunos faltosos.",
                "Organizar eventos exclusivamente voltados aos estudantes de melhor rendimento."
            ],
            correta: 0
        }
    ];

    let indicePerguntaAtual = 0;
    let pontuacaoFinal = 0;

    const containerPergunta = document.getElementById("container-pergunta-quiz");
    const btnProximo = document.getElementById("btn-proximo-quiz");
    const elementoProgresso = document.getElementById("progresso-quiz");
    const elementoResultado = document.getElementById("resultado-quiz");

    function carregarPergunta() {
        btnProximo.disabled = true;
        const dadosPergunta = perguntasQuiz[indicePerguntaAtual];
        
        elementoProgresso.innerText = `Pergunta ${indicePerguntaAtual + 1} de ${perguntasQuiz.length}`;
        
        let htmlOpcoes = dadosPergunta.opcoes.map((opcao, i) => `
            <label class="opcao-wrapper" for="opt-${i}">
                <input type="radio" name="resposta-quiz" id="opt-${i}" value="${i}">
                <span>${opcao}</span>
            </label>
        `).join("");

        containerPergunta.innerHTML = `
            <h3 class="enunciado-quiz">${dadosPergunta.pergunta}</h3>
            <div class="opcoes-quiz">${htmlOpcoes}</div>
        `;

        // Vincula evento para ativar o botão de avanço após selecionar uma alternativa
        const inputsRadio = containerPergunta.querySelectorAll('input[name="resposta-quiz"]');
        inputsRadio.forEach(input => {
            input.addEventListener("change", (e) => {
                containerPergunta.querySelectorAll(".opcao-wrapper").forEach(el => el.classList.remove("selecionada"));
                e.target.closest(".opcao-wrapper").classList.add("selecionada");
                btnProximo.disabled = false;
                btnProximo.innerText = indicePerguntaAtual === perguntasQuiz.length - 1 ? "Finalizar Quiz" : "Responder";
            });
        });
    }

    btnProximo.addEventListener("click", () => {
        const opcaoSelecionada = containerPergunta.querySelector('input[name="resposta-quiz"]:checked');
        if (!opcaoSelecionada) return;

        const respostaDoUsuario = parseInt(opcaoSelecionada.value, 10);
        if (respostaDoUsuario === perguntasQuiz[indicePerguntaAtual].correta) {
            pontuacaoFinal++;
        }

        indicePerguntaAtual++;

        if (indicePerguntaAtual < perguntasQuiz.length) {
            carregarPergunta();
        } else {
            exibirResultadoQuiz();
        }
    });

    function exibirResultadoQuiz() {
        containerPergunta.classList.add("oculto");
        btnProximo.classList.add("oculto");
        elementoProgresso.classList.add("oculto");
        
        let mensagemFeedback = "";
        if (pontuacaoFinal === perguntasQuiz.length) {
            mensagemFeedback = "Excelente! Você possui uma visão exemplar sobre alteridade, inclusão social e cidadania ativa.";
        } else if (pontuacaoFinal >= 3) {
            mensagemFeedback = "Bom resultado! Você compreende as bases da convivência inclusiva, mas vale revisar alguns conceitos para evitar vieses.";
        } else {
            mensagemFeedback = "Oportunidade de aprendizado! Navegue mais pelos nossos pilares informativos para fortalecer seus conceitos de inclusão.";
        }

        elementoResultado.innerHTML = `
            <h3>Quiz Concluído!</h3>
            <p style="font-size: 1.4rem; font-weight: bold; margin: 12px 0;">Sua Nota: ${pontuacaoFinal} / ${perguntasQuiz.length}</p>
            <p style="color: var(--cor-texto-suave);">${mensagemFeedback}</p>
            <button id="btn-reiniciar-quiz" class="btn btn-secundario" style="margin-top: 24px;">Refazer Desafio</button>
        `;
        elementoResultado.classList.remove("oculto");

        document.getElementById("btn-reiniciar-quiz").addEventListener("click", () => {
            indicePerguntaAtual = 0;
            pontuacaoFinal = 0;
            elementoResultado.classList.add("oculto");
            containerPergunta.classList.remove("oculto");
            btnProximo.classList.remove("oculto");
            elementoProgresso.classList.remove("oculto");
            carregarPergunta();
        });
    }

    // Inicializa o Quiz pela primeira vez
    if (containerPergunta) carregarPergunta();

    // --- 7. VALIDAÇÃO ROBUSTA DO FORMULÁRIO DE CONTATO ---
    const formulario = document.getElementById("form-contato");
    const sucessoForm = document.getElementById("sucesso-form");

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        let formularioValido = true;

        // Validação do campo Nome
        const campoNome = document.getElementById("campo-nome");
        if (campoNome.value.trim().length < 3) {
            marcarCampoErro(campoNome, true);
            formularioValido = false;
        } else {
            marcarCampoErro(campoNome, false);
        }

        // Validação do campo E-mail via Expressão Regular (Regex)
        const campoEmail = document.getElementById("campo-email");
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(campoEmail.value.trim())) {
            marcarCampoErro(campoEmail, true);
            formularioValido = false;
        } else {
            marcarCampoErro(campoEmail, false);
        }

        // Validação do campo Mensagem
        const campoMensagem = document.getElementById("campo-mensagem");
        if (campoMensagem.value.trim().length < 10) {
            marcarCampoErro(campoMensagem, true);
            formularioValido = false;
        } else {
            marcarCampoErro(campoMensagem, false);
        }

        // Caso todos os campos passem nos testes
        if (formularioValido) {
            sucessoForm.classList.remove("oculto");
            formulario.reset();
            
            // Esconde o aviso de sucesso após 5 segundos
            setTimeout(() => {
                sucessoForm.classList.add("oculto");
            }, 5000);
        }
    });

    function marcarCampoErro(elemento, possuiErro) {
        const conteinerPai = elemento.closest(".grupo-campo");
        if (possuiErro) {
            conteinerPai.classList.add("erro");
            elemento.setAttribute("aria-invalid", "true");
        } else {
            conteinerPai.classList.remove("erro");
            elemento.setAttribute("aria-invalid", "false");
        }
    }
});
