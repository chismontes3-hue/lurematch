/* =========================================================
   Ubicación
   ---------------------------------------------------------
   - Pide la ubicación al navegador SOLO cuando se llama a
     pedirUbicacion() (es decir, al pulsar el botón).
   - No guarda la ubicación en ningún sitio ni la envía a
     ningún servidor: todo se calcula aquí, en el móvil.
   ========================================================= */

/* Distancia en km entre dos puntos (fórmula de Haversine) */
function distanciaKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // radio medio de la Tierra en km
  var rad = Math.PI / 180;
  var dLat = (lat2 - lat1) * rad;
  var dLon = (lon2 - lon1) * rad;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* Busca el punto de costa más cercano a unas coordenadas */
function detectarZona(lat, lon) {
  var mejor = null;
  var mejorDist = Infinity;
  for (var i = 0; i < PUNTOS_COSTA.length; i++) {
    var p = PUNTOS_COSTA[i];
    var d = distanciaKm(lat, lon, p.lat, p.lon);
    if (d < mejorDist) {
      mejorDist = d;
      mejor = p;
    }
  }
  return {
    punto: mejor,
    zona: mejor.z,
    comunidad: mejor.c,
    distanciaKm: Math.round(mejorDist),
    origen: "gps"
  };
}

/* Pide la ubicación al navegador.
   alTerminar(error, resultado) se llama al acabar. */
function pedirUbicacion(alTerminar) {
  if (!("geolocation" in navigator)) {
    alTerminar({ tipo: "no-disponible" });
    return;
  }
  navigator.geolocation.getCurrentPosition(
    function (pos) {
      // Usamos las coordenadas solo para calcular la zona y las olvidamos.
      var resultado = detectarZona(pos.coords.latitude, pos.coords.longitude);
      alTerminar(null, resultado);
    },
    function (err) {
      var tipo = "desconocido";
      if (err.code === 1) tipo = "denegado";
      else if (err.code === 2) tipo = "sin-senal";
      else if (err.code === 3) tipo = "tiempo";
      alTerminar({ tipo: tipo });
    },
    {
      enableHighAccuracy: false, // no hace falta precisión de metros
      timeout: 15000,
      maximumAge: 300000
    }
  );
}
