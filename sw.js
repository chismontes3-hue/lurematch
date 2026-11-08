/* =========================================================
   Service worker: hace que la web cargue rápido, se pueda
   instalar como app y funcione sin cobertura (con lo último
   que se descargó).
   Estrategia "primero la red": si hay internet, siempre se
   carga la versión más nueva; si no hay, se usa la guardada.
   Solo guarda archivos de esta web, nunca datos de otras
   webs (como el tiempo) ni tu ubicación.
   ========================================================= */

var CACHE = "lurematch-v5";

var ARCHIVOS_BASE = [
  "./",
  "index.html",
  "css/estilos.css",
  "js/zonas.js",
  "js/ubicacion.js",
  "js/condiciones.js",
  "js/app.js",
  "manifest.webmanifest",
  "fuentes/inter-latin.woff2",
  "fuentes/barlow-condensed-800-italic-latin.woff2",
  "fuentes/barlow-condensed-900-italic-latin.woff2",
  "img/icono-192.png",
  "img/fotos/olas-1200.jpg",
  "img/fotos/espuma-1200.jpg",
  "img/icono-512.png"
];

self.addEventListener("install", function (evento) {
  evento.waitUntil(
    caches.open(CACHE).then(function (cache) { return cache.addAll(ARCHIVOS_BASE); })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (evento) {
  // Borra versiones antiguas guardadas
  evento.waitUntil(
    caches.keys().then(function (nombres) {
      return Promise.all(nombres
        .filter(function (n) { return n !== CACHE; })
        .map(function (n) { return caches.delete(n); }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (evento) {
  var peticion = evento.request;
  // Solo archivos de esta misma web y solo lecturas (GET)
  if (peticion.method !== "GET" || new URL(peticion.url).origin !== self.location.origin) return;

  evento.respondWith(
    fetch(peticion)
      .then(function (respuesta) {
        var copia = respuesta.clone();
        caches.open(CACHE).then(function (cache) { cache.put(peticion, copia); });
        return respuesta;
      })
      .catch(function () {
        return caches.match(peticion).then(function (guardada) {
          return guardada || caches.match("index.html");
        });
      })
  );
});
