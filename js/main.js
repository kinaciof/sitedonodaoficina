/* =========================================
   DONO DA OFICINA — Landing Page Scripts
   Interactions, Animations, Counters
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initCounters();
  initFAQ();
  initTourTabs();
  initSmoothScroll();
  initUTMPreservation();
  initLegalModals();
});

/* ---------- Navbar ---------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.navbar__toggle');
  const mobileMenu = document.querySelector('.navbar__mobile');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Swipe gesture for mobile menu
  let startX = 0;
  document.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    if (!mobileMenu) return;
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - startX;
    
    // Swipe Right (Open)
    if (startX < 40 && diffX > 50 && !mobileMenu.classList.contains('active')) {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (toggle) toggle.classList.add('active');
    }
    
    // Swipe Left (Close)
    if (diffX < -50 && mobileMenu.classList.contains('active')) {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
      if (toggle) toggle.classList.remove('active');
    }
  });
}

/* ---------- Scroll Animations (IntersectionObserver) ---------- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up');
  
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  elements.forEach(el => observer.observe(el));
}

/* ---------- Animated Counters ---------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.counter, 10);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);
    
    el.textContent = prefix + formatNumber(current) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace('.', ',') + 'M';
  }
  return num.toLocaleString('pt-BR');
}

/* ---------- FAQ Accordion ---------- */
function initFAQ() {
  const items = document.querySelectorAll('.faq__item');

  items.forEach(item => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      items.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq__answer').style.maxHeight = '0';
      });

      // Open clicked (if it wasn't active)
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ---------- Tour Tabs ---------- */
function initTourTabs() {
  const tabs = document.querySelectorAll('.tour__tab');
  const slides = document.querySelectorAll('.tour__slide');

  if (!tabs.length || !slides.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      slides.forEach(s => s.classList.remove('active'));

      tab.classList.add('active');
      const targetSlide = document.querySelector(`[data-slide="${target}"]`);
      if (targetSlide) targetSlide.classList.add('active');
    });
  });
}

/* ---------- Smooth Scroll ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80; // navbar height
        const position = target.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
          top: position,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ---------- UTM Preservation ---------- */
function initUTMPreservation() {
  const params = new URLSearchParams(window.location.search);
  const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
  
  const utmString = utmParams
    .filter(p => params.has(p))
    .map(p => `${p}=${params.get(p)}`)
    .join('&');

  if (!utmString) return;

  // Append UTM params to all external CTA links
  document.querySelectorAll('a[href*="donodaoficina.web.app"]').forEach(link => {
    const url = new URL(link.href);
    utmParams.forEach(p => {
      if (params.has(p)) {
        url.searchParams.set(p, params.get(p));
      }
    });
    link.href = url.toString();
  });
}

/* ---------- Google Ads Conversion Tracking ---------- */
function trackConversion(label) {
  // Placeholder: Replace with your actual Google Ads conversion ID and label
  if (typeof gtag === 'function') {
    gtag('event', 'conversion', {
      'send_to': 'AW-XXXXXXXXXX/' + label,
      'event_callback': function() {
        // Callback after conversion is tracked
      }
    });
  }
}

// Track CTA clicks
document.addEventListener('click', (e) => {
  const ctaLink = e.target.closest('a[href*="donodaoficina.web.app"]');
  if (ctaLink) {
    trackConversion('cta_click');
    
    // Also track with GA4 if available
    if (typeof gtag === 'function') {
      gtag('event', 'cta_click', {
        'event_category': 'engagement',
        'event_label': ctaLink.textContent.trim(),
        'transport_type': 'beacon'
      });
    }
  }
});

/* ---------- Legal Modals ---------- */
function initLegalModals() {
  const modal = document.getElementById('legal-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalContent = document.getElementById('modal-content');
  const closeBtn = document.getElementById('modal-close-btn');
  const overlay = document.getElementById('modal-overlay');
  
  if (!modal || !modalTitle || !modalContent) return;

  const termsContent = `
    <h4>1. Aceitação dos Termos</h4>
    <p>Ao se cadastrar e utilizar o aplicativo e serviços do <strong>Dono da Oficina</strong>, você concorda integralmente com estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar o sistema.</p>
    
    <h4>2. Descrição do Serviço</h4>
    <p>O <strong>Dono da Oficina</strong> é um software de gestão como serviço (SaaS) voltado para oficinas mecânicas, auto centers e centros automotivos. Oferecemos ferramentas para a criação de Ordens de Serviço digitais, controle de estoque, fluxo de caixa, relatórios financeiros, cadastro de clientes/veículos e envio de notificações via WhatsApp.</p>
    
    <h4>3. Cadastro e Segurança da Conta</h4>
    <p>Para utilizar o sistema, é necessário criar uma conta informando dados válidos e atualizados. Você é o único responsável por resguardar a sua senha de acesso e por todas as atividades que ocorram em sua conta. Contas suspeitas de fraudes ou uso indevido poderão ser suspensas sem aviso prévio.</p>
    
    <h4>4. Planos, Cobrança e Cancelamento</h4>
    <ul>
      <li><strong>Plano Gratuito:</strong> Permite testar as funcionalidades do sistema com um limite acumulado de até 30 Ordens de Serviço. Este plano não possui prazo de expiração e não renova o limite de OS.</li>
      <li><strong>Planos Pagos (Essencial, Profissional, Ultra):</strong> São oferecidos sob assinatura com recorrência mensal ou anual. Os valores e limites de cada plano são os informados na tabela de preços do site.</li>
      <li><strong>Cancelamento:</strong> A assinatura pode ser cancelada a qualquer momento diretamente na tela de configurações da sua conta, sem cobrança de multas ou taxas de fidelidade. O acesso aos recursos pagos permanecerá ativo até o fim do período já pago.</li>
    </ul>
    
    <h4>5. Uso Aceitável</h4>
    <p>Você concorda em não utilizar o sistema para fins ilícitos, envio de spam ou abusos através da API de WhatsApp, tentativas de invasão aos servidores ou qualquer prática de engenharia reversa. O uso indevido resultará na rescisão imediata do seu contrato de serviço.</p>
    
    <h4>6. Limitação de Responsabilidade</h4>
    <p>O <strong>Dono da Oficina</strong> é fornecido "como está". Não nos responsabilizamos por perdas comerciais, decisões financeiras equivocadas ou qualquer dano indireto decorrente da indisponibilidade temporária do sistema, que conta com a infraestrutura do Google Firebase para sua operação.</p>
    
    <h4>7. Alterações nestes Termos</h4>
    <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. Caso ocorram mudanças significativas, notificaremos os usuários através do próprio sistema ou por e-mail.</p>
    
    <p><small>Última atualização: 05 de junho de 2026.</small></p>
  `;

  const privacyContent = `
    <h4>1. Informações que Coletamos</h4>
    <p>Para viabilizar a utilização do <strong>Dono da Oficina</strong>, coletamos:</p>
    <ul>
      <li><strong>Dados de Cadastro da Oficina:</strong> Nome, e-mail, telefone, CNPJ/CPF, endereço e dados de pagamento (gerenciados por plataforma integrada segura).</li>
      <li><strong>Dados Operacionais da Oficina:</strong> Informações de seus clientes, histórico de veículos, ordens de serviço geradas, movimentações financeiras e estoque de peças cadastrados por você.</li>
      <li><strong>Dados de Uso:</strong> Endereço IP, tipo de navegador, registros de acessos e interações para suporte técnico e melhoria da segurança.</li>
    </ul>
    
    <h4>2. Uso das Informações</h4>
    <p>Todos os dados inseridos são utilizados única e exclusivamente para:</p>
    <ul>
      <li>Operação técnica do sistema (hospedagem, processamento de dados e emissão fiscal).</li>
      <li>Prestação de suporte técnico a você e sua equipe.</li>
      <li>Processamento seguro de cobranças e assinaturas.</li>
      <li>Comunicação de novidades, atualizações de segurança e melhorias.</li>
    </ul>
    
    <h4>3. Compartilhamento de Dados</h4>
    <p>Nós <strong>não vendemos, alugamos ou comercializamos</strong> seus dados ou os dados dos seus clientes com terceiros. O compartilhamento ocorre estritamente com parceiros tecnológicos necessários para a execução dos serviços (como o Google Firebase para hospedagem de dados e gateway de pagamento), todos em conformidade com altos padrões de segurança.</p>
    
    <h4>4. Segurança e Hospedagem</h4>
    <p>A segurança dos seus dados é nossa prioridade máxima. Toda a aplicação é hospedada nos servidores de alta segurança do Google Firebase, utilizando criptografia de dados em trânsito (SSL/HTTPS) e armazenamento seguro, garantindo isolamento total por oficina (multi-tenant).</p>
    
    <h4>5. Retenção de Dados</h4>
    <p>Em caso de cancelamento da sua conta, os dados da sua oficina serão mantidos salvos pelo prazo de até <strong>90 dias</strong> para fins de recuperação simples da conta. Após este período, você pode solicitar a exclusão permanente dos dados entrando em contato com nosso suporte.</p>
    
    <h4>6. Direitos sob a LGPD</h4>
    <p>Como controlador dos dados inseridos, você tem o direito de acessar, corrigir, exportar ou solicitar a exclusão das suas informações pessoais e operacionais a qualquer momento.</p>
    
    <h4>7. Contato de Privacidade</h4>
    <p>Se tiver dúvidas sobre esta política ou sobre como seus dados são gerenciados, entre em contato conosco através do nosso WhatsApp de suporte.</p>
    
    <p><small>Última atualização: 05 de junho de 2026.</small></p>
  `;

  function openModal(type) {
    if (type === 'terms') {
      modalTitle.textContent = 'Termos de Uso';
      modalContent.innerHTML = termsContent;
    } else if (type === 'privacy') {
      modalTitle.textContent = 'Política de Privacidade';
      modalContent.innerHTML = privacyContent;
    }
    
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Find footer links
  const links = document.querySelectorAll('.footer__link');
  links.forEach(link => {
    if (link.textContent.trim() === 'Termos de Uso') {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('terms');
      });
    } else if (link.textContent.trim() === 'Política de Privacidade') {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('privacy');
      });
    }
  });

  // Close actions
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}
