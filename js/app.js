/* =========================================================
   App: controla las pantallas y los botones
   ========================================================= */

/* Lo que sabemos de la zona elegida. Solo vive en memoria:
   al cerrar o recargar la página, se borra. */
var estado = {
  zona: null,        // { punto, zona, comunidad, distanciaKm, origen }
  condiciones: null  // ver js/condiciones.js
};

/* Si estás a más de esta distancia de la costa, te avisamos */
var DISTANCIA_AVISO_KM = 25;

/* ---------- Utilidades ---------- */
function $(id) { return document.getElementById(id); }

/* Qué botón de la barra inferior se ilumina en cada pantalla */
var PESTANA_DE_PANTALLA = {
  "pantalla-inicio": "inicio",
  "pantalla-manual": "zona",
  "pantalla-zona": "zona",
  "pantalla-condiciones": "zona",
  "pantalla-descubrir": "descubrir",
  "pantalla-mis": "mis",
  "pantalla-mas": "mas"
};

function mostrarPantalla(id) {
  var pantallas = document.querySelectorAll(".pantalla");
  for (var i = 0; i < pantallas.length; i++) {
    pantallas[i].hidden = pantallas[i].id !== id;
  }
  var pestana = PESTANA_DE_PANTALLA[id];
  var botones = document.querySelectorAll(".barra-inferior__boton");
  for (var j = 0; j < botones.length; j++) {
    if (botones[j].getAttribute("data-ir") === pestana) botones[j].setAttribute("aria-current", "page");
    else botones[j].removeAttribute("aria-current");
  }
  window.scrollTo(0, 0);
  var titulo = $(id).querySelector("h1, h2");
  if (titulo) titulo.focus({ preventScroll: true });
}

/* Barra inferior */
function irA(pestana) {
  if (pestana === "inicio") return mostrarPantalla("pantalla-inicio");
  if (pestana === "descubrir") return mostrarPantalla("pantalla-descubrir");
  if (pestana === "mis") return mostrarPantalla("pantalla-mis");
  if (pestana === "mas") return mostrarPantalla("pantalla-mas");
  if (pestana === "zona") {
    if (!estado.zona) return abrirEleccionManual();
    if (estado.condiciones) {
      mostrarPantalla("pantalla-condiciones");
    } else {
      abrirCondiciones();
    }
  }
}

/* Etiqueta de zona en la cabecera */
function actualizarChipZona() {
  var chip = $("chip-zona");
  if (!estado.zona) { chip.hidden = true; return; }
  $("chip-zona-texto").textContent = estado.zona.punto.n;
  chip.setAttribute("aria-label", "Zona: " + estado.zona.punto.n + ". Toca para cambiarla");
  chip.hidden = false;
}

function ponerEstado(elemento, texto, esError) {
  elemento.textContent = texto;
  elemento.classList.toggle("estado--error", !!esError);
}

/* ---------- Pantalla: zona detectada ---------- */
function mostrarZona(resultado) {
  estado.zona = resultado;
  estado.condiciones = null; // zona nueva: hay que volver a pedir las condiciones
  actualizarChipZona();

  $("zona-mar").textContent = ZONAS_MARINAS[resultado.zona];
  $("zona-comunidad").textContent = resultado.comunidad;

  var referencia = resultado.punto.n;
  if (resultado.origen === "gps") {
    referencia += " (a unos " + resultado.distanciaKm + " km)";
  }
  $("zona-referencia").textContent = referencia;

  var aviso = $("zona-aviso");
  if (resultado.origen === "gps" && resultado.distanciaKm > DISTANCIA_AVISO_KM) {
    aviso.textContent = "Parece que estás a unos " + resultado.distanciaKm +
      " km del mar. Hemos usado la costa más cercana. Si vas a pescar en otro sitio, elígelo a mano.";
    aviso.hidden = false;
  } else {
    aviso.hidden = true;
  }

  ponerEstado($("estado-continuar"), "");
  mostrarPantalla("pantalla-zona");
}

/* ---------- Pantalla: elegir a mano ---------- */
function crearBotonOpcion(textoPrincipal, textoSecundario, alPulsar) {
  var b = document.createElement("button");
  b.type = "button";
  b.className = "boton-opcion";
  b.setAttribute("aria-pressed", "false");
  b.appendChild(document.createTextNode(textoPrincipal));
  if (textoSecundario) {
    var s = document.createElement("small");
    s.textContent = textoSecundario;
    b.appendChild(s);
  }
  b.addEventListener("click", alPulsar);
  return b;
}

function pintarComunidades() {
  var lista = $("lista-comunidades");
  lista.innerHTML = "";
  COMUNIDADES.forEach(function (comunidad) {
    var boton = crearBotonOpcion(comunidad, null, function () {
      var botones = lista.querySelectorAll(".boton-opcion");
      for (var i = 0; i < botones.length; i++) botones[i].setAttribute("aria-pressed", "false");
      boton.setAttribute("aria-pressed", "true");
      pintarLocalidades(comunidad);
    });
    lista.appendChild(boton);
  });
}

function pintarLocalidades(comunidad) {
  var lista = $("lista-localidades");
  lista.innerHTML = "";
  PUNTOS_COSTA
    .filter(function (p) { return p.c === comunidad; })
    .forEach(function (p) {
      lista.appendChild(crearBotonOpcion(p.n, ZONAS_MARINAS[p.z], function () {
        mostrarZona({ punto: p, zona: p.z, comunidad: p.c, distanciaKm: 0, origen: "manual" });
      }));
    });
  var bloque = $("bloque-localidades");
  bloque.hidden = false;
  bloque.scrollIntoView({ behavior: "smooth", block: "start" });
}

function abrirEleccionManual() {
  pintarComunidades();
  $("bloque-localidades").hidden = true;
  mostrarPantalla("pantalla-manual");
}

/* ---------- Botón "Usar mi ubicación" ---------- */
var MENSAJES_ERROR = {
  "denegado": "No has dado permiso para usar tu ubicación. No pasa nada: elige tu zona a mano.",
  "sin-senal": "No hemos podido saber dónde estás. Prueba de nuevo o elige tu zona a mano.",
  "tiempo": "La ubicación ha tardado demasiado. Prueba de nuevo o elige tu zona a mano.",
  "no-disponible": "Tu navegador no permite usar la ubicación. Elige tu zona a mano.",
  "desconocido": "Algo ha fallado al buscar tu ubicación. Elige tu zona a mano."
};

function alPulsarUbicacion() {
  var boton = $("btn-ubicacion");
  var mensaje = $("estado-ubicacion");
  boton.disabled = true;
  ponerEstado(mensaje, "Buscando tu ubicación… Si el navegador te pregunta, pulsa «Permitir».");

  pedirUbicacion(function (error, resultado) {
    boton.disabled = false;
    if (error) {
      ponerEstado(mensaje, MENSAJES_ERROR[error.tipo] || MENSAJES_ERROR.desconocido, true);
      $("btn-manual").focus();
      return;
    }
    ponerEstado(mensaje, "");
    mostrarZona(resultado);
  });
}

/* ---------- Pantalla: condiciones del mar ---------- */
function formatear(n, decimales) {
  return n.toLocaleString("es-ES", { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
}

function abrirCondiciones() {
  // Titular: "L'ESCALA HOY". Quitamos lo que va entre paréntesis para que quepa.
  $("cond-titulo").textContent = estado.zona.punto.n.replace(/\s*\(.*\)\s*/, "");
  $("cond-lugar").textContent = ZONAS_MARINAS[estado.zona.zona] + " · " + estado.zona.comunidad;
  mostrarPantalla("pantalla-condiciones");
  pedirCondicionesAPI();
}

function pedirCondicionesAPI() {
  $("cond-cargando").hidden = false;
  $("cond-error").hidden = true;
  $("cond-tarjeta").hidden = true;
  $("btn-cond-continuar").hidden = true;

  cargarCondiciones(estado.zona.punto)
    .then(function (c) {
      estado.condiciones = c;
      $("cond-cargando").hidden = true;
      pintarCondiciones();
    })
    .catch(function () {
      $("cond-cargando").hidden = true;
      $("cond-error").hidden = false;
    });
}

/* Sin datos de internet: empezamos con valores de ejemplo que el usuario ajusta */
function condicionesManuales() {
  estado.condiciones = {
    temperaturaMar: null, ola: null, periodoOla: null,
    viento: null, vientoDireccion: null, rachas: null,
    marea: null, hora: null, corregido: true
  };
  $("cond-error").hidden = true;
  pintarCondiciones();
  abrirEditor(true);
}

function pintarCondiciones() {
  var c = estado.condiciones;
  var SIN = "—";

  ponerValor($("dato-temp"), c.temperaturaMar != null ? formatear(c.temperaturaMar, 1) : SIN, c.temperaturaMar != null ? "°C" : "");
  $("dato-temp-desc").textContent = c.temperaturaMar != null ? "" : "Sin dato";

  ponerValor($("dato-ola"), c.ola != null ? formatear(c.ola, 1) : SIN, c.ola != null ? "m" : "");
  var descOla = describirOla(c.ola);
  if (c.periodoOla != null) descOla += " · cada " + Math.round(c.periodoOla) + " s";
  $("dato-ola-desc").textContent = c.ola != null ? descOla : "Sin dato";

  ponerValor($("dato-viento"), c.viento != null ? String(Math.round(c.viento)) : SIN, c.viento != null ? "km/h" : "");
  var descViento = describirViento(c.viento);
  if (c.vientoDireccion != null) descViento += " · del " + puntoCardinal(c.vientoDireccion);
  if (c.rachas != null) descViento += " · rachas " + Math.round(c.rachas);
  $("dato-viento-desc").textContent = c.viento != null ? descViento : "Sin dato";

  pintarMarea(c.marea);

  // Avisos de seguridad
  var avisos = [];
  if (c.ola != null && c.ola > 2.5) avisos.push("mar gruesa");
  if (c.viento != null && c.viento >= 50) avisos.push("viento muy fuerte");
  var seguridad = $("cond-seguridad");
  if (avisos.length) {
    seguridad.textContent = "Precaución: " + avisos.join(" y ") +
      ". No te acerques a rocas ni escolleras batidas por el mar.";
    seguridad.hidden = false;
  } else {
    seguridad.hidden = true;
  }

  $("cond-corregido").hidden = !c.corregido;
  $("cond-hora").textContent = c.hora ? "Actualizado a las " + c.hora.slice(11, 16) + " (hora local)." : "";

  $("cond-tarjeta").hidden = false;
  $("btn-cond-continuar").hidden = false;
}

/* Número grande + unidad pequeña (para que no salte de línea) */
function ponerValor(elemento, numero, unidad) {
  elemento.textContent = numero;
  if (unidad) {
    var u = document.createElement("span");
    u.className = "dato__unidad";
    u.textContent = " " + unidad;
    elemento.appendChild(u);
  }
}

function pintarMarea(m) {
  var valor = $("dato-marea");
  var desc = $("dato-marea-desc");
  // La marea se muestra con palabras ("Subiendo"): letra algo menor para que quepa
  valor.classList.add("dato__valor--texto");
  if (!m || !m.estado || m.estado === "nose") {
    valor.textContent = "—";
    desc.textContent = "Sin dato";
    return;
  }
  // Marea casi inapreciable (típico del Mediterráneo): las horas no aportan nada
  if (m.rango != null && m.rango < 0.3) {
    valor.textContent = "Muy pequeña";
    desc.textContent = "Solo " + Math.round(m.rango * 100) + " cm de diferencia en 24 h";
    return;
  }

  var nombres = { subiendo: "Subiendo", bajando: "Bajando", parada: "Parada" };
  valor.textContent = nombres[m.estado] || "—";

  var partes = [];
  if (m.pleamar) partes.push("Pleamar ~" + m.pleamar);
  if (m.bajamar) partes.push("Bajamar ~" + m.bajamar);
  desc.textContent = partes.join(" · ");
}

/* ---------- Corregir a mano ---------- */
function abrirEditor(abrir) {
  var editor = $("cond-editar");
  editor.hidden = !abrir;
  $("btn-editar").setAttribute("aria-expanded", abrir ? "true" : "false");
  $("btn-editar").textContent = abrir ? "Listo" : "Corregir a mano";
  if (abrir) {
    pintarSteppers();
    pintarOpcionesMarea();
  }
}

function pintarSteppers() {
  var steppers = document.querySelectorAll(".stepper");
  for (var i = 0; i < steppers.length; i++) {
    var s = steppers[i];
    var campo = s.getAttribute("data-campo");
    var v = estado.condiciones[campo];
    var paso = parseFloat(s.getAttribute("data-paso"));
    var decimales = paso < 1 ? 1 : 0;
    s.querySelector(".stepper__valor").textContent = v != null ? formatear(v, decimales) : "—";
  }
}

function alPulsarStepper(e) {
  var boton = e.target.closest(".stepper__boton");
  if (!boton) return;
  var s = boton.closest(".stepper");
  var campo = s.getAttribute("data-campo");
  var paso = parseFloat(s.getAttribute("data-paso"));
  var min = parseFloat(s.getAttribute("data-min"));
  var max = parseFloat(s.getAttribute("data-max"));
  var actual = estado.condiciones[campo];

  var nuevo;
  if (actual == null) {
    nuevo = parseFloat(s.getAttribute("data-inicial"));
  } else {
    nuevo = actual + paso * parseInt(boton.getAttribute("data-delta"), 10);
  }
  nuevo = Math.round(Math.min(max, Math.max(min, nuevo)) * 10) / 10;

  estado.condiciones[campo] = nuevo;
  estado.condiciones.corregido = true;
  // Si corriges las olas a mano, el periodo de la API ya no cuadra
  if (campo === "ola") estado.condiciones.periodoOla = null;
  // Si corriges el viento, la dirección y las rachas de la API ya no cuadran
  if (campo === "viento") { estado.condiciones.vientoDireccion = null; estado.condiciones.rachas = null; }

  pintarSteppers();
  pintarCondiciones();
}

function pintarOpcionesMarea() {
  var actual = estado.condiciones.marea ? estado.condiciones.marea.estado : null;
  var botones = document.querySelectorAll("#marea-opciones .boton-opcion");
  for (var i = 0; i < botones.length; i++) {
    botones[i].setAttribute("aria-pressed", botones[i].getAttribute("data-marea") === actual ? "true" : "false");
  }
}

function alPulsarMarea(e) {
  var boton = e.target.closest(".boton-opcion");
  if (!boton) return;
  estado.condiciones.marea = { estado: boton.getAttribute("data-marea"), pleamar: null, bajamar: null, rango: null };
  estado.condiciones.corregido = true;
  pintarOpcionesMarea();
  pintarCondiciones();
}

/* ---------- App instalable (solo en https) ---------- */
if ("serviceWorker" in navigator && location.protocol === "https:") {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("sw.js").catch(function () {
      // Si falla, la web sigue funcionando igual, solo que sin modo app.
    });
  });
}

/* ---------- Arranque ---------- */
document.addEventListener("DOMContentLoaded", function () {
  $("btn-ubicacion").addEventListener("click", alPulsarUbicacion);
  $("btn-manual").addEventListener("click", abrirEleccionManual);
  $("btn-corregir").addEventListener("click", abrirEleccionManual);

  $("btn-continuar").addEventListener("click", abrirCondiciones);
  $("chip-zona").addEventListener("click", abrirEleccionManual);

  $("btn-nuevo").addEventListener("click", function () {
    // Etapa 6: kit para principiantes por presupuesto.
    ponerEstado($("estado-nuevo"), "Próximamente: te diremos qué kit comprar según tu presupuesto.");
  });

  var botonesBarra = document.querySelectorAll(".barra-inferior__boton");
  for (var k = 0; k < botonesBarra.length; k++) {
    botonesBarra[k].addEventListener("click", function (e) {
      irA(e.currentTarget.getAttribute("data-ir"));
    });
  }

  $("btn-reintentar").addEventListener("click", pedirCondicionesAPI);
  $("btn-cond-manual").addEventListener("click", condicionesManuales);
  $("btn-editar").addEventListener("click", function () {
    abrirEditor($("cond-editar").hidden);
  });
  $("cond-editar").addEventListener("click", alPulsarStepper);
  $("marea-opciones").addEventListener("click", alPulsarMarea);

  $("btn-cond-continuar").addEventListener("click", function () {
    // Etapa 3: aquí empezará el selector de modalidad.
    ponerEstado($("estado-cond-continuar"), "Siguiente paso (modalidad y señuelos): en construcción.");
  });

  var botonesVolver = document.querySelectorAll("[data-volver]");
  for (var i = 0; i < botonesVolver.length; i++) {
    botonesVolver[i].addEventListener("click", function (e) {
      mostrarPantalla(e.currentTarget.getAttribute("data-volver"));
    });
  }
});
