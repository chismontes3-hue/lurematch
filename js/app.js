/* =========================================================
   App: controla las pantallas y los botones
   ========================================================= */

/* Lo que sabemos de la zona elegida. Solo vive en memoria:
   al cerrar o recargar la página, se borra. */
var estado = {
  zona: null // { punto, zona, comunidad, distanciaKm, origen }
};

/* Si estás a más de esta distancia de la costa, te avisamos */
var DISTANCIA_AVISO_KM = 25;

/* ---------- Utilidades ---------- */
function $(id) { return document.getElementById(id); }

function mostrarPantalla(id) {
  var pantallas = document.querySelectorAll(".pantalla");
  for (var i = 0; i < pantallas.length; i++) {
    pantallas[i].hidden = pantallas[i].id !== id;
  }
  window.scrollTo(0, 0);
  var titulo = $(id).querySelector("h1, h2");
  if (titulo) titulo.focus();
}

function ponerEstado(elemento, texto, esError) {
  elemento.textContent = texto;
  elemento.classList.toggle("estado--error", !!esError);
}

/* ---------- Pantalla: zona detectada ---------- */
function mostrarZona(resultado) {
  estado.zona = resultado;

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

  $("btn-continuar").addEventListener("click", function () {
    // Etapa 2: aquí cargaremos las condiciones del mar.
    ponerEstado($("estado-continuar"), "Siguiente paso (condiciones del mar): en construcción.");
  });

  var botonesVolver = document.querySelectorAll("[data-volver]");
  for (var i = 0; i < botonesVolver.length; i++) {
    botonesVolver[i].addEventListener("click", function (e) {
      mostrarPantalla(e.currentTarget.getAttribute("data-volver"));
    });
  }
});
