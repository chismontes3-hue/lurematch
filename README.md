# SeñueloMatch (nombre provisional)

Web para pescadores de **mar** de toda España, con foco en principiantes. Detecta o te deja elegir tu zona y, con las condiciones actuales del mar, te recomienda señuelo, equipo y montaje, y te lleva directo a comprarlo. Se puede añadir a la pantalla de inicio del móvil como una app.

> ⚠️ **PROYECTO EN BORRADOR.** Los datos de señuelos, equipos, montajes, kits, tiendas y normativa que se vayan añadiendo son borradores. Deben validarlos pescadores reales de cada zona y las fuentes oficiales antes del lanzamiento.

---

## Estado por etapas

- [x] **Etapa 1:** base, zona (toda España) y app instalable
- [ ] Etapa 2: condiciones actuales (Open-Meteo)
- [ ] Etapa 3: modalidades y "Encuentra tu señuelo"
- [ ] Etapa 4: datos de señuelos
- [ ] Etapa 5: resultado, comparador y compra directa
- [ ] Etapa 6: equipo y montaje completo
- [ ] Etapa 7: tiendas y enlaces
- [ ] Etapa 8: normativa ("¿Puedo pescar esto aquí?")
- [ ] Etapa 9: páginas legales

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

## Instalarla como app en el móvil

Solo funciona con la web ya publicada (https):
- **Android (Chrome):** menú ⋮ → **Añadir a pantalla de inicio** o **Instalar aplicación**.
- **iPhone (Safari):** botón Compartir → **Añadir a pantalla de inicio**.

El "service worker" (`sw.js`) carga siempre la versión más nueva si hay internet. Sin cobertura, abre la última versión guardada. Solo guarda los archivos de la propia web, nunca tu ubicación.

> Si cambias archivos importantes, sube el número de `CACHE` en `sw.js` (por ejemplo `senuelomatch-v2`) para limpiar lo guardado en los móviles.

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
2. Elige un nombre de usuario. Será parte de la dirección de tu web: `https://TU-USUARIO.github.io/senuelomatch/`.

### Paso 3: crear el repositorio (la "carpeta" en GitHub)
1. Ya con la sesión iniciada, pulsa el **+** de arriba a la derecha → **New repository**.
2. En *Repository name* escribe `senuelomatch`.
3. Marca **Public**. GitHub Pages gratis necesita que sea público.
4. **No** marques "Add a README" (ya tenemos uno).
5. Pulsa **Create repository**.

### Paso 4: subir los archivos
Claude ejecutará los comandos por ti. Si lo haces tú, abre PowerShell en la carpeta del proyecto y escribe:
```
git remote add origin https://github.com/TU-USUARIO/senuelomatch.git
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
