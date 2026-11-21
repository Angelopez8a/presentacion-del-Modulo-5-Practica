/* Gráficas D3 animadas. Cada función recibe el contenedor y si debe animar. */
(function () {
  const D = window.DATA;
  const C = D.colores;
  const INK = "#16302A", INK2 = "#44574F", INK3 = "#6F807A", GRID = "#CBD5D0", GREEN = "#00704A", LOSS = "#C8553D";
  const corto = {
    "Promo-sensibles": "Promo-sensibles", "Premium sin oferta": "Premium sin oferta", "Frecuentes de ticket bajo": "Frecuentes ticket bajo",
    "Nuevos de bajo gasto": "Nuevos bajo gasto", "Inactivos": "Inactivos", "Sin perfil": "Sin perfil"
  };
  const mini = { "Promo-sensibles": "Promo-sens.", "Premium sin oferta": "Premium", "Frecuentes de ticket bajo": "Frecuentes",
    "Nuevos de bajo gasto": "Nuevos", "Inactivos": "Inactivos", "Sin perfil": "Sin perfil" };
  const verdes = d3.interpolateRgb("#EEF4F0", "#00543A");
  const tip = () => document.getElementById("tip");

  function lienzo(el, defW, defH) {
    el.innerHTML = "";
    const W = el.clientWidth || defW, H = el.clientHeight || defH;
    const svg = d3.select(el).append("svg").attr("viewBox", `0 0 ${W} ${H}`).attr("preserveAspectRatio", "xMidYMid meet");
    return { svg, W, H };
  }
  const T = (anim, ms) => (anim ? ms : 0);

  function mostrarTip(html, ev) {
    const t = tip();
    t.innerHTML = html;
    t.style.opacity = 1;
    t.style.left = ev.clientX + 16 + "px";
    t.style.top = ev.clientY + 16 + "px";
  }
  function ocultarTip() { tip().style.opacity = 0; }

  // ------------------------------------------------------------ línea de tiempo de envíos
  function timeline(el, anim) {
    const { svg, W, H } = lienzo(el, 1400, 96);
    const m = { l: 20, r: 20 };
    const x = d3.scaleLinear().domain([0, 30]).range([m.l, W - m.r]);
    const y = H / 2 + 4;
    svg.append("line").attr("x1", x(0)).attr("x2", x(30)).attr("y1", y).attr("y2", y).attr("stroke", GRID).attr("stroke-width", 6).attr("stroke-linecap", "round");
    const prog = svg.append("line").attr("x1", x(0)).attr("x2", x(0)).attr("y1", y).attr("y2", y).attr("stroke", GREEN).attr("stroke-width", 6).attr("stroke-linecap", "round");
    prog.transition().duration(T(anim, 1800)).ease(d3.easeCubicOut).attr("x2", x(30));
    [0, 5, 10, 15, 20, 25, 30].forEach(d => svg.append("text").attr("x", x(d)).attr("y", y + 32).attr("text-anchor", "middle").attr("font-size", 14).attr("fill", INK3).text(`día ${d}`));
    const g = svg.selectAll("g.e").data(D.envios).join("g").attr("transform", d => `translate(${x(d)},${y})`);
    g.append("circle").attr("r", 0).style("fill", "var(--bg, #E6EBE8)").attr("stroke", GREEN).attr("stroke-width", 3)
      .style("filter", "drop-shadow(3px 3px 4px rgba(150,168,159,.6)) drop-shadow(-3px -3px 4px #fff)")
      .transition().delay((d, i) => T(anim, 200 + i * 220)).duration(T(anim, 450)).ease(d3.easeBackOut).attr("r", 15);
    g.append("text").attr("text-anchor", "middle").attr("dy", 5).attr("font-size", 14).attr("font-weight", 800).attr("fill", GREEN).text((d, i) => i + 1)
      .attr("opacity", 0).transition().delay((d, i) => T(anim, 350 + i * 220)).attr("opacity", 1);
    svg.append("text").attr("x", x(0)).attr("y", y - 26).attr("font-size", 15).attr("font-weight", 800).attr("fill", INK).text("Envíos de ofertas");
  }

  // ------------------------------------------------------------ ticket por ingreso
  function ingreso(el, anim) {
    const { svg, W, H } = lienzo(el, 700, 420);
    const m = { t: 46, r: 6, b: 44, l: 6 };
    const x = d3.scaleBand().domain(D.ingreso.map(d => d.rango)).range([m.l, W - m.r]).padding(0.28);
    const y = d3.scaleLinear().domain([0, 32]).range([H - m.b, m.t]);
    svg.append("line").attr("x1", m.l).attr("x2", W - m.r).attr("y1", y(0)).attr("y2", y(0)).attr("stroke", GRID).attr("stroke-width", 2);
    const g = svg.selectAll("g.b").data(D.ingreso).join("g");
    g.append("rect").attr("x", d => x(d.rango)).attr("width", x.bandwidth()).attr("rx", 14)
      .attr("fill", (d, i) => d3.interpolateRgb("#8FC3A9", GREEN)(i / 3))
      .attr("y", y(0)).attr("height", 0)
      .transition().delay((d, i) => T(anim, 250 + i * 140)).duration(T(anim, 900)).ease(d3.easeCubicOut)
      .attr("y", d => y(d.ticket)).attr("height", d => y(0) - y(d.ticket));
    g.append("text").attr("x", d => x(d.rango) + x.bandwidth() / 2).attr("text-anchor", "middle").attr("font-size", 30).attr("font-weight", 800)
      .attr("font-family", "Fraunces, serif").attr("fill", INK).attr("y", y(0) - 10).attr("opacity", 0).text(d => `$${d.ticket}`)
      .transition().delay((d, i) => T(anim, 250 + i * 140)).duration(T(anim, 900)).ease(d3.easeCubicOut).attr("y", d => y(d.ticket) - 12).attr("opacity", 1);
    g.append("text").attr("x", d => x(d.rango) + x.bandwidth() / 2).attr("y", y(0) - 16).attr("text-anchor", "middle").attr("font-size", 15).attr("font-weight", 700)
      .attr("fill", "#fff").text(d => `${d.visitas} visitas/mes`).attr("opacity", 0).transition().delay(T(anim, 1300)).attr("opacity", 1);
    g.append("text").attr("x", d => x(d.rango) + x.bandwidth() / 2).attr("y", H - 14).attr("text-anchor", "middle").attr("font-size", 17).attr("font-weight", 700).attr("fill", INK2).text(d => d.rango);
  }

  // ------------------------------------------------------------ barras horizontales por segmento (genérico)
  function barrasSeg(el, filas, opts, anim) {
    const { svg, W, H } = lienzo(el, 500, 380);
    const lw = opts.labelW || 200, vw = opts.valueW || 70;
    const y = d3.scaleBand().domain(filas.map(f => f.nombre)).range([4, H - 4]).padding(0.28);
    const x = d3.scaleLinear().domain([0, opts.max]).range([0, W - lw - vw]);
    const g = svg.selectAll("g.f").data(filas, f => f.nombre).join("g").attr("transform", f => `translate(0,${y(f.nombre)})`);
    g.append("text").attr("x", lw - 14).attr("y", y.bandwidth() / 2).attr("dy", 6).attr("text-anchor", "end").attr("font-size", 16).attr("font-weight", 700)
      .attr("fill", f => C[f.nombre] === "#A9A9A9" ? "#7E7E7E" : C[f.nombre]).text(f => corto[f.nombre]);
    g.append("rect").attr("x", lw).attr("y", 0).attr("height", y.bandwidth()).attr("rx", 8).attr("width", x(opts.max)).style("fill", "var(--track, #DCE3DF)");
    const bar = g.append("rect").attr("class", "val").attr("x", lw).attr("y", 0).attr("height", y.bandwidth()).attr("rx", 8).attr("fill", f => C[f.nombre]).attr("width", 0);
    bar.transition().delay((f, i) => T(anim, 200 + i * 90)).duration(T(anim, 900)).ease(d3.easeCubicOut).attr("width", f => (f.v == null ? 0 : x(f.v)));
    g.append("text").attr("class", "vt").attr("x", f => lw + (f.v == null ? 0 : x(f.v)) + 10).attr("y", y.bandwidth() / 2).attr("dy", 6).attr("font-size", 17).attr("font-weight", 800).attr("fill", INK)
      .text(f => opts.fmt(f)).attr("opacity", 0).transition().delay((f, i) => T(anim, 700 + i * 90)).attr("opacity", 1);
    return { svg, x, y, lw };
  }

  const TEMPORAL_TIT = {
    dejar: "Probabilidad de dejar de comprar en los siguientes 6 días",
    alto: "Si hoy gasta Alto, probabilidad de seguir en Alto",
    regresa: "Si hoy está inactivo, probabilidad de volver a comprar"
  };
  let metricaTemporal = "dejar";
  function temporal(el, anim, metrica) {
    if (metrica) metricaTemporal = metrica;
    const filas = D.segmentos.map(s => ({ nombre: s.nombre, v: D.temporal[s.nombre][metricaTemporal] }));
    barrasSeg(el, filas, { max: 100, labelW: 200, valueW: 64, fmt: f => (f.v == null ? "—" : `${f.v} %`) }, anim);
    const t = document.getElementById("temporal-titulo");
    if (t) t.textContent = TEMPORAL_TIT[metricaTemporal];
  }

  function fuga(el, anim) {
    const filas = D.fuga.map(f => ({ nombre: f.nombre, v: f.pct, monto: f.monto }));
    barrasSeg(el, filas, { max: 60, labelW: 200, valueW: 140, fmt: f => `${f.v} % · $${(f.monto / 1000).toFixed(1)} mil` }, anim);
  }

  // ------------------------------------------------------------ ranking de ofertas + costo por respuesta
  function ranking(el, anim) {
    const { svg, W, H } = lienzo(el, 1400, 520);
    const lw = 330, top = 34;
    const p1w = (W - lw) * 0.52, gap = 70, p2x = lw + p1w + gap, p2w = W - p2x - 60;
    const y = d3.scaleBand().domain(D.ofertas.map(o => o.id)).range([top, H - 6]).padding(0.26);
    const x1 = d3.scaleLinear().domain([0, 70]).range([0, p1w - 60]);
    const x2 = d3.scaleLinear().domain([0, 15]).range([0, p2w]);
    svg.append("text").attr("x", lw).attr("y", 16).attr("font-size", 16).attr("font-weight", 800).attr("fill", INK).text("% de ofertas que funcionaron");
    svg.append("text").attr("x", p2x).attr("y", 16).attr("font-size", 16).attr("font-weight", 800).attr("fill", INK).text("Costo en recompensas por cada respuesta (USD)");
    [0, 5, 10, 15].forEach(v => {
      svg.append("line").attr("x1", p2x + x2(v)).attr("x2", p2x + x2(v)).attr("y1", top - 4).attr("y2", H - 6).attr("stroke", GRID).attr("stroke-dasharray", "3 5");
      svg.append("text").attr("x", p2x + x2(v)).attr("y", H + 14).attr("text-anchor", "middle").attr("font-size", 13).attr("fill", INK3).text(`$${v}`);
    });
    const g = svg.selectAll("g.o").data(D.ofertas).join("g").attr("transform", o => `translate(0,${y(o.id)})`);
    const bh = y.bandwidth();
    g.append("text").attr("x", lw - 16).attr("y", bh / 2).attr("dy", 6).attr("text-anchor", "end").attr("font-size", 16).attr("font-weight", 600).attr("fill", INK).text(o => o.nombre);
    g.append("rect").attr("x", lw).attr("height", bh).attr("rx", 7).attr("fill", o => (o.redes ? GREEN : "#BDC6C1")).attr("width", 0)
      .transition().delay((o, i) => T(anim, 150 + i * 70)).duration(T(anim, 800)).ease(d3.easeCubicOut).attr("width", o => x1(o.funciono));
    g.append("text").attr("x", o => lw + x1(o.funciono) + 10).attr("y", bh / 2).attr("dy", 6).attr("font-size", 16).attr("font-weight", 800).attr("fill", INK)
      .text(o => `${o.funciono} %`).attr("opacity", 0).transition().delay((o, i) => T(anim, 650 + i * 70)).attr("opacity", 1);
    // costo
    const caro = o => o.costo >= 10;
    g.append("line").attr("x1", p2x).attr("x2", p2x).attr("y1", bh / 2).attr("y2", bh / 2).attr("stroke", o => (caro(o) ? LOSS : "#8FB9A3")).attr("stroke-width", 4).attr("stroke-linecap", "round")
      .transition().delay((o, i) => T(anim, 900 + i * 70)).duration(T(anim, 700)).attr("x2", o => p2x + x2(o.costo));
    g.filter(o => o.costo > 0).append("circle").attr("cx", p2x).attr("cy", bh / 2).attr("r", 9).attr("fill", o => (caro(o) ? LOSS : GREEN))
      .transition().delay((o, i) => T(anim, 900 + i * 70)).duration(T(anim, 700)).attr("cx", o => p2x + x2(o.costo));
    g.append("text").attr("x", o => (o.costo > 0 ? p2x + x2(o.costo) + 16 : p2x + 8)).attr("y", bh / 2).attr("dy", 6).attr("font-size", 15).attr("font-weight", o => (o.costo > 0 ? 800 : 600))
      .attr("fill", o => (o.costo === 0 ? INK3 : caro(o) ? LOSS : GREEN)).text(o => (o.costo > 0 ? `$${o.costo.toFixed(2)}` : "sin recompensa"))
      .attr("opacity", 0).transition().delay((o, i) => T(anim, 1400 + i * 70)).attr("opacity", 1);
  }

  // ------------------------------------------------------------ mapa de calor segmento × oferta
  function heat(el, anim) {
    const { svg, W, H } = lienzo(el, 1080, 520);
    const lw = 210, th = 66;
    const segs = D.segmentos.map(s => s.nombre);
    const x = d3.scaleBand().domain(D.ofertas.map(o => o.id)).range([lw, W]).padding(0.07);
    const y = d3.scaleBand().domain(segs).range([th, H]).padding(0.07);
    // encabezados de columna en 2 líneas
    const hd = svg.selectAll("g.h").data(D.ofertas).join("g").attr("transform", o => `translate(${x(o.id) + x.bandwidth() / 2},0)`);
    const partes = o => { const [izq, dias] = o.corto.split(" · "); const [tipo, ...m] = izq.split(" "); return [tipo === "Desc" ? "Desc." : tipo === "Informativa" ? "Info." : tipo, m.join(" ") || "mensaje", dias.replace("d", " días") + (o.redes ? " · redes" : "")]; };
    hd.append("text").attr("y", 16).attr("text-anchor", "middle").attr("font-size", 13.5).attr("font-weight", 800).attr("fill", o => (o.redes ? GREEN : INK3)).text(o => partes(o)[0]);
    hd.append("text").attr("y", 34).attr("text-anchor", "middle").attr("font-size", 13.5).attr("font-weight", 800).attr("fill", INK).text(o => partes(o)[1]);
    hd.append("text").attr("y", 51).attr("text-anchor", "middle").attr("font-size", 11.5).attr("font-weight", 600).attr("fill", INK3).text(o => partes(o)[2]);
    svg.selectAll("text.r").data(segs).join("text").attr("x", lw - 14).attr("y", s => y(s) + y.bandwidth() / 2).attr("dy", 6).attr("text-anchor", "end")
      .attr("font-size", 16).attr("font-weight", 800).attr("fill", s => (C[s] === "#A9A9A9" ? "#7E7E7E" : C[s])).text(s => corto[s]);
    const celdas = [];
    segs.forEach(s => D.heat[s].forEach((v, j) => celdas.push({ s, o: D.ofertas[j], v, j })));
    const best = {};
    segs.forEach(s => { const a = D.heat[s]; best[s] = a.indexOf(Math.max(...a)); });
    const g = svg.selectAll("g.c").data(celdas).join("g").attr("transform", d => `translate(${x(d.o.id)},${y(d.s)})`);
    g.append("rect").attr("width", x.bandwidth()).attr("height", y.bandwidth()).attr("rx", 10).attr("fill", d => verdes(Math.min(d.v, 90) / 90))
      .attr("opacity", 0).transition().delay(d => T(anim, 120 + d.j * 60 + segs.indexOf(d.s) * 25)).duration(T(anim, 450)).attr("opacity", 1);
    g.append("text").attr("x", x.bandwidth() / 2).attr("y", y.bandwidth() / 2).attr("dy", 6).attr("text-anchor", "middle").attr("font-size", 17).attr("font-weight", 800)
      .attr("fill", d => (d.v >= 50 ? "#fff" : INK)).text(d => `${d.v}%`)
      .attr("opacity", 0).transition().delay(d => T(anim, 300 + d.j * 60 + segs.indexOf(d.s) * 25)).attr("opacity", 1);
    g.filter(d => best[d.s] === d.j && d.v > 5).append("rect").attr("x", -3).attr("y", -3).attr("width", x.bandwidth() + 6).attr("height", y.bandwidth() + 6).attr("rx", 12)
      .attr("fill", "none").attr("stroke", "#C77F12").attr("stroke-width", 3.5).attr("opacity", 0).transition().delay(T(anim, 1300)).duration(T(anim, 400)).attr("opacity", 1);
    g.filter(d => best[d.s] === d.j && d.v > 5).append("text").attr("x", x.bandwidth() - 12).attr("y", 18).attr("text-anchor", "middle").attr("font-size", 15).attr("fill", "#F6C66B").text("★")
      .attr("opacity", 0).transition().delay(T(anim, 1400)).attr("opacity", 1);
    g.on("mousemove", (ev, d) => mostrarTip(`<div style="color:${C[d.s]};font-weight:800">${d.s}</div>${d.o.nombre}<br><b>${d.v} %</b> de las ofertas funcionaron`, ev))
      .on("mouseleave", ocultarTip);
  }

  // ------------------------------------------------------------ mezcla recibida por segmento
  function mezcla(el, anim) {
    const { svg, W, H } = lienzo(el, 290, 300);
    const lw = 92;
    const segs = D.segmentos.map(s => s.nombre);
    const y = d3.scaleBand().domain(segs).range([2, H - 2]).padding(0.3);
    const x = d3.scaleLinear().domain([0, 100]).range([lw, W]);
    const cols = ["#5E7F73", "#93B3A5", "#C9D8D0"];
    svg.selectAll("text.l").data(segs).join("text").attr("x", lw - 8).attr("y", s => y(s) + y.bandwidth() / 2).attr("dy", 5).attr("text-anchor", "end")
      .attr("font-size", 13).attr("font-weight", 700).attr("fill", s => (C[s] === "#A9A9A9" ? "#7E7E7E" : C[s])).text(s => mini[s]);
    segs.forEach((s, i) => {
      let acc = 0;
      D.mezcla[s].forEach((v, k) => {
        svg.append("rect").attr("x", x(acc)).attr("y", y(s)).attr("height", y.bandwidth()).attr("width", 0).attr("fill", cols[k])
          .attr("rx", 3).transition().delay(T(anim, 300 + i * 80 + k * 120)).duration(T(anim, 500)).attr("width", x(acc + v) - x(acc) - 1.5);
        if (k < 2) svg.append("text").attr("x", x(acc) + (x(acc + v) - x(acc)) / 2).attr("y", y(s) + y.bandwidth() / 2).attr("dy", 4).attr("text-anchor", "middle")
          .attr("font-size", 11).attr("font-weight", 800).attr("fill", "#fff").text(v).attr("opacity", 0).transition().delay(T(anim, 900 + i * 80)).attr("opacity", 1);
        acc += v;
      });
    });
  }

  // ------------------------------------------------------------ matrices de transición
  function matrizCalor(el, anim, filas, valores, ejeX, ejeY, defW, defH) {
    const { svg, W, H } = lienzo(el, defW, defH);
    const lw = 128, th = 34, bb = 38;
    const x = d3.scaleBand().domain(filas).range([lw, W]).padding(0.06);
    const y = d3.scaleBand().domain(filas).range([th, H - bb]).padding(0.06);
    svg.selectAll("text.cx").data(filas).join("text").attr("x", f => x(f) + x.bandwidth() / 2).attr("y", th - 10).attr("text-anchor", "middle").attr("font-size", Math.min(15, x.bandwidth() / 6.4)).attr("font-weight", 800).attr("fill", INK2).text(f => f);
    svg.selectAll("text.ry").data(filas).join("text").attr("x", lw - 10).attr("y", f => y(f) + y.bandwidth() / 2).attr("dy", 5).attr("text-anchor", "end").attr("font-size", 15).attr("font-weight", 800).attr("fill", INK2).text(f => f);
    const celdas = [];
    valores.forEach((r, i) => r.forEach((v, j) => celdas.push({ i, j, v })));
    const g = svg.selectAll("g.c").data(celdas).join("g").attr("transform", d => `translate(${x(filas[d.j])},${y(filas[d.i])})`);
    g.append("rect").attr("width", x.bandwidth()).attr("height", y.bandwidth()).attr("rx", 12).attr("fill", d => verdes(d.v / 75))
      .attr("stroke", d => (d.i === d.j ? "#C77F12" : "none")).attr("stroke-width", 3)
      .attr("opacity", 0).transition().delay(d => T(anim, 150 + (d.i + d.j) * 90)).duration(T(anim, 450)).attr("opacity", 1);
    g.append("text").attr("x", x.bandwidth() / 2).attr("y", y.bandwidth() / 2).attr("dy", 8).attr("text-anchor", "middle").attr("font-size", 24).attr("font-weight", 800)
      .attr("font-family", "Fraunces, serif").attr("fill", d => (d.v >= 40 ? "#fff" : INK)).text(d => `${d.v}%`)
      .attr("opacity", 0).transition().delay(d => T(anim, 300 + (d.i + d.j) * 90)).attr("opacity", 1);
    svg.append("text").attr("x", lw + (W - lw) / 2).attr("y", H - 8).attr("text-anchor", "middle").attr("font-size", 14).attr("fill", INK3).text(ejeX);
    svg.append("text").attr("transform", `translate(14,${th + (H - bb - th) / 2}) rotate(-90)`).attr("text-anchor", "middle").attr("font-size", 14).attr("fill", INK3).text(ejeY);
  }
  function markov(el, anim) { matrizCalor(el, anim, D.estados, D.matriz, "Estado en los siguientes 6 días →", "Estado actual", 600, 520); }
  function semanal(el, anim) { matrizCalor(el, anim, D.matrizSemanal.estados, D.matrizSemanal.valores, "Semana siguiente →", "Semana actual", 380, 380); }

  window.CHARTS = { timeline, ingreso, temporal, fuga, ranking, heat, mezcla, markov, semanal };
})();
