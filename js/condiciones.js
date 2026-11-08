/* =========================================================
   Condiciones del mar (Open-Meteo)
   ---------------------------------------------------------
   - Se envían a Open-Meteo SOLO las coordenadas del punto de
     costa de referencia (p. ej. "Alicante"), nunca las tuyas.
   - API marina: temperatura del agua, olas y nivel del mar
     (que incluye la marea, calculada por un modelo).
   - API del tiempo: viento.
   - "cell_selection=sea" pide la celda de mar más cercana;
     sin esto, los puntos de costa que caen en tierra no
     devuelven datos de olas ni de temperatura del agua.
   - Uso gratuito: solo NO comercial (ver README).
   ========================================================= */

var URL_MARINA = "https://marine-api.open-meteo.com/v1/marine";
var URL_TIEMPO = "https://api.open-meteo.com/v1/forecast";

/* Petición con tiempo límite para no quedarse colgado sin cobertura */
function pedirJSON(url, ms) {
  var control = ("AbortController" in window) ? new AbortController() : null;
  var temporizador = control ? setTimeout(function () { control.abort(); }, ms || 12000) : null;
  return fetch(url, control ? { signal: control.signal } : {})
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .finally(function () { if (temporizador) clearTimeout(temporizador); });
}

/* Pide las condiciones actuales para un punto de costa */
function cargarCondiciones(punto) {
  var coords = "latitude=" + punto.lat + "&longitude=" + punto.lon;

  var urlMarina = URL_MARINA + "?" + coords +
    "&current=wave_height,wave_period,wave_direction,sea_surface_temperature,sea_level_height_msl" +
    "&hourly=sea_level_height_msl&forecast_days=2&cell_selection=sea&timezone=auto";

  var urlTiempo = URL_TIEMPO + "?" + coords +
    "&current=wind_speed_10m,wind_direction_10m,wind_gusts_10m" +
    "&wind_speed_unit=kmh&timezone=auto";

  return Promise.allSettled([pedirJSON(urlMarina), pedirJSON(urlTiempo)]).then(function (res) {
    var marina = res[0].status === "fulfilled" ? res[0].value : null;
    var tiempo = res[1].status === "fulfilled" ? res[1].value : null;
    if (!marina && !tiempo) throw new Error("sin-datos");

    var c = {
      temperaturaMar: null,
      ola: null,
      periodoOla: null,
      viento: null,
      vientoDireccion: null,
      rachas: null,
      marea: null,
      hora: null,
      corregido: false
    };

    if (marina && marina.current) {
      c.temperaturaMar = numero(marina.current.sea_surface_temperature);
      c.ola = numero(marina.current.wave_height);
      c.periodoOla = numero(marina.current.wave_period);
      c.hora = marina.current.time;
      if (marina.hourly) {
        c.marea = analizarMarea(marina.hourly.time, marina.hourly.sea_level_height_msl, marina.current.time);
      }
    }
    if (tiempo && tiempo.current) {
      c.viento = numero(tiempo.current.wind_speed_10m);
      c.vientoDireccion = numero(tiempo.current.wind_direction_10m);
      c.rachas = numero(tiempo.current.wind_gusts_10m);
      if (!c.hora) c.hora = tiempo.current.time;
    }
    return c;
  });
}

function numero(v) {
  return (typeof v === "number" && isFinite(v)) ? v : null;
}

/* ---------- Marea a partir del nivel del mar por horas ----------
   Busca si el agua sube o baja ahora, y la próxima pleamar
   (nivel más alto) y bajamar (nivel más bajo).
   Al ser datos por horas, las horas son aproximadas (± 1 h). */
function analizarMarea(horas, niveles, horaActual) {
  if (!horas || !niveles || !horaActual) return null;

  var claveAhora = horaActual.slice(0, 13); // "AAAA-MM-DDTHH"
  var i0 = -1;
  for (var i = 0; i < horas.length; i++) {
    if (horas[i].slice(0, 13) === claveAhora) { i0 = i; break; }
  }
  if (i0 < 0 || niveles[i0] == null || niveles[i0 + 1] == null) return null;

  var diferencia = niveles[i0 + 1] - niveles[i0];
  var estado = diferencia > 0.01 ? "subiendo" : (diferencia < -0.01 ? "bajando" : "parada");

  var pleamar = null, bajamar = null;
  for (var j = i0 + 1; j < niveles.length - 1; j++) {
    var a = niveles[j - 1], b = niveles[j], s = niveles[j + 1];
    if (a == null || b == null || s == null) continue;
    if (!pleamar && b > a && b >= s) pleamar = horas[j].slice(11, 16);
    if (!bajamar && b < a && b <= s) bajamar = horas[j].slice(11, 16);
    if (pleamar && bajamar) break;
  }

  // Diferencia entre el nivel más alto y el más bajo en las próximas 24 h
  var maximo = -Infinity, minimo = Infinity;
  for (var k = i0; k < Math.min(i0 + 25, niveles.length); k++) {
    if (niveles[k] == null) continue;
    if (niveles[k] > maximo) maximo = niveles[k];
    if (niveles[k] < minimo) minimo = niveles[k];
  }
  var rango = isFinite(maximo - minimo) ? Math.round((maximo - minimo) * 100) / 100 : null;

  return { estado: estado, pleamar: pleamar, bajamar: bajamar, rango: rango };
}

/* ---------- Descripciones sencillas ---------- */

/* Estado del mar según la escala Douglas (altura de ola en metros) */
function describirOla(m) {
  if (m == null) return "";
  if (m === 0) return "Calma";
  if (m <= 0.1) return "Rizada";
  if (m <= 0.5) return "Marejadilla";
  if (m <= 1.25) return "Marejada";
  if (m <= 2.5) return "Fuerte marejada";
  if (m <= 4) return "Mar gruesa";
  return "Mar muy gruesa";
}

/* Fuerza del viento según la escala Beaufort (km/h) */
function describirViento(kmh) {
  if (kmh == null) return "";
  if (kmh < 12) return "Flojo";
  if (kmh < 29) return "Moderado";
  if (kmh < 50) return "Fuerte";
  return "Muy fuerte";
}

/* Grados a punto cardinal en español (de dónde viene el viento) */
function puntoCardinal(grados) {
  if (grados == null) return "";
  var puntos = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  return puntos[Math.round(((grados % 360) / 45)) % 8];
}

/* Mar "calma" o "movida": lo usará el recomendador de señuelos.
   BORRADOR: umbral de 0,5 m (fin de la marejadilla), a validar con pescadores. */
var UMBRAL_MAR_MOVIDA_M = 0.5;
function tipoDeMar(ola) {
  if (ola == null) return null;
  return ola > UMBRAL_MAR_MOVIDA_M ? "movida" : "calma";
}
