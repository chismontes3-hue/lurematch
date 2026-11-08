# LureMatch

Web para pescadores de **mar** de toda España, con foco en principiantes. Detecta o te deja elegir tu zona y, con las condiciones actuales del mar, te recomienda señuelo, equipo y montaje, y te lleva directo a comprarlo. Se puede añadir a la pantalla de inicio del móvil como una app.

> ⚠️ **PROYECTO EN BORRADOR.** Los datos de señuelos, equipos, montajes, kits, tiendas y normativa que se vayan añadiendo son borradores. Deben validarlos pescadores reales de cada zona y las fuentes oficiales antes del lanzamiento.

---

## Estado por etapas

- [x] **Etapa 1:** base, zona (toda España) y app instalable
- [x] **Etapa 2:** condiciones actuales (Open-Meteo)
- [ ] Etapa 3: modalidades y "Encuentra tu señuelo"
- [ ] Etapa 4: datos de señuelos
- [ ] Etapa 5: resultado, comparador y compra directa
- [ ] Etapa 6: equipo y montaje completo
- [ ] Etapa 7: tiendas y enlaces
- [ ] Etapa 8: normativa ("¿Puedo pescar esto aquí?")
- [ ] Etapa 9: páginas legales

---

## Diseño

Basado en el documento de diseño `Diseno_web_pesca.docx` (v1.0, noviembre de 2026).
- **Colores:** azul profundo `#0B2A43`, azul mar `#1B6CA8`, turquesa `#2BB5B0`, coral `#E8553A` (botones principales y "Comprar"), arena `#F4EFE6` y niebla `#E6EEF3`.
  - Blanco sobre coral: contraste 3,6:1. Vale **solo para texto grande y en negrita** (botones). No usar coral con texto pequeño.
  - Blanco sobre turquesa no tiene contraste suficiente: el turquesa se usa solo para detalles decorativos.
- **Tipografías:** Poppins (títulos) e Inter (texto), **alojadas en la propia web** (`fuentes/`, licencia SIL OFL). Así no se conecta con Google: más rápido, funciona sin cobertura y es mejor para la privacidad.
- **Navegación móvil:** barra inferior (Inicio, Descubrir, Zona, Mis señuelos, Más) y etiqueta de zona arriba.
- **Modo oscuro** automático con tonos cálidos.
- *Pendiente del documento:* barra superior con buscador para escritorio. De momento, en escritorio se muestra la misma barra inferior, centrada.

### Ideas del documento para más adelante (fases 2-3)
Semáforo de pesca · nivel de confianza de la recomendación · tarjeta para compartir · checklist antes de salir · señuelo del día por zona · glosario y nudos · diario de capturas · mapa de spots · "me funcionó" · alertas · boletín.

---

## Amazon Afiliados y otras tiendas: lo que hay que saber

*Consultado el 08/11/2026 en búsquedas que citan las políticas de Amazon. Hay fuentes contradictorias: **verificar en afiliados.amazon.es antes de usar**.*

- **Imágenes y datos de producto de Amazon:** solo se pueden mostrar si se obtienen de su API oficial (Creators API, que sustituye a la PA-API). Las imágenes no se pueden guardar en la web: solo se enlazan.
- **Requisito para la API:** según la documentación oficial, **10 ventas cualificadas en los últimos 30 días**. Al empezar no habrá fotos de Amazon.
- **Precios de Amazon:** deben venir de la API, estar actualizados y llevar la fecha y hora al lado. Las fuentes no coinciden: unas dicen máximo 24 h y otras 1 h. → **Junto a los botones de Amazon no se muestra nuestro `precio_aprox`**, sino "Ver precio en Amazon".
- **Cuenta nueva:** *PENDIENTE de verificar*. Según lo que recuerdo, Amazon cierra la cuenta si no hay 3 ventas en los primeros 180 días. → Darse de alta poco antes del lanzamiento.
- **Frase obligatoria en la web:** algo como "En calidad de Afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos aplicables". *Copiar el texto exacto del acuerdo de Amazon* (Etapa 9).
- **Otras tiendas:** redes como Awin o TradeTracker suelen dar catálogos con imágenes que se pueden usar. *PENDIENTE: comprobarlo tienda por tienda.*
- **Nunca** copiar fotos ni textos de otras webs sin permiso. Sí se pueden usar fotos propias.
- **Futuro:** cuando haya acceso a la API, una tarea automática gratuita de GitHub (GitHub Actions) puede actualizar fotos y precios a diario sin servidor propio. Las claves irían como secretos y nunca en la web.
- Las comisiones son ingresos que hay que declarar: consultar con un gestor.

---

## Qué hay en cada carpeta

| Archivo / carpeta | Para qué sirve |
|---|---|
| `index.html` | La página principal (lo que se ve). |
| `css/estilos.css` | Colores, tamaños y diseño. |
| `js/zonas.js` | Lista de puntos de costa de España con su mar y comunidad. |
| `js/ubicacion.js` | Pide la ubicación y calcula la costa más cercana. |
| `js/app.js` | Controla las pantallas y los botones. |
| `manifest.webmanifest` | Ficha de la app: nombre, icono y colores al instalarla en el móvil. |
| `sw.js` | "Service worker": hace que cargue rápido y se pueda abrir sin cobertura. |
| `img/` | Iconos de la app. |
| `fuentes/` | Tipografías Inter y Poppins con sus licencias. |
| `data/` | (Próximas etapas) señuelos, equipos, montajes, tiendas y normativa en formato JSON. |
| `.nojekyll` | Archivo vacío que le dice a GitHub Pages que publique los archivos tal cual. |

---

## Privacidad de la ubicación

- El navegador solo pide permiso cuando pulsas **"Usar mi ubicación"**.
- Las coordenadas se usan **en tu propio móvil** para buscar el punto de costa más cercano y luego se olvidan.
- **No se guardan** (ni en el móvil ni en ningún servidor) y **no se envían a ningún servidor propio**.
- En la Etapa 2, para pedir el estado del mar, se enviarán a Open-Meteo las coordenadas del **punto de costa de referencia** (por ejemplo, "Alicante"), no las tuyas exactas.

## Cómo se detecta la zona

`js/zonas.js` contiene unos 120 puntos de costa (localidades conocidas) con coordenadas **aproximadas**. La web busca el más cercano a ti y toma de él la zona marina (Mediterráneo, Cantábrico, Atlántico, Canarias o Baleares) y la comunidad autónoma. Si estás a más de 25 km del mar, te avisa. Siempre puedes corregirlo eligiendo la zona a mano.

> Las coordenadas son aproximadas (de memoria general, con unos pocos km de margen). Conviene revisarlas, sobre todo en zonas límite: Estrecho de Gibraltar (Tarifa = Atlántico, Algeciras = Mediterráneo) y norte de Galicia (Viveiro y Ribadeo = Cantábrico).

## Condiciones del mar (Open-Meteo)

Archivo: `js/condiciones.js`. Se piden a Open-Meteo las coordenadas del **punto de costa de referencia**, nunca las del usuario.

### Qué datos se usan (comprobado con llamadas reales a la API, 08/11/2026)
| Dato | Origen | Variable de la API |
|---|---|---|
| Temperatura del agua | API marina | `sea_surface_temperature` |
| Altura y periodo de ola | API marina | `wave_height`, `wave_period` |
| Marea (sube/baja, pleamar y bajamar aproximadas) | API marina | `sea_level_height_msl` por horas |
| Viento, dirección y rachas | API del tiempo | `wind_speed_10m`, `wind_direction_10m`, `wind_gusts_10m` |

Se usa `cell_selection=sea`: sin esto, los puntos de costa cuyas coordenadas caen en tierra (Alicante, Santander, Getxo…) devolvían olas y temperatura del agua vacías.

### Lo que NO ofrece (o no es fiable)
- **Tablas de mareas oficiales:** no las da. Lo que hay es un **modelo** del nivel del mar (marea + efecto de la presión, etc.). Según su documentación, en la costa la precisión es limitada y **no es apto para navegación**. Las horas de pleamar y bajamar salen de datos por horas: ±1 h. Para mareas oficiales: Puertos del Estado o el Instituto Hidrográfico de la Marina (*PENDIENTE: valorar si se pueden integrar*).
- **Claridad o turbidez del agua:** no existe. Se preguntará en el cuestionario.
- **Datos de rías, puertos y bahías cerradas:** la resolución del modelo es gruesa. En sitios abrigados, la ola real puede ser mucho menor que la que indica.
- **Fase lunar:** no se usa (*PENDIENTE: comprobar si Open-Meteo la ofrece*).

### ⚠️ Condiciones de uso: IMPORTANTE ANTES DE LANZAR
- La API gratuita es **solo para uso NO comercial**, con un límite de menos de 10.000 llamadas al día, 5.000 por hora y 600 por minuto.
- Una web con **enlaces de afiliado es uso comercial**. Antes de activar enlaces de afiliado hay que **contratar un plan de pago de Open-Meteo** (precio *PENDIENTE de consultar* en https://open-meteo.com/en/pricing) o cambiar de proveedor.
- Licencia de los datos: **CC BY 4.0**. Obliga a citar la fuente, y por eso la tarjeta muestra "Fuente: Open-Meteo.com (CC BY 4.0)".
- Cada visita hace 2 llamadas (marina + tiempo).
- No he podido abrir las páginas oficiales directamente (bloqueo de red en mi entorno). Los términos los he contrastado con búsquedas que citan https://open-meteo.com/en/terms. **Revísalos tú en esa página.**

### Reglas orientativas usadas (BORRADOR, a validar)
- Estado del mar según la escala Douglas (rizada, marejadilla, marejada…) y fuerza del viento según la escala Beaufort.
- "Mar calma" si la ola es de 0,5 m o menos y "movida" si es mayor: umbral a validar con pescadores.
- Aviso de precaución si la ola supera 2,5 m o el viento llega a 50 km/h.
- "Marea muy pequeña" si la diferencia entre pleamar y bajamar en 24 h es menor de 0,3 m (habitual en el Mediterráneo).

## Instalarla como app en el móvil

Solo funciona con la web ya publicada (https):
- **Android (Chrome):** menú ⋮ → **Añadir a pantalla de inicio** o **Instalar aplicación**.
- **iPhone (Safari):** botón Compartir → **Añadir a pantalla de inicio**.

El "service worker" (`sw.js`) carga siempre la versión más nueva si hay internet. Sin cobertura, abre la última versión guardada. Solo guarda los archivos de la propia web, nunca tu ubicación.

> Si cambias archivos importantes, sube el número de `CACHE` en `sw.js` (por ejemplo `lurematch-v2`) para limpiar lo guardado en los móviles.

---

## Cómo probarla en tu ordenador

1. Abre la carpeta `PROYECTO PESCA`.
2. Haz doble clic en `index.html`. Se abrirá en tu navegador.
3. Prueba **"Elegir mi zona a mano"**. Esto funciona sin internet.
4. El botón de ubicación puede no funcionar al abrir el archivo directamente, porque los navegadores solo dan la ubicación a webs seguras (https). Lo probarás bien en GitHub Pages.

---

## Cómo publicarla gratis en GitHub Pages

### Paso 1: instalar Git (una sola vez)
Git guarda el historial de cambios y sube los archivos a GitHub.
1. Entra en https://git-scm.com/download/win y descarga el instalador.
2. Instálalo pulsando "Next" en todas las pantallas (las opciones por defecto valen).

### Paso 2: crear una cuenta en GitHub (una sola vez)
1. Entra en https://github.com y pulsa **Sign up**.
2. Elige un nombre de usuario. Será parte de la dirección de tu web: `https://TU-USUARIO.github.io/lurematch/`.

### Paso 3: crear el repositorio (la "carpeta" en GitHub)
1. Ya con la sesión iniciada, pulsa el **+** de arriba a la derecha → **New repository**.
2. En *Repository name* escribe `lurematch`.
3. Marca **Public**. GitHub Pages gratis necesita que sea público.
4. **No** marques "Add a README" (ya tenemos uno).
5. Pulsa **Create repository**.

### Paso 4: subir los archivos
Claude ejecutará los comandos por ti. Si lo haces tú, abre PowerShell en la carpeta del proyecto y escribe:
```
git remote add origin https://github.com/TU-USUARIO/lurematch.git
git push -u origin main
```
La primera vez se abrirá una ventana para iniciar sesión en GitHub.

### Paso 5: activar GitHub Pages
1. En tu repositorio, entra en **Settings** → **Pages** (menú de la izquierda).
2. En *Source* elige **Deploy from a branch**.
3. En *Branch* elige **main** y la carpeta **/ (root)**. Pulsa **Save**.
4. Espera 1-2 minutos y recarga la página. Arriba aparecerá la dirección de tu web.

### Para publicar cambios más adelante
```
git add .
git commit -m "Explicación corta del cambio"
git push
```
GitHub Pages se actualiza solo en uno o dos minutos.
