document.addEventListener('DOMContentLoaded', () => {

  /* =============================================
     Custom Cursor
     ============================================= */
  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');
  let mx = 0, my = 0, ox = 0, oy = 0;

  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });
    (function loop() {
      ox += (mx - ox) * 0.15;
      oy += (my - oy) * 0.15;
      outline.style.left = ox + 'px';
      outline.style.top = oy + 'px';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
    });
  } else {
    dot.style.display = 'none';
    outline.style.display = 'none';
  }

  /* =============================================
     GSAP Hero Entrance Animations
     ============================================= */
  const contentEls = document.querySelectorAll('.content-inner .reveal-up');
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.2 });

  // 1. Photo: blur-in + scale
  tl.fromTo('#heroPhoto', {
    opacity: 0, scale: 1.08, filter: 'blur(20px)'
  }, {
    opacity: 1, scale: 1, filter: 'blur(0px)',
    duration: 1.8, ease: 'power3.out'
  });

  // 2. Glow behind photo
  tl.fromTo('.photo-glow', {
    opacity: 0, scale: 0.5
  }, {
    opacity: 1, scale: 1,
    duration: 1.4, ease: 'power2.out'
  }, '-=1.4');

  // 3. Content stagger
  tl.to(contentEls, {
    opacity: 1, y: 0,
    duration: 1, stagger: 0.1,
    ease: 'power3.out'
  }, '-=1.0');

  // 4. Featured card
  tl.to('.featured-card-outer', {
    opacity: 1, y: 0,
    duration: 0.8, ease: 'back.out(1.4)'
  }, '-=0.4');

  // 5. Scroll indicator
  tl.to('.scroll-indicator', {
    opacity: 1, y: 0,
    duration: 0.6, ease: 'power2.out'
  }, '-=0.2');

  // CTA Idle Pulse
  const btn = document.getElementById('cta-btn');
  let timer;
  function resetPulse() {
    clearTimeout(timer);
    btn.classList.remove('cta-breathing');
    timer = setTimeout(() => btn.classList.add('cta-breathing'), 3500);
  }
  tl.eventCallback('onComplete', () => {
    document.addEventListener('mousemove', resetPulse);
    document.addEventListener('scroll', resetPulse);
    document.addEventListener('touchstart', resetPulse);
    resetPulse();
  });

  /* =============================================
     Lucide Icons init
     ============================================= */
  lucide.createIcons();

  /* =============================================
     GSAP ScrollTrigger — Section animations
     ============================================= */
  gsap.registerPlugin(ScrollTrigger);

  // Animate all section H2s (except hero)
  document.querySelectorAll('section:not(:first-of-type) h2').forEach(h2 => {
    gsap.fromTo(h2, {
      opacity: 0,
      y: 40,
      filter: 'blur(8px)'
    }, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: h2,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Animate .ds-section-label tags
  document.querySelectorAll('.ds-section-label').forEach(label => {
    gsap.fromTo(label, {
      opacity: 0,
      x: -20
    }, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: label,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Animate .linear-card items with stagger per section
  document.querySelectorAll('.grid').forEach(grid => {
    const cards = grid.querySelectorAll('.linear-card');
    if (cards.length) {
      gsap.fromTo(cards, {
        opacity: 0,
        y: 30
      }, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: grid,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    }
  });

  // Animate closing statements
  document.querySelectorAll('[data-animate="closing"]').forEach(el => {
    gsap.fromTo(el, {
      opacity: 0,
      scale: 0.95
    }, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  /* =============================================
     Scroll Reveal (IntersectionObserver)
     ============================================= */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* =============================================
     Testimonial Carousel
     ============================================= */
  const slider = document.getElementById('testimonialSlider');
  const cards = slider.querySelectorAll('.testimonial-card');

  function updateActiveCard() {
    const sliderRect = slider.getBoundingClientRect();
    const centerX = sliderRect.left + sliderRect.width / 2;

    cards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const dist = Math.abs(centerX - cardCenter);
      const maxDist = sliderRect.width / 2;
      const opacity = Math.max(0.35, 1 - (dist / maxDist) * 0.65);
      const scale = Math.max(0.93, 1 - (dist / maxDist) * 0.07);
      card.style.opacity = opacity;
      card.style.transform = `scale(${scale})`;
    });
  }

  slider.addEventListener('scroll', updateActiveCard);
  updateActiveCard();

  /* Auto-scroll loop */
  let autoIdx = 0;
  let autoInterval = null;
  let resumeTimeout = null;

  function advance() {
    autoIdx = (autoIdx + 1) % cards.length;
    const card = cards[autoIdx];
    const scrollTarget = card.offsetLeft - (slider.offsetWidth / 2) + (card.offsetWidth / 2);
    slider.scrollTo({ left: scrollTarget, behavior: 'smooth' });
  }

  function start() {
    if (autoInterval) return;
    autoInterval = setInterval(advance, 4500);
  }

  function pause() {
    clearInterval(autoInterval);
    autoInterval = null;
    clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(() => {
      const cx = slider.getBoundingClientRect().left + slider.getBoundingClientRect().width / 2;
      let best = 0, bestD = Infinity;
      cards.forEach((c, i) => {
        const d = Math.abs(cx - (c.getBoundingClientRect().left + c.getBoundingClientRect().width / 2));
        if (d < bestD) { bestD = d; best = i; }
      });
      autoIdx = best;
      start();
    }, 8000);
  }

  slider.addEventListener('pointerdown', pause);
  slider.addEventListener('wheel', pause, { passive: true });
  start();

  /* =============================================
     FAQ Accordion
     ============================================= */
  document.querySelectorAll('.faq-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      // Fecha todos os outros
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-answer').style.maxHeight = '0';
        }
      });

      // Toggle do item clicado
      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

});
