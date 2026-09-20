/* SUR Helado | Café — interacciones.
   Script clásico (sin módulos): funciona abriendo index.html con doble clic y en cualquier hosting. */
(function () {
  "use strict";

  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); };
  var fineHover = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;
  var html = document.documentElement;

  function safe(fn, name) {
    try { fn(); } catch (e) { if (window.console) console.warn("[" + name + "]", e); }
  }
  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  /* ---------- Textos que genera el propio script ---------- */
  var I18N = {
    es: {
      open: "Abierto ahora", closed: "Cerrado ahora",
      menuOpen: "Abrir menú", menuClose: "Cerrar menú",
      mapTitle: "Mapa: SUR Helado | Café, Calle Pirandello, 8, Málaga"
    },
    en: {
      title: "SUR Helado | Café · Ice cream parlour & café in Teatinos, Málaga",
      description: "Family-run ice cream parlour and café with a terrace on Calle Pirandello, 8, Teatinos-Universidad (Málaga). Ice cream, coffee, breakfast, croffles, cakes and smoothies. Menu, opening hours and location.",
      open: "Open now", closed: "Closed now",
      menuOpen: "Open menu", menuClose: "Close menu",
      mapTitle: "Map: SUR Helado | Café, Calle Pirandello, 8, Málaga"
    }
  };
  var lang = "es";
  var openState = null;
  var t = function (key) { return I18N[lang][key]; };

  /* ---------- Idioma (ES / EN) ----------
     El HTML está en español. Cada texto traducible lleva data-en (texto),
     data-en-html (texto con etiquetas), data-en-alt (alt de imagen) o data-en-label (aria-label). */
  function swap(attrEn, attrEs, read, write) {
    $$("[" + attrEn + "]").forEach(function (el) {
      if (!el.hasAttribute(attrEs)) el.setAttribute(attrEs, read(el));
      write(el, el.getAttribute(lang === "en" ? attrEn : attrEs));
    });
  }
  function applyLang(next) {
    lang = next === "en" ? "en" : "es";
    html.lang = lang;

    swap("data-en", "data-es", function (el) { return el.textContent; }, function (el, v) { el.textContent = v; });
    swap("data-en-html", "data-es-html", function (el) { return el.innerHTML; }, function (el, v) { el.innerHTML = v; });
    swap("data-en-alt", "data-es-alt", function (el) { return el.getAttribute("alt") || ""; }, function (el, v) { el.setAttribute("alt", v); });
    swap("data-en-label", "data-es-label", function (el) { return el.getAttribute("aria-label") || ""; }, function (el, v) { el.setAttribute("aria-label", v); });

    var meta = $('meta[name="description"]');
    if (!I18N.es.title) { I18N.es.title = document.title; I18N.es.description = meta ? meta.content : ""; }
    document.title = t("title");
    if (meta) meta.content = t("description");

    $$("[data-lang]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang ? "true" : "false"); });
    var label = $("[data-nav-toggle-label]");
    var header = $("[data-header]");
    if (label) label.textContent = header && header.classList.contains("is-open") ? t("menuClose") : t("menuOpen");
    var iframe = $("[data-map] iframe");
    if (iframe) iframe.title = t("mapTitle");
    renderOpenBadge();
  }
  function initLang() {
    var saved = store("sur-lang");
    var initial = saved;
    if (!initial) {
      var langs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "es"]);
      var spanishish = langs.some(function (l) { return /^(es|ca|gl|eu)\b/i.test(l); });
      initial = spanishish ? "es" : "en";
    }
    if (initial === "en") applyLang("en");
    $$("[data-lang]").forEach(function (b) {
      b.addEventListener("click", function () {
        var next = b.getAttribute("data-lang");
        if (next === lang) return;
        applyLang(next);
        store("sur-lang", next);
      });
    });
  }

  /* ---------- Cabecera: fondo al hacer scroll + menú móvil ---------- */
  function initNav() {
    var header = $("[data-header]");
    var toggle = $("[data-nav-toggle]");
    var menu = $("[data-nav-menu]");
    if (!header) return;

    var onScroll = function () { header.classList.toggle("is-solid", window.scrollY > 24); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (!toggle || !menu) return;
    var setOpen = function (open) {
      header.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      $("[data-nav-toggle-label]", toggle).textContent = open ? t("menuClose") : t("menuOpen");
      document.body.classList.toggle("no-scroll", open);
    };
    toggle.addEventListener("click", function () { setOpen(!header.classList.contains("is-open")); });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && header.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1280 && header.classList.contains("is-open")) setOpen(false);
    });
  }

  /* ---------- Aparición al hacer scroll ---------- */
  function initReveals() {
    var els = $$(".reveal");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    els.forEach(function (el) {
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (s) { return s.classList.contains("reveal"); });
      var i = siblings.indexOf(el);
      if (i > 0) el.style.transitionDelay = Math.min(i, 5) * 70 + "ms";
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -4% 0px" });
    els.forEach(function (el) { io.observe(el); });

    // Red de seguridad: a los 6 s, mostrar lo que ya esté en pantalla o por encima
    setTimeout(function () {
      $$(".reveal:not(.is-visible)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-visible");
      });
    }, 6000);
  }

  /* ---------- Pestañas de la carta ---------- */
  function initTabs() {
    var root = $("[data-tabs]");
    if (!root) return;
    var tabs = $$("[data-tab]", root);
    var panels = $$("[data-panel]", root);
    if (!tabs.length) return;

    function select(name, focus) {
      tabs.forEach(function (tab) {
        var on = tab.getAttribute("data-tab") === name;
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.tabIndex = on ? 0 : -1;
        if (on) {
          if (focus) tab.focus();
          if (tab.scrollIntoView && tab.parentElement.scrollWidth > tab.parentElement.clientWidth) {
            tab.parentElement.scrollTo({ left: tab.offsetLeft - 16, behavior: "smooth" });
          }
        }
      });
      panels.forEach(function (p) { p.hidden = p.getAttribute("data-panel") !== name; });
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab.getAttribute("data-tab")); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === "Home") next = tabs[0];
        if (e.key === "End") next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); select(next.getAttribute("data-tab"), true); }
      });
    });

    $$("[data-tab-link]").forEach(function (a) {
      a.addEventListener("click", function () { select(a.getAttribute("data-tab-link")); });
    });

    var first = tabs.filter(function (tab) { return tab.getAttribute("aria-selected") === "true"; })[0] || tabs[0];
    select(first.getAttribute("data-tab"));
  }

  /* ---------- Horario: día de hoy + "Abierto ahora" (hora de Málaga) ---------- */
  function toMinutes(hhmm) {
    var p = String(hhmm).trim().split(":");
    return parseInt(p[0], 10) * 60 + (parseInt(p[1], 10) || 0);
  }
  function parseRanges(str) {
    if (!str || /cerrad|closed/i.test(str)) return [];
    return str.split(",").map(function (r) {
      var p = r.split("-");
      return [toMinutes(p[0]), toMinutes(p[1])];
    });
  }
  function nowInMalaga() {
    var parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Madrid", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false
    }).formatToParts(new Date());
    var get = function (type) { return (parts.filter(function (x) { return x.type === type; })[0] || {}).value; };
    var days = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
    return { day: days[get("weekday")], minutes: (parseInt(get("hour"), 10) % 24) * 60 + parseInt(get("minute"), 10) };
  }
  function renderOpenBadge() {
    if (openState === null) return;
    $$("[data-open-badge]").forEach(function (b) {
      b.classList.toggle("is-open", openState);
      $("[data-open-text]", b).textContent = openState ? t("open") : t("closed");
      b.hidden = false;
    });
  }
  function initOpenNow() {
    var rows = $$("tr[data-day]");
    if (!rows.length) return;
    var now = nowInMalaga();
    rows.forEach(function (r) { r.classList.toggle("is-today", Number(r.getAttribute("data-day")) === now.day); });

    var schedule = {};
    var complete = rows.every(function (r) {
      var h = (r.getAttribute("data-hours") || "").trim();
      schedule[r.getAttribute("data-day")] = parseRanges(h);
      return h.length > 0;
    });
    if (!complete) return;

    var prevDay = now.day === 1 ? 7 : now.day - 1;
    openState = schedule[now.day].some(function (r) {
      return r[1] > r[0] ? (now.minutes >= r[0] && now.minutes < r[1]) : now.minutes >= r[0];
    }) || schedule[prevDay].some(function (r) {
      return r[1] <= r[0] && now.minutes < r[1]; // tramo que pasa de medianoche
    });
    renderOpenBadge();
  }

  /* ---------- Mapa: se carga solo al pulsar (privacidad y velocidad) ---------- */
  function initMap() {
    var btn = $("[data-map-load]");
    var box = $("[data-map]");
    if (!btn || !box) return;
    btn.addEventListener("click", function () {
      if ($("iframe", box)) return;
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.google.com/maps?q=Sur%20-%20Helado%20Cafe%2C%20Calle%20Pirandello%208%2C%2029010%20M%C3%A1laga&z=17&output=embed";
      iframe.title = t("mapTitle");
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      box.appendChild(iframe);
      var ph = $("[data-map-placeholder]", box);
      if (ph) ph.hidden = true;
    });
  }

  /* ---------- Inclinación suave de tarjetas (solo ratón) ---------- */
  function initTilt() {
    if (!fineHover) return;
    $$("[data-tilt]").forEach(function (card) {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = "1";
      card.addEventListener("mousemove", function (e) {
        if (card.classList.contains("reveal") && !card.classList.contains("is-visible")) return;
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transition = "transform .15s ease-out";
        card.style.transform = "perspective(1000px) rotateX(" + (-y * 4).toFixed(2) + "deg) rotateY(" + (x * 5).toFixed(2) + "deg) translateY(-4px)";
      });
      card.addEventListener("mouseout", function (e) {
        if (card.contains(e.relatedTarget)) return;
        card.style.transition = "transform .6s cubic-bezier(.16,1,.3,1)";
        card.style.transform = "";
      });
    });
  }

  /* ---------- Aviso de borrador: cuenta y recorre los datos pendientes ---------- */
  function initDraftPill() {
    var pill = $("[data-draft-pill]");
    if (!pill) return;
    var items = $$(".pending").filter(function (el) { return !el.parentElement.closest(".pending"); });
    if (!items.length || !document.body.classList.contains("is-draft")) { pill.hidden = true; return; }
    $("[data-draft-count]", pill).textContent = items.length;
    pill.hidden = false;
    pill.setAttribute("aria-label", "Borrador: " + items.length + " datos pendientes. Pulsa para ir al siguiente.");

    var idx = -1;
    pill.addEventListener("click", function () {
      idx = (idx + 1) % items.length;
      var el = items[idx];
      var panel = el.closest("[data-panel]");
      if (panel && panel.hidden) {
        var tab = $('[data-tab="' + panel.getAttribute("data-panel") + '"]');
        if (tab) tab.click();
      }
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.remove("is-flash");
      void el.offsetWidth;
      el.classList.add("is-flash");
      pill.title = el.getAttribute("data-pending") || "";
    });
  }

  function initYear() {
    $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  function boot() {
    // "js-init" evita que los elementos ya visibles se desvanezcan al activar las animaciones
    html.classList.add("js", "js-init");
    requestAnimationFrame(function () { requestAnimationFrame(function () { html.classList.remove("js-init"); }); });

    safe(initOpenNow, "initOpenNow");
    safe(initLang, "initLang");
    safe(initNav, "initNav");
    safe(initTabs, "initTabs");
    safe(initReveals, "initReveals");
    safe(initMap, "initMap");
    safe(initTilt, "initTilt");
    safe(initDraftPill, "initDraftPill");
    safe(initYear, "initYear");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
