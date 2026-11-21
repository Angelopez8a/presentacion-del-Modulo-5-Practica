/* Motor de la presentación: Reveal + animaciones de entrada + videos Manim + interacciones. */
(function () {
  const D = window.DATA;
  const PRINT = /print-pdf/i.test(window.location.search);
  // ?estatico: sin animaciones (equipos lentos o revisión); los videos se muestran como su fotograma final
  const ESTATICO = /estatico/i.test(window.location.search);
  const nf = new Intl.NumberFormat("en-US");

  // ------------------------------------------------------------ contenido generado con datos
  function construirListaSegmentos() {
    const cont = document.getElementById("seg-list");
    if (!cont) return;
    cont.innerHTML = D.segmentos.map(s => `
      <div class="card sm segcard" data-a style="--c:${D.colores[s.nombre]};display:flex;align-items:center;gap:14px;padding:12px 18px">
        <span class="sw" style="background:${D.colores[s.nombre]};width:14px;height:40px;border-radius:7px"></span>
        <div style="flex:1;min-width:0">
          <div style="font:800 17px/1.15 var(--f-ui);color:var(--ink)">${s.nombre}</div>
          <div style="font:500 13.5px/1.3 var(--f-ui);color:var(--ink-3);margin-top:2px">${s.alias}</div>
        </div>
        <div style="font:700 28px/1 var(--f-display);color:${D.colores[s.nombre] === "#A9A9A9" ? "#7E7E7E" : D.colores[s.nombre]}">${s.pctCli}%</div>
      </div>`).join("");
  }

  function construirPersonas() {
    const cont = document.getElementById("personas");
    if (!cont) return;
    const max = { gasto: 200, ticket: 27, visitas: 15, responde: 80 };
    cont.innerHTML = D.segmentos.map(s => {
      const c = D.colores[s.nombre] === "#A9A9A9" ? "#8C8C8C" : D.colores[s.nombre];
      const m = (k, v, txt) => `<div class="metric"><div class="k">${k}</div><div class="v">${txt}</div><div class="meter"><i data-w="${Math.min(100, (v / max[kmap[k]]) * 100)}"></i></div></div>`;
      const extra = s.edad
        ? `${s.edad} años en promedio · ingreso de $${s.ingreso} mil · cliente desde hace ${s.antig} · ${s.mujeres} % mujeres · ve el ${s.vista} % de las ofertas`
        : `Sin edad, género ni ingreso registrados · cliente desde hace ${s.antig} · ve el ${s.vista} % de las ofertas`;
      return `<div class="card persona" data-a style="--c:${c}">
        <div class="top"><h4>${s.nombre}</h4><span class="share">${s.pctCli} % clientes · ${s.pctVen} % ventas</span></div>
        <div class="alias">“${s.alias}”</div>
        <div class="desc">${s.desc}</div>
        <div class="more">${extra}</div>
        <div class="metrics">
          ${m("Gasto al mes", s.gasto, "$" + (s.gasto < 1 ? s.gasto.toFixed(1) : Math.round(s.gasto)))}
          ${m("Ticket", s.ticket, "$" + s.ticket.toFixed(1))}
          ${m("Visitas al mes", s.visitas, s.visitas.toFixed(1))}
          ${m("Responde", s.responde, s.responde + " %")}
        </div>
      </div>`;
    }).join("");
    cont.querySelectorAll(".persona").forEach(p => p.addEventListener("click", () => p.classList.toggle("open")));
  }
  const kmap = { "Gasto al mes": "gasto", "Ticket": "ticket", "Visitas al mes": "visitas", "Responde": "responde" };

  function construirTablaK() {
    const tb = document.querySelector("#tabla-k tbody");
    if (!tb) return;
    tb.innerHTML = D.k.map(r => `<tr class="${r.k === 5 ? "hl" : ""}"><td><b>${r.k}</b></td><td class="num">${nf.format(r.inercia)}</td><td class="num">${r.silueta.toFixed(3)}</td><td class="num">${r.db.toFixed(3)}</td></tr>`).join("");
  }

  construirListaSegmentos();
  construirPersonas();
  construirTablaK();

  // ------------------------------------------------------------ tema vivo: fondos de color por acto
  const FONDOS = {
    "t-portada": "radial-gradient(700px 520px at 88% 18%, rgba(19,181,138,.36), transparent 62%), radial-gradient(640px 480px at 72% 96%, rgba(91,69,176,.24), transparent 62%), radial-gradient(560px 460px at 4% 6%, rgba(242,165,65,.28), transparent 60%), radial-gradient(520px 420px at 28% 104%, rgba(44,156,201,.20), transparent 60%), linear-gradient(#EEF4F0, #EEF4F0)",
    "t-1": "radial-gradient(760px 520px at 98% 0%, rgba(19,181,138,.30), transparent 62%), radial-gradient(640px 520px at 0% 100%, rgba(242,165,65,.20), transparent 60%), linear-gradient(#E3F0E8, #E3F0E8)",
    "t-2": "radial-gradient(760px 520px at 98% 0%, rgba(91,69,176,.24), transparent 62%), radial-gradient(640px 520px at 0% 100%, rgba(44,156,201,.20), transparent 60%), linear-gradient(#ECEAF6, #ECEAF6)",
    "t-3": "radial-gradient(760px 520px at 98% 0%, rgba(226,85,59,.20), transparent 62%), radial-gradient(640px 520px at 0% 100%, rgba(242,165,65,.26), transparent 60%), linear-gradient(#F6EDE6, #F6EDE6)",
    "t-4": "radial-gradient(760px 520px at 98% 0%, rgba(217,162,27,.26), transparent 62%), radial-gradient(640px 520px at 0% 100%, rgba(19,181,138,.22), transparent 60%), linear-gradient(#EEF2E3, #EEF2E3)",
    "t-a": "radial-gradient(700px 500px at 100% 0%, rgba(63,90,107,.14), transparent 60%), linear-gradient(#E8ECEF, #E8ECEF)",
    "t-cierre": "radial-gradient(700px 500px at 92% 8%, rgba(19,181,138,.22), transparent 60%), radial-gradient(640px 480px at 6% 94%, rgba(242,165,65,.20), transparent 60%), linear-gradient(#E9F0EC, #E9F0EC)",
    "t-sep1": "radial-gradient(900px 700px at 86% 50%, rgba(123,211,137,.45), transparent 60%), linear-gradient(135deg, #004D33 0%, #00704A 45%, #0E9F6E 100%)",
    "t-sep2": "radial-gradient(900px 700px at 86% 50%, rgba(44,156,201,.50), transparent 60%), linear-gradient(135deg, #2A1F66 0%, #5B45B0 50%, #3A7BC8 100%)",
    "t-sep3": "radial-gradient(900px 700px at 86% 50%, rgba(242,165,65,.55), transparent 60%), linear-gradient(135deg, #8E2F1C 0%, #D2532F 50%, #EE8A3C 100%)",
    "t-sep4": "radial-gradient(900px 700px at 86% 50%, rgba(217,162,27,.55), transparent 60%), linear-gradient(135deg, #0B3D2E 0%, #00704A 55%, #3E9B4F 100%)",
    "t-sepA": "radial-gradient(800px 600px at 86% 50%, rgba(19,181,138,.22), transparent 60%), linear-gradient(135deg, #22313A 0%, #3F5A6B 100%)"
  };
  function aplicarFondos() {
    const vivo = document.documentElement.classList.contains("vivo");
    document.querySelectorAll(".reveal .slides > section").forEach(sec => {
      const t = [...sec.classList].find(c => c.startsWith("t-"));
      if (vivo && FONDOS[t]) sec.setAttribute("data-background-gradient", FONDOS[t]);
      else sec.removeAttribute("data-background-gradient");
    });
  }
  function cambiarTema() {
    const vivo = document.documentElement.classList.toggle("vivo");
    try { localStorage.setItem("tema", vivo ? "vivo" : "suave"); } catch (e) { /* sin almacenamiento */ }
    aplicarFondos();
    Reveal.sync();
    const s = Reveal.getCurrentSlide();
    if (s) graficas(s, false);
  }
  aplicarFondos();

  // ------------------------------------------------------------ Reveal
  Reveal.initialize({
    keyboard: { 84: () => cambiarTema() },
    hash: true,
    width: 1600,
    height: 900,
    margin: 0.035,
    minScale: 0.2,
    maxScale: 2.2,
    center: false,
    controls: false,
    progress: true,
    slideNumber: "c/t",
    transition: "fade",
    transitionSpeed: "default",
    backgroundTransition: "fade",
    pdfMaxPagesPerSlide: 1,
    pdfSeparateFragments: false,
    plugins: [RevealNotes]
  });

  // ------------------------------------------------------------ helpers
  function contadores(slide, animar) {
    slide.querySelectorAll("[data-count]").forEach(el => {
      const fin = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.dec || "0", 10);
      const fmt = v => (dec ? v.toFixed(dec) : nf.format(Math.round(v)));
      if (!animar) { el.textContent = fmt(fin); return; }
      const o = { v: 0 };
      gsap.killTweensOf(o);
      gsap.to(o, { v: fin, duration: 1.6, ease: "power2.out", delay: 0.25, onUpdate: () => (el.textContent = fmt(o.v)) });
    });
  }

  function graficas(slide, animar) {
    slide.querySelectorAll("[data-chart]").forEach(el => {
      const fn = window.CHARTS[el.dataset.chart];
      if (fn) fn(el, animar);
    });
  }

  function medidores(slide, animar) {
    slide.querySelectorAll(".meter i").forEach((i, k) => {
      if (!animar) { i.style.transition = "none"; i.style.width = i.dataset.w + "%"; return; }
      i.style.width = "0";
      setTimeout(() => (i.style.width = i.dataset.w + "%"), 400 + k * 25);
    });
  }

  function videos(slide) {
    document.querySelectorAll(".reveal video").forEach(v => { if (!slide.contains(v)) v.pause(); });
    slide.querySelectorAll("video").forEach(v => {
      try { v.currentTime = 0; } catch (e) { /* aún sin metadatos */ }
      clearTimeout(v._t);
      v._t = setTimeout(() => v.play().catch(() => {}), 550);
    });
  }

  function entrada(slide) {
    const els = slide.querySelectorAll("[data-a]");
    gsap.killTweensOf(els);
    gsap.fromTo(els, { opacity: 0, y: 28, filter: "blur(6px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out", stagger: 0.075, delay: 0.12, clearProps: "filter,transform" });
    const num = slide.querySelector(".sep-num");
    if (num) gsap.fromTo(num, { opacity: 0, scale: 0.86, yPercent: -52 }, { opacity: 1, scale: 1, yPercent: -52, duration: 1.2, ease: "expo.out" });
  }

  function alEntrar(slide) {
    if (!slide) return;
    if (ESTATICO) { contadores(slide, false); graficas(slide, false); medidores(slide, false); return; }
    entrada(slide);
    contadores(slide, true);
    graficas(slide, true);
    medidores(slide, true);
    videos(slide);
  }

  // ------------------------------------------------------------ modo impresión (PDF)
  function prepararImpresion() {
    document.querySelectorAll(".reveal video").forEach(v => {
      const img = document.createElement("img");
      img.src = v.dataset.poster;
      img.className = "poster";
      v.replaceWith(img);
    });
    document.querySelectorAll(".reveal .slides > section").forEach(s => {
      contadores(s, false);
      medidores(s, false);
    });
  }

  Reveal.on("ready", e => {
    if (window.renderMathInElement) {
      renderMathInElement(document.body, { delimiters: [{ left: "\\(", right: "\\)", display: false }, { left: "\\[", right: "\\]", display: true }], throwOnError: false });
    }
    if (ESTATICO) prepararImpresion();
    if (PRINT) {
      prepararImpresion();
      // las gráficas se dibujan cuando el layout de impresión ya está listo
      setTimeout(() => document.querySelectorAll(".reveal .slides > section").forEach(s => graficas(s, false)), 400);
      return;
    }
    alEntrar(e.currentSlide);
  });
  Reveal.on("slidechanged", e => { if (!PRINT) alEntrar(e.currentSlide); });
  // en impresión, redibujar cuando Reveal termina de acomodar las páginas
  Reveal.on("pdf-ready", () => document.querySelectorAll(".reveal .slides section").forEach(s => graficas(s, false)));

  // ------------------------------------------------------------ interacciones
  document.querySelectorAll(".screen .replay").forEach(b => b.addEventListener("click", ev => {
    ev.stopPropagation();
    const v = b.parentElement.querySelector("video");
    if (v) { v.currentTime = 0; v.play(); }
  }));

  const segT = document.getElementById("seg-temporal");
  if (segT) segT.addEventListener("click", ev => {
    const b = ev.target.closest("button");
    if (!b) return;
    segT.querySelectorAll("button").forEach(x => x.classList.toggle("on", x === b));
    window.CHARTS.temporal(document.querySelector('[data-chart="temporal"]'), true, b.dataset.m);
  });

  document.getElementById("nav-prev").onclick = () => Reveal.prev();
  document.getElementById("nav-next").onclick = () => Reveal.next();
  document.getElementById("nav-over").onclick = () => Reveal.toggleOverview();
  document.getElementById("nav-tema").onclick = () => cambiarTema();
  document.getElementById("nav-full").onclick = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  // ------------------------------------------------------------ simulador
  const S = D.simulador;
  const p0 = (S.totalOfertas - S.ofertasSinRedes) / S.totalOfertas; // 59.9 % hoy
  const est = { redes: 60, pagar: false, inact: false, h: 1 };
  const vistos = { vistas: 0, pago: 0, inact: 0 };
  const $ = id => document.getElementById(id);

  function calcular() {
    // el control va de 60 % (situación actual = p0) a 100 %
    const p = p0 + ((est.redes - 60) / 40) * (1 - p0);
    const extra = S.ofertasSinRedes * ((p - p0) / (1 - p0)) * (S.vistaRedes - S.vistaSinRedes);
    const tasa = p * S.vistaRedes + (1 - p) * S.vistaSinRedes;
    return {
      vistas: extra * est.h,
      tasa,
      pago: (est.pagar ? S.recompensaSinVer : 0) * est.h,
      inact: (est.inact ? S.enviosInactivos : 0) * est.h
    };
  }

  function pintar() {
    const r = calcular();
    const rng = $("sim-redes");
    rng.style.setProperty("--p", ((est.redes - 60) / 40) * 100 + "%");
    $("sim-redes-v").textContent = est.redes + " %";
    const anim = (k, fin, fmt) => gsap.to(vistos, { [k]: fin, duration: 0.9, ease: "power3.out", onUpdate: () => ($("r-" + k).textContent = fmt(vistos[k])) });
    anim("vistas", r.vistas, v => "+" + nf.format(Math.round(v)));
    anim("pago", r.pago, v => (v >= 1e6 ? "$" + (v / 1e6).toFixed(2) + " M" : "$" + nf.format(Math.round(v))));
    anim("inact", r.inact, v => nf.format(Math.round(v)));
    $("g-vistas").style.width = (r.vistas / (13461 * est.h)) * 100 + "%";
    $("g-pago").style.width = est.pagar ? "100%" : "0%";
    $("g-inact").style.width = est.inact ? "100%" : "0%";
    $("d-vistas").textContent = `${Math.round(r.tasa * 100)} % de las ofertas se verían`;
    $("d-pago").textContent = est.pagar ? "100 % de lo pagado tendría efecto" : "70 % de lo pagado tiene efecto hoy";
    $("d-inact").textContent = est.inact ? "sin perder ventas (0 % respondía)" : "hoy se les envía igual que a todos";
    [["sim-pagar", est.pagar], ["sim-inact", est.inact]].forEach(([id, on]) => { $(id).classList.toggle("on", on); $(id).setAttribute("aria-checked", on); });
    document.querySelectorAll("#sim-horiz button").forEach(b => b.classList.toggle("on", +b.dataset.h === est.h));
  }

  if ($("sim-redes")) {
    $("sim-redes").addEventListener("input", e => { est.redes = +e.target.value; pintar(); });
    const toggle = (id, k) => {
      const el = $(id);
      const fn = () => { est[k] = !est[k]; pintar(); };
      el.addEventListener("click", fn);
      el.addEventListener("keydown", e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); e.stopPropagation(); fn(); } });
    };
    toggle("sim-pagar", "pagar");
    toggle("sim-inact", "inact");
    $("sim-horiz").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { est.h = +b.dataset.h; pintar(); } });
    $("sim-todo").addEventListener("click", () => {
      const o = { r: est.redes };
      gsap.to(o, { r: 100, duration: 1.4, ease: "power2.inOut", onUpdate: () => { est.redes = Math.round(o.r); $("sim-redes").value = est.redes; pintar(); } });
      setTimeout(() => { est.pagar = true; pintar(); }, 900);
      setTimeout(() => { est.inact = true; pintar(); }, 1500);
    });
    $("sim-reset").addEventListener("click", () => { Object.assign(est, { redes: 60, pagar: false, inact: false, h: 1 }); $("sim-redes").value = 60; pintar(); });
    // evitar que las flechas del slider cambien de lámina
    $("sim-redes").addEventListener("keydown", e => e.stopPropagation());
    pintar();
  }
})();
