// ============================================
// ALVORAN: As Cinzas de Dourávia
// Sistema completo de leitura
// ============================================

// ---------- CONFIGURAÇÕES ----------
const TOTAL_CAPITULOS = 2; 
const NOME_LIVRO = "Alvoran: As Cinzas de Dourávia";

// ---------- SUMÁRIO (atualize conforme seus capítulos) ----------
const SUMARIO = [
    { numero: 1, titulo: "Herdeiros", arquivo: "capitulo-1.html" },
    { numero: 2, titulo: "Olhos de Safira", arquivo: "capitulo-2.html" }
];

// ---------- MODO CLARO/ESCURO ----------
function criarBotaoModo() {
    if (document.querySelector('.btn-modo')) return;
    
    const botaoModo = document.createElement('button');
    botaoModo.textContent = '🌙 Modo Noturno';
    botaoModo.className = 'btn-modo';  // ← usa a classe do CSS
    
    botaoModo.addEventListener('click', alternarModo);
    document.body.appendChild(botaoModo);
}

function alternarModo() {
    const body = document.body;
    const botao = document.querySelector('.btn-modo');
    
    body.classList.toggle('modo-claro');
    
    if (body.classList.contains('modo-claro')) {
        botao.textContent = '☀️ Modo Claro';
        botao.style.color = '#9b2c2c';
        botao.style.borderColor = '#9b2c2c';
        localStorage.setItem('alvoran_modo', 'claro');
    } else {
        botao.textContent = '🌙 Modo Noturno';
        botao.style.color = '#c4a747';
        botao.style.borderColor = '#c4a747';
        localStorage.setItem('alvoran_modo', 'escuro');
    }
}

function carregarModoSalvo() {
    const modoSalvo = localStorage.getItem('alvoran_modo');
    if (modoSalvo === 'claro') {
        document.body.classList.add('modo-claro');
        const botao = document.querySelector('.btn-modo');
        if (botao) {
            botao.textContent = '☀️ Modo Claro';
            botao.style.color = '#9b2c2c';
            botao.style.borderColor = '#9b2c2c';
        }
    }
}

// ---------- BARRA DE PROGRESSO (Bônus C) ----------
function criarBarraProgresso() {
    if (document.querySelector('.barra-progresso')) return;
    
    const barra = document.createElement('div');
    barra.className = 'barra-progresso';
    barra.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #c4a747, #9b2c2c);
        z-index: 1002;
        transition: width 0.1s ease;
        box-shadow: 0 0 5px rgba(196, 167, 71, 0.5);
    `;
    document.body.appendChild(barra);
}

function atualizarBarraProgresso() {
    const barra = document.querySelector('.barra-progresso');
    if (!barra) return;
    
    const scrollTop = window.scrollY;
    const alturaTotal = document.body.scrollHeight - window.innerHeight;
    const progresso = alturaTotal > 0 ? (scrollTop / alturaTotal) * 100 : 0;
    barra.style.width = `${progresso}%`;
}

// ---------- NAVEGAÇÃO COMPLETA (Anterior, Próximo, Sumário) ----------
async function verificarProximoCapitulo(capituloAtual) {
    const proximoNumero = capituloAtual + 1;
    const proximoArquivo = `../capitulos/capitulo-${proximoNumero}.html`;
    
    try {
        const response = await fetch(proximoArquivo, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
}

function mostrarMensagemAviso(capitulo) {
    // Remove mensagem existente se houver
    const msgExistente = document.querySelector('.aviso-capitulo');
    if (msgExistente) msgExistente.remove();
    
    // Cria a mensagem
    const aviso = document.createElement('div');
    aviso.className = 'aviso-capitulo';
    aviso.innerHTML = `
        <p>📖 <strong>Capítulo ${capitulo} em breve!</strong></p>
        <p>O reinado de Dourávia ainda está sendo escrito. Volte em breve para continuar esta jornada.</p>
        <button onclick="this.parentElement.remove()">Fechar</button>
    `;
    
    document.body.appendChild(aviso);
    
    // Remove automaticamente após 5 segundos
    setTimeout(() => {
        if (aviso && aviso.remove) aviso.remove();
    }, 5000);
}

function criarBotaoSumario() {
    if (document.querySelector('.btn-sumario')) return;
    
    const btnSumario = document.createElement('button');
    btnSumario.textContent = '📚 SUMÁRIO';
    btnSumario.className = 'btn-sumario';  // ← usa a classe do CSS
    
    btnSumario.addEventListener('click', mostrarSumario);
    document.body.appendChild(btnSumario);
}

function mostrarSumario() {
    // Remove modal existente
    const modalExistente = document.querySelector('.modal-sumario');
    if (modalExistente) modalExistente.remove();
    
    // Cria o modal
    const modal = document.createElement('div');
    modal.className = 'modal-sumario';
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #121212;
        border: 1px solid #c4a747;
        border-radius: 8px;
        padding: 2rem;
        max-width: 400px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        z-index: 2000;
        box-shadow: 0 0 50px rgba(0,0,0,0.8);
    `;
    
    // Fundo escuro
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 1999;
    `;
    overlay.onclick = () => { modal.remove(); overlay.remove(); };
    
    // Conteúdo do sumário
    let conteudo = '<h2 style="color: #c4a747; margin-bottom: 1.5rem;">📖 Sumário de Alvoran</h2><ul style="list-style: none; padding: 0;">';
    
    SUMARIO.forEach(cap => {
        const isLido = localStorage.getItem(`lido_cap_${cap.numero}`) === 'true';
        const iconeLido = isLido ? '✓ ' : '○ ';
        
        conteudo += `
            <li style="margin-bottom: 0.8rem;">
                <a href="${cap.arquivo}" style="color: #e0dcd3; text-decoration: none; display: block; padding: 0.3rem 0; border-bottom: 1px solid #2a2a2a;">
                    ${iconeLido} <strong>Capítulo ${cap.numero}:</strong> ${cap.titulo}
                </a>
            </li>
        `;
    });
    
    // Capítulo atual destacado
    const match = window.location.pathname.match(/capitulo-(\d+)\.html/);
    if (match) {
        const atual = parseInt(match[1]);
        conteudo += `<p style="margin-top: 1rem; font-size: 0.8rem; color: #c4a747;">📍 Você está no Capítulo ${atual}</p>`;
    }
    
    conteudo += `<button id="fecharSumario" style="margin-top: 1.5rem; background: #c4a747; color: #0d0d0d; border: none; padding: 0.5rem 1rem; cursor: pointer; border-radius: 4px;">Fechar</button>`;
    
    modal.innerHTML = conteudo;
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
    
    document.getElementById('fecharSumario').onclick = () => {
        modal.remove();
        overlay.remove();
    };
}

function atualizarNavegacao() {
    const match = window.location.pathname.match(/capitulo-(\d+)\.html/);
    if (!match) return;
    
    const capituloAtual = parseInt(match[1]);
    const navDiv = document.querySelector('.navegacao');
    if (!navDiv) return;
    
    navDiv.innerHTML = '';
    
    // Botão VOLTAR PARA CAPA
    const btnCapa = document.createElement('a');
    btnCapa.href = '../index.html';
    btnCapa.className = 'btn-capitulo';
    btnCapa.innerHTML = '🏠 CAPA';
    navDiv.appendChild(btnCapa);
    
    // Botão ANTERIOR
    if (capituloAtual > 1) {
        const btnAnterior = document.createElement('a');
        btnAnterior.href = `../capitulos/capitulo-${capituloAtual - 1}.html`;
        btnAnterior.className = 'btn-capitulo';
        btnAnterior.innerHTML = '← ANTERIOR';
        navDiv.appendChild(btnAnterior);
    } else {
        const espaco = document.createElement('span');
        espaco.innerHTML = '&nbsp;';
        espaco.style.width = '80px';
        navDiv.appendChild(espaco);
    }
    
    // Botão SUMÁRIO (versão rápida)
    const btnSumarioRapido = document.createElement('button');
    btnSumarioRapido.textContent = '📚 SUMÁRIO';
    btnSumarioRapido.className = 'btn-capitulo';
    btnSumarioRapido.style.cursor = 'pointer';
    btnSumarioRapido.onclick = mostrarSumario;
    navDiv.appendChild(btnSumarioRapido);
    
    // Botão PRÓXIMO
    const proximoNumero = capituloAtual + 1;
    const btnProximo = document.createElement('a');
    btnProximo.className = 'btn-capitulo';
    btnProximo.innerHTML = 'PRÓXIMO →';
    
    fetch(`../capitulos/capitulo-${proximoNumero}.html`, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                btnProximo.href = `../capitulos/capitulo-${proximoNumero}.html`;
            } else {
                btnProximo.href = '#';
                btnProximo.style.opacity = '0.5';
                btnProximo.style.cursor = 'not-allowed';
                btnProximo.addEventListener('click', (e) => {
                    e.preventDefault();
                    mostrarMensagemAviso(proximoNumero);
                });
            }
        })
        .catch(() => {
            btnProximo.href = '#';
            btnProximo.style.opacity = '0.5';
            btnProximo.style.cursor = 'not-allowed';
            btnProximo.addEventListener('click', (e) => {
                e.preventDefault();
                mostrarMensagemAviso(proximoNumero);
            });
        });
    
    navDiv.appendChild(btnProximo);
}

// ---------- ÚLTIMO CAPÍTULO LIDO (Destaque na Capa - Bônus A) ----------
function salvarProgresso() {
    const urlAtual = window.location.pathname;
    if (urlAtual.includes('capitulo')) {
        localStorage.setItem('alvoran_ultimoCapitulo', urlAtual);
        
        // Marca como lido no sumário
        const match = urlAtual.match(/capitulo-(\d+)\.html/);
        if (match) {
            localStorage.setItem(`lido_cap_${match[1]}`, 'true');
        }
    }
}

function mostrarContinuar() {
    const ultimo = localStorage.getItem('alvoran_ultimoCapitulo');
    const continuarDiv = document.getElementById('continuarDiv');
    const continuarLink = document.getElementById('continuarLink');
    
    if (ultimo && continuarDiv && continuarLink && !window.location.pathname.includes('capitulo')) {
        continuarDiv.style.display = 'block';
        continuarLink.href = ultimo;
        
        // Adiciona informação de qual capítulo
        const match = ultimo.match(/capitulo-(\d+)\.html/);
        if (match) {
            continuarLink.innerHTML = `continuar de onde parou (Capítulo ${match[1]})`;
        }
    }
}

// ---------- EFEITO VIRAR PÁGINA (Bônus C) ----------
function aplicarEfeitoVirarPagina() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.href && !link.href.includes('#') && link.getAttribute('target') !== '_blank') {
                e.preventDefault();
                const destino = link.href;
                
                document.body.style.animation = 'virarPaginaSaindo 0.3s ease forwards';
                setTimeout(() => {
                    window.location.href = destino;
                }, 250);
            }
        });
    });
}

// Adiciona o CSS da animação de virar página
const styleAnimacao = document.createElement('style');
styleAnimacao.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes virarPaginaSaindo {
        0% {
            opacity: 1;
            transform: perspective(600px) rotateY(0deg);
        }
        100% {
            opacity: 0;
            transform: perspective(600px) rotateY(-30deg);
        }
    }
    
    @keyframes virarPaginaEntrando {
        0% {
            opacity: 0;
            transform: perspective(600px) rotateY(30deg);
        }
        100% {
            opacity: 1;
            transform: perspective(600px) rotateY(0deg);
        }
    }
    
    body {
        animation: virarPaginaEntrando 0.4s ease-out;
    }
`;
document.head.appendChild(styleAnimacao);

// ---------- SALVAR POSIÇÃO DE LEITURA ----------
function salvarPosicao() {
    if (window.location.pathname.includes('capitulo')) {
        const scrollPos = window.scrollY;
        localStorage.setItem(`posicao_${window.location.pathname}`, scrollPos);
    }
}

function restaurarPosicao() {
    if (window.location.pathname.includes('capitulo')) {
        const posicao = localStorage.getItem(`posicao_${window.location.pathname}`);
        if (posicao) {
            setTimeout(() => window.scrollTo(0, parseInt(posicao)), 150);
        }
    }
}

function atualizarTituloPagina() {
    if (window.location.pathname.includes('capitulo')) {
        const match = window.location.pathname.match(/capitulo-(\d+)\.html/);
        if (match) {
            const capitulo = SUMARIO.find(c => c.numero === parseInt(match[1]));
            const tituloCap = capitulo ? capitulo.titulo : `Capítulo ${match[1]}`;
            document.title = `${tituloCap} - ${NOME_LIVRO}`;
        }
    }
}

// ---------- INICIALIZAÇÃO ----------
document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ Alvoran carregado com todas as funcionalidades!');
    
    criarBotaoModo();
    criarBarraProgresso();
    criarBotaoSumario();
    carregarModoSalvo();
    mostrarContinuar();
    restaurarPosicao();
    salvarProgresso();
    atualizarTituloPagina();
    atualizarNavegacao();
    aplicarEfeitoVirarPagina();
    
    // Barra de progresso
    window.addEventListener('scroll', atualizarBarraProgresso);
    atualizarBarraProgresso();
});

window.addEventListener('beforeunload', salvarPosicao);
window.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.href) {
        salvarProgresso();
    }
});