/* ===== Configuración (edita estos datos reales) ===== */
const CONFIG = {
  whatsapp: "573000000000", // número con indicativo, sin + ni espacios
  telefono: "+57 300 000 0000",
  direccion: "Dirección por confirmar, Antioquia, Colombia",
  email: "hola@elsaborpaisa.co",
  horario: [
    ["Lunes a viernes", "11:00 a.m. – 3:00 p.m."],
    ["Sábados", "11:00 a.m. – 8:00 p.m."],
    ["Domingos y festivos", "11:00 a.m. – 6:00 p.m."]
  ]
};

const PAGES = [
  ["index.html", "Inicio"],
  ["menu.html", "Menú"],
  ["nosotros.html", "Nosotros"],
  ["eventos.html", "Eventos"],
  ["domicilios.html", "Domicilios"],
  ["fidelizacion.html", "Club de sellos"],
  ["contacto.html", "Contacto"]
];

const waLink = (txt) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(txt)}`;

document.addEventListener("DOMContentLoaded", () => {
  const current = document.body.dataset.page;

  /* Header */
  const h = document.getElementById("site-header");
  if (h) {
    h.innerHTML = `
    <header class="site"><div class="container nav">
      <a href="index.html" class="logo">🫘 El Sabor <span>Paisa</span></a>
      <button class="burger" aria-label="Abrir menú">☰</button>
      <ul>${PAGES.map(([u, n]) => `<li><a href="${u}" class="${u === current ? "active" : ""}">${n}</a></li>`).join("")}</ul>
    </div></header>`;
    h.querySelector(".burger").addEventListener("click", () => h.querySelector("ul").classList.toggle("open"));
  }

  /* Footer */
  const f = document.getElementById("site-footer");
  if (f) {
    f.innerHTML = `
    <footer class="site"><div class="container">
      <div class="fgrid">
        <div><h4>El Sabor Paisa</h4><p>Cocina antioqueña tradicional: porciones generosas, precios accesibles y servicio cálido. Como en casa de la abuela.</p></div>
        <div><h4>Explora</h4><ul>${PAGES.map(([u, n]) => `<li><a href="${u}">${n}</a></li>`).join("")}</ul></div>
        <div><h4>Contacto</h4><ul><li>📞 ${CONFIG.telefono}</li><li>✉️ ${CONFIG.email}</li><li>📍 ${CONFIG.direccion}</li></ul></div>
      </div>
      <p class="copy">© ${new Date().getFullYear()} El Sabor Paisa · Hecho con fogón y cariño</p>
    </div></footer>
    <a class="wa" href="${waLink("¡Hola! Quiero información de El Sabor Paisa")}" target="_blank" rel="noopener">💬 WhatsApp</a>
    <button id="totop" aria-label="Volver arriba">↑</button>`;
    const top = document.getElementById("totop");
    top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    window.addEventListener("scroll", () => top.classList.toggle("show", window.scrollY > 500));
  }

  /* Reveal on scroll */
  const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  /* Contadores */
  document.querySelectorAll("[data-count]").forEach(el => {
    const end = +el.dataset.count, suffix = el.dataset.suffix || "";
    const co = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      let n = 0; const step = Math.max(1, Math.ceil(end / 50));
      const t = setInterval(() => { n = Math.min(end, n + step); el.textContent = n + suffix; if (n >= end) clearInterval(t); }, 30);
      co.disconnect();
    });
    co.observe(el);
  });

  /* Filtro del menú */
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(t => t.addEventListener("click", () => {
    tabs.forEach(x => x.classList.remove("on")); t.classList.add("on");
    const c = t.dataset.filter;
    document.querySelectorAll("[data-cat]").forEach(d => d.classList.toggle("hide", c !== "todos" && d.dataset.cat !== c));
  }));
  if (location.hash && document.querySelector(`.tab[data-filter="${location.hash.slice(1)}"]`)) {
    document.querySelector(`.tab[data-filter="${location.hash.slice(1)}"]`).click();
  }

  /* Tarjeta de sellos */
  const stampBox = document.getElementById("stamps");
  if (stampBox) {
    let count = 0;
    try { count = +localStorage.getItem("sellos") || 0; } catch (e) {}
    const msg = document.getElementById("stampMsg");
    const render = () => {
      stampBox.innerHTML = Array.from({ length: 10 }, (_, i) =>
        `<div class="stamp ${i === 9 ? "gift" : ""} ${i < count ? "on" : ""}">${i === 9 ? "🎁" : "🍽️"}</div>`).join("");
      msg.textContent = count >= 10 ? "🎉 ¡Tu décimo almuerzo es GRATIS!" : `Llevas ${count} de 10 sellos. Te faltan ${10 - count}.`;
      try { localStorage.setItem("sellos", count); } catch (e) {}
    };
    document.getElementById("addStamp").addEventListener("click", () => { if (count < 10) { count++; render(); } });
    document.getElementById("resetStamp").addEventListener("click", () => { count = 0; render(); });
    render();
  }

  /* Recomendador de eventos */
  const range = document.getElementById("personas");
  if (range) {
    const out = document.getElementById("recoOut"), num = document.getElementById("personasNum"), tipo = document.getElementById("tipoEvento");
    const calc = () => {
      const n = +range.value; num.textContent = n;
      let f;
      if (n <= 15) f = ["Mesa familiar para compartir", "Bandeja paisa y sancocho al centro de la mesa, con arepas, jugos naturales y postres para todos."];
      else if (n <= 50) f = ["Almuerzo ejecutivo grupal", "Menú cerrado con sopa, seco, jugo y postre del día, servido a la mesa y con tiempos puntuales."];
      else f = ["Buffet paisa completo", "Estaciones de platos insignia, bebidas típicas y rincón de postres, con música de carrilera y ambientación cafetera."];
      out.innerHTML = `<b>${f[0]}</b> para ${n} personas (${tipo.value}).<br>${f[1]}`;
    };
    range.addEventListener("input", calc); tipo.addEventListener("change", calc); calc();
  }

  /* Formularios -> WhatsApp */
  document.querySelectorAll("form[data-wa]").forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      form.querySelectorAll("[required]").forEach(inp => {
        const err = inp.parentElement.querySelector(".err");
        const bad = !inp.value.trim();
        if (err) err.textContent = bad ? "Este campo es obligatorio." : "";
        if (bad) ok = false;
      });
      if (!ok) return;
      const data = new FormData(form);
      const lines = [...data.entries()].map(([k, v]) => `${k}: ${v}`);
      window.open(waLink(`${form.dataset.wa}\n` + lines.join("\n")), "_blank");
      form.reset();
      const done = form.querySelector(".msg"); if (done) done.textContent = "¡Gracias! Se abrió WhatsApp con tu mensaje.";
    });
  });

  /* Horario */
  const hor = document.getElementById("horario");
  if (hor) hor.innerHTML = CONFIG.horario.map(([d, h]) => `<li><b>${d}:</b> ${h}</li>`).join("");
});