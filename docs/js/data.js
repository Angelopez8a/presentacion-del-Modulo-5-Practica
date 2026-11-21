/* Única fuente de números de la presentación.
   Todo sale del notebook LOPEZ_OCHOA_ANGEL_M5_P1.ipynb (ver Analisis_Starbucks_Practica4.md). */
window.DATA = {
  colores: {
    "Promo-sensibles": "#00704A",
    "Premium sin oferta": "#8E5A9E",
    "Frecuentes de ticket bajo": "#E39B2D",
    "Nuevos de bajo gasto": "#4A90C2",
    "Inactivos": "#6E6E6E",
    "Sin perfil": "#A9A9A9"
  },

  // % clientes, % ventas, gasto/mes, ticket, visitas/mes, % responde, % vistas
  segmentos: [
    { nombre: "Promo-sensibles", alias: "La fan de las ofertas", clientes: 4650, pctCli: 27, pctVen: 52, gasto: 197, ticket: 20.4, visitas: 9.9, responde: 77, vista: 92,
      edad: 57, ingreso: 69, antig: "1.6 años", mujeres: 49, desc: "Ve casi todo lo que le enviamos y responde a 3 de cada 4 ofertas." },
    { nombre: "Premium sin oferta", alias: "Paga por calidad", clientes: 3451, pctCli: 20, pctVen: 27, gasto: 138, ticket: 26.3, visitas: 5.1, responde: 34, vista: 65,
      edad: 64, ingreso: 89, antig: "1.2 años", mujeres: 59, desc: "El de mayor ingreso y ticket más alto; compra por su cuenta." },
    { nombre: "Frecuentes de ticket bajo", alias: "El de todos los días", clientes: 2861, pctCli: 17, pctVen: 15, gasto: 93, ticket: 7.0, visitas: 14.3, responde: 38, vista: 68,
      edad: 46, ingreso: 49, antig: "2.6 años", mujeres: 31, desc: "El más antiguo: viene 14 veces al mes, pero gasta $7 por visita." },
    { nombre: "Nuevos de bajo gasto", alias: "El recién llegado", clientes: 3467, pctCli: 20, pctVen: 4, gasto: 22, ticket: 4.4, visitas: 5.5, responde: 11, vista: 63,
      edad: 48, ingreso: 50, antig: "7 meses", mujeres: 23, desc: "Lleva 7 meses; gasta poco y casi no responde a las ofertas." },
    { nombre: "Inactivos", alias: "Se registró y desapareció", clientes: 396, pctCli: 2, pctVen: 0, gasto: 0.2, ticket: 0.2, visitas: 0.2, responde: 0, vista: 71,
      edad: 57, ingreso: 70, antig: "7 meses", mujeres: 39, desc: "Ve las ofertas, pero no compra: 0 % de respuesta." },
    { nombre: "Sin perfil", alias: "El anónimo", clientes: 2175, pctCli: 13, pctVen: 2, gasto: 19, ticket: 2.6, visitas: 6.9, responde: 12, vista: 79,
      edad: null, ingreso: null, antig: "1.3 años", mujeres: null, desc: "Sin edad, género ni ingreso: imposible de personalizar." }
  ],

  // Comportamiento en el tiempo (periodos de 6 días)
  temporal: {
    "Promo-sensibles":           { dejar: 13, alto: 55, regresa: 86 },
    "Premium sin oferta":        { dejar: 35, alto: 39, regresa: 64 },
    "Frecuentes de ticket bajo": { dejar: 7,  alto: 40, regresa: 90 },
    "Nuevos de bajo gasto":      { dejar: 30, alto: 7,  regresa: 68 },
    "Inactivos":                 { dejar: 95, alto: null, regresa: 5 },
    "Sin perfil":                { dejar: 29, alto: 1,  regresa: 59 }
  },
  estados: ["Inactivo", "Bajo", "Medio", "Alto"],
  matriz: [[35, 25, 22, 18], [21, 57, 18, 4], [19, 18, 34, 29], [17, 4, 30, 48]],
  matrizSemanal: { estados: ["Sin compras", "Ocasional", "Frecuente"], valores: [[72, 21, 7], [34, 45, 21], [12, 26, 62]] },

  // Recompensa pagada sin que el cliente viera la oferta
  fuga: [
    { nombre: "Premium sin oferta", pct: 47, monto: 19724 },
    { nombre: "Nuevos de bajo gasto", pct: 39, monto: 3423 },
    { nombre: "Frecuentes de ticket bajo", pct: 38, monto: 10829 },
    { nombre: "Sin perfil", pct: 18, monto: 727 },
    { nombre: "Promo-sensibles", pct: 17, monto: 13513 }
  ],

  // 10 ofertas: % funcionó, costo por respuesta, recompensa pagada
  ofertas: [
    { id: "d10_2_10", nombre: "Descuento $2 al gastar $10 · 10 días", corto: "Desc $2/$10 · 10d", redes: true,  funciono: 60, costo: 2.29, pagado: 10460, tipo: "Descuento" },
    { id: "d7_3_7",   nombre: "Descuento $3 al gastar $7 · 7 días",   corto: "Desc $3/$7 · 7d",   redes: true,  funciono: 57, costo: 3.52, pagado: 15306, tipo: "Descuento" },
    { id: "i3",       nombre: "Informativa · 3 días",                 corto: "Informativa · 3d",  redes: true,  funciono: 48, costo: 0,    pagado: 0,     tipo: "Informativa" },
    { id: "b5_5",     nombre: "2x1 de $5 · 5 días",                   corto: "2x1 $5 · 5d",       redes: true,  funciono: 46, costo: 6.07, pagado: 21310, tipo: "2x1" },
    { id: "b10_5",    nombre: "2x1 de $10 · 5 días",                  corto: "2x1 $10 · 5d",      redes: true,  funciono: 36, costo: 12.04, pagado: 33010, tipo: "2x1" },
    { id: "b10_7",    nombre: "2x1 de $10 · 7 días",                  corto: "2x1 $10 · 7d",      redes: true,  funciono: 34, costo: 14.09, pagado: 36350, tipo: "2x1" },
    { id: "i4",       nombre: "Informativa · 4 días",                 corto: "Informativa · 4d",  redes: false, funciono: 30, costo: 0,    pagado: 0,     tipo: "Informativa" },
    { id: "d10_2_7",  nombre: "Descuento $2 al gastar $10 · 7 días",  corto: "Desc $2/$10 · 7d",  redes: false, funciono: 28, costo: 3.77, pagado: 7910,  tipo: "Descuento" },
    { id: "b5_7",     nombre: "2x1 de $5 · 7 días",                   corto: "2x1 $5 · 7d",       redes: false, funciono: 27, costo: 10.23, pagado: 21515, tipo: "2x1" },
    { id: "d20_5",    nombre: "Descuento $5 al gastar $20 · 10 días", corto: "Desc $5/$20 · 10d", redes: false, funciono: 17, costo: 12.71, pagado: 16565, tipo: "Descuento" }
  ],

  // % de ofertas que funcionaron: segmento × oferta (mismo orden que `ofertas`)
  heat: {
    "Promo-sensibles":           [87, 85, 58, 79, 78, 72, 57, 69, 69, 58],
    "Premium sin oferta":        [62, 54, 26, 47, 44, 34, 20, 21, 21, 11],
    "Frecuentes de ticket bajo": [79, 73, 77, 53, 26, 29, 29, 24, 20, 7],
    "Nuevos de bajo gasto":      [25, 28, 46, 18, 4, 5, 9, 5, 6, 1],
    "Inactivos":                 [0, 0, 2, 0, 0, 0, 1, 0, 0, 0],
    "Sin perfil":                [30, 26, 36, 16, 2, 3, 36, 8, 9, 2]
  },

  // Mezcla de ofertas recibida por segmento (%): 2x1, descuento, informativa
  mezcla: {
    "Promo-sensibles":           [41, 40, 19],
    "Premium sin oferta":        [39, 40, 21],
    "Frecuentes de ticket bajo": [40, 41, 19],
    "Nuevos de bajo gasto":      [39, 40, 21],
    "Inactivos":                 [38, 42, 20],
    "Sin perfil":                [40, 40, 20]
  },

  ingreso: [
    { rango: "$30–50 mil", ticket: 6, visitas: 10 },
    { rango: "$50–75 mil", ticket: 13, visitas: 9 },
    { rango: "$75–100 mil", ticket: 25, visitas: 6 },
    { rango: "$100 mil +", ticket: 30, visitas: 6 }
  ],

  k: [
    { k: 2, inercia: 87384, silueta: 0.259, db: 1.550 },
    { k: 3, inercia: 73624, silueta: 0.214, db: 1.631 },
    { k: 4, inercia: 64930, silueta: 0.201, db: 1.586 },
    { k: 5, inercia: 59451, silueta: 0.212, db: 1.458 },
    { k: 6, inercia: 54742, silueta: 0.202, db: 1.453 },
    { k: 7, inercia: 50536, silueta: 0.208, db: 1.413 },
    { k: 8, inercia: 47887, silueta: 0.190, db: 1.502 }
  ],

  envios: [0, 7, 14, 17, 21, 24],

  simulador: {
    ofertasSinRedes: 30594,
    totalOfertas: 76277,
    vistaRedes: 0.918,
    vistaSinRedes: 0.478,
    pctRedesActual: 60,
    recompensaSinVer: 48216,
    recompensaTotal: 162426,
    enviosInactivos: 1751
  }
};
