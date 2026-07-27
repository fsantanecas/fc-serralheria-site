(function () {
  "use strict";

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Accessibility: high-contrast toggle */
  var contrastToggle = document.getElementById("contrast-toggle");
  var CONTRAST_KEY = "fc-contrast";
  function applyContrast(isHigh) {
    document.documentElement.setAttribute("data-contrast", isHigh ? "high" : "normal");
    if (contrastToggle) {
      contrastToggle.setAttribute("aria-pressed", isHigh ? "true" : "false");
      contrastToggle.setAttribute("aria-label", isHigh ? "Desativar alto contraste" : "Ativar alto contraste");
    }
  }
  applyContrast(window.localStorage && localStorage.getItem(CONTRAST_KEY) === "high");
  if (contrastToggle) {
    contrastToggle.addEventListener("click", function () {
      var isHigh = document.documentElement.getAttribute("data-contrast") !== "high";
      applyContrast(isHigh);
      if (window.localStorage) localStorage.setItem(CONTRAST_KEY, isHigh ? "high" : "normal");
    });
  }

  /* Mobile nav toggle */
  var navToggle = document.getElementById("nav-toggle");
  var mainNav = document.getElementById("main-nav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    });
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Scroll reveal */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Portfolio filter */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var galleryItems = document.querySelectorAll(".gallery-item");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filter = btn.getAttribute("data-filter");
      filterBtns.forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");

      galleryItems.forEach(function (item) {
        var match = filter === "all" || item.getAttribute("data-filter") === filter;
        item.classList.toggle("is-hidden", !match);
      });
    });
  });

  /* Service cards pre-select portfolio filter on click */
  document.querySelectorAll(".service-card[data-filter]").forEach(function (card) {
    card.addEventListener("click", function () {
      var filter = card.getAttribute("data-filter");
      window.setTimeout(function () {
        var target = document.querySelector('.filter-btn[data-filter="' + filter + '"]');
        if (target) target.click();
      }, 350);
    });
  });

  /* Lightbox */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxCaption = document.getElementById("lightbox-caption");
  var lightboxClose = document.getElementById("lightbox-close");
  var lastFocused = null;

  function openLightbox(item) {
    var img = item.querySelector("img");
    if (!img || !lightbox) return;
    lastFocused = document.activeElement;
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || "";
    lightboxCaption.textContent = item.getAttribute("data-caption") || "";
    lightbox.hidden = false;
    lightboxClose.focus();
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }
  galleryItems.forEach(function (item) {
    item.addEventListener("click", function () { openLightbox(item); });
  });
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox && !lightbox.hidden) closeLightbox();
  });

  /* Orçamento form -> WhatsApp handoff */
  var form = document.getElementById("orcamento-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nome = form.nome.value.trim();
      var telefone = form.telefone.value.trim();
      var cidade = form.cidade.value.trim();
      var perfil = form.perfil.value;
      var mensagem = form.mensagem.value.trim();

      if (!nome || !telefone) {
        form.reportValidity();
        return;
      }

      var lines = [
        "Olá! Vim pelo site e gostaria de um orçamento.",
        "Nome: " + nome,
        "WhatsApp: " + telefone
      ];
      if (cidade) lines.push("Cidade: " + cidade);
      lines.push("Perfil: " + perfil);
      if (mensagem) lines.push("Projeto: " + mensagem);

      var text = encodeURIComponent(lines.join("\n"));
      window.open("https://wa.me/5511940364397?text=" + text, "_blank", "noopener");
    });
  }
})();
