/* =========================================================
   Zonas de costa de España
   ---------------------------------------------------------
   Lista de puntos de costa de referencia. Cada punto tiene:
     n   = nombre de la localidad / zona
     c   = comunidad autónoma
     z   = zona marina: "mediterraneo", "cantabrico", "atlantico", "canarias" o "baleares"
     lat = latitud aproximada
     lon = longitud aproximada
   Las coordenadas son APROXIMADAS (unos pocos km de margen).
   Sirven para saber cuál es la costa más cercana, no para navegar.
   ========================================================= */

var ZONAS_MARINAS = {
  mediterraneo: "Mediterráneo",
  cantabrico: "Cantábrico",
  atlantico: "Atlántico",
  canarias: "Canarias",
  baleares: "Baleares"
};

/* Orden en el que se muestran las comunidades al elegir a mano */
var COMUNIDADES = [
  "Andalucía",
  "Asturias",
  "Canarias",
  "Cantabria",
  "Cataluña",
  "Ceuta",
  "Comunitat Valenciana",
  "Galicia",
  "Illes Balears",
  "Melilla",
  "País Vasco",
  "Región de Murcia"
];

var PUNTOS_COSTA = [
  /* ---- Galicia ---- */
  { n: "A Guarda", c: "Galicia", z: "atlantico", lat: 41.90, lon: -8.87 },
  { n: "Baiona", c: "Galicia", z: "atlantico", lat: 42.12, lon: -8.85 },
  { n: "Vigo", c: "Galicia", z: "atlantico", lat: 42.24, lon: -8.72 },
  { n: "Sanxenxo", c: "Galicia", z: "atlantico", lat: 42.40, lon: -8.81 },
  { n: "Vilagarcía de Arousa", c: "Galicia", z: "atlantico", lat: 42.60, lon: -8.77 },
  { n: "Ribeira", c: "Galicia", z: "atlantico", lat: 42.56, lon: -8.99 },
  { n: "Muros", c: "Galicia", z: "atlantico", lat: 42.78, lon: -9.06 },
  { n: "Fisterra", c: "Galicia", z: "atlantico", lat: 42.91, lon: -9.26 },
  { n: "Malpica", c: "Galicia", z: "atlantico", lat: 43.32, lon: -8.81 },
  { n: "A Coruña", c: "Galicia", z: "atlantico", lat: 43.37, lon: -8.40 },
  { n: "Ferrol", c: "Galicia", z: "atlantico", lat: 43.48, lon: -8.23 },
  { n: "Viveiro", c: "Galicia", z: "cantabrico", lat: 43.66, lon: -7.59 },
  { n: "Ribadeo", c: "Galicia", z: "cantabrico", lat: 43.54, lon: -7.04 },

  /* ---- Asturias ---- */
  { n: "Navia", c: "Asturias", z: "cantabrico", lat: 43.54, lon: -6.72 },
  { n: "Luarca", c: "Asturias", z: "cantabrico", lat: 43.54, lon: -6.54 },
  { n: "Cudillero", c: "Asturias", z: "cantabrico", lat: 43.56, lon: -6.15 },
  { n: "Avilés", c: "Asturias", z: "cantabrico", lat: 43.56, lon: -5.92 },
  { n: "Gijón", c: "Asturias", z: "cantabrico", lat: 43.54, lon: -5.66 },
  { n: "Villaviciosa", c: "Asturias", z: "cantabrico", lat: 43.55, lon: -5.40 },
  { n: "Ribadesella", c: "Asturias", z: "cantabrico", lat: 43.46, lon: -5.06 },
  { n: "Llanes", c: "Asturias", z: "cantabrico", lat: 43.42, lon: -4.75 },

  /* ---- Cantabria ---- */
  { n: "San Vicente de la Barquera", c: "Cantabria", z: "cantabrico", lat: 43.38, lon: -4.40 },
  { n: "Comillas", c: "Cantabria", z: "cantabrico", lat: 43.39, lon: -4.29 },
  { n: "Suances", c: "Cantabria", z: "cantabrico", lat: 43.43, lon: -4.04 },
  { n: "Santander", c: "Cantabria", z: "cantabrico", lat: 43.46, lon: -3.80 },
  { n: "Noja", c: "Cantabria", z: "cantabrico", lat: 43.49, lon: -3.52 },
  { n: "Santoña", c: "Cantabria", z: "cantabrico", lat: 43.44, lon: -3.46 },
  { n: "Laredo", c: "Cantabria", z: "cantabrico", lat: 43.41, lon: -3.41 },
  { n: "Castro Urdiales", c: "Cantabria", z: "cantabrico", lat: 43.38, lon: -3.22 },

  /* ---- País Vasco ---- */
  { n: "Getxo", c: "País Vasco", z: "cantabrico", lat: 43.35, lon: -3.01 },
  { n: "Bermeo", c: "País Vasco", z: "cantabrico", lat: 43.42, lon: -2.72 },
  { n: "Lekeitio", c: "País Vasco", z: "cantabrico", lat: 43.36, lon: -2.50 },
  { n: "Zarautz", c: "País Vasco", z: "cantabrico", lat: 43.28, lon: -2.17 },
  { n: "Donostia / San Sebastián", c: "País Vasco", z: "cantabrico", lat: 43.32, lon: -1.98 },
  { n: "Hondarribia", c: "País Vasco", z: "cantabrico", lat: 43.37, lon: -1.79 },

  /* ---- Andalucía (Atlántico) ---- */
  { n: "Ayamonte", c: "Andalucía", z: "atlantico", lat: 37.21, lon: -7.41 },
  { n: "Punta Umbría (Huelva)", c: "Andalucía", z: "atlantico", lat: 37.18, lon: -6.97 },
  { n: "Matalascañas", c: "Andalucía", z: "atlantico", lat: 37.01, lon: -6.56 },
  { n: "Chipiona", c: "Andalucía", z: "atlantico", lat: 36.74, lon: -6.43 },
  { n: "Cádiz", c: "Andalucía", z: "atlantico", lat: 36.53, lon: -6.29 },
  { n: "Conil", c: "Andalucía", z: "atlantico", lat: 36.28, lon: -6.09 },
  { n: "Barbate", c: "Andalucía", z: "atlantico", lat: 36.19, lon: -5.92 },
  { n: "Tarifa", c: "Andalucía", z: "atlantico", lat: 36.01, lon: -5.60 },

  /* ---- Andalucía (Mediterráneo) ---- */
  { n: "Algeciras", c: "Andalucía", z: "mediterraneo", lat: 36.13, lon: -5.45 },
  { n: "Estepona", c: "Andalucía", z: "mediterraneo", lat: 36.43, lon: -5.15 },
  { n: "Marbella", c: "Andalucía", z: "mediterraneo", lat: 36.51, lon: -4.88 },
  { n: "Fuengirola", c: "Andalucía", z: "mediterraneo", lat: 36.54, lon: -4.62 },
  { n: "Málaga", c: "Andalucía", z: "mediterraneo", lat: 36.72, lon: -4.42 },
  { n: "Nerja", c: "Andalucía", z: "mediterraneo", lat: 36.75, lon: -3.87 },
  { n: "Almuñécar", c: "Andalucía", z: "mediterraneo", lat: 36.73, lon: -3.69 },
  { n: "Motril", c: "Andalucía", z: "mediterraneo", lat: 36.72, lon: -3.52 },
  { n: "Adra", c: "Andalucía", z: "mediterraneo", lat: 36.75, lon: -3.02 },
  { n: "Almería", c: "Andalucía", z: "mediterraneo", lat: 36.84, lon: -2.46 },
  { n: "San José (Cabo de Gata)", c: "Andalucía", z: "mediterraneo", lat: 36.76, lon: -2.11 },
  { n: "Carboneras", c: "Andalucía", z: "mediterraneo", lat: 36.99, lon: -1.90 },
  { n: "Garrucha", c: "Andalucía", z: "mediterraneo", lat: 37.18, lon: -1.82 },

  /* ---- Región de Murcia ---- */
  { n: "Águilas", c: "Región de Murcia", z: "mediterraneo", lat: 37.41, lon: -1.58 },
  { n: "Mazarrón", c: "Región de Murcia", z: "mediterraneo", lat: 37.56, lon: -1.26 },
  { n: "Cartagena", c: "Región de Murcia", z: "mediterraneo", lat: 37.60, lon: -0.98 },
  { n: "Cabo de Palos", c: "Región de Murcia", z: "mediterraneo", lat: 37.63, lon: -0.69 },
  { n: "San Pedro del Pinatar (Mar Menor)", c: "Región de Murcia", z: "mediterraneo", lat: 37.83, lon: -0.79 },

  /* ---- Comunitat Valenciana ---- */
  { n: "Torrevieja", c: "Comunitat Valenciana", z: "mediterraneo", lat: 37.98, lon: -0.68 },
  { n: "Santa Pola", c: "Comunitat Valenciana", z: "mediterraneo", lat: 38.19, lon: -0.56 },
  { n: "Alicante", c: "Comunitat Valenciana", z: "mediterraneo", lat: 38.34, lon: -0.48 },
  { n: "Benidorm", c: "Comunitat Valenciana", z: "mediterraneo", lat: 38.54, lon: -0.13 },
  { n: "Xàbia", c: "Comunitat Valenciana", z: "mediterraneo", lat: 38.79, lon: 0.18 },
  { n: "Dénia", c: "Comunitat Valenciana", z: "mediterraneo", lat: 38.84, lon: 0.11 },
  { n: "Gandia", c: "Comunitat Valenciana", z: "mediterraneo", lat: 38.99, lon: -0.16 },
  { n: "Cullera", c: "Comunitat Valenciana", z: "mediterraneo", lat: 39.16, lon: -0.25 },
  { n: "València", c: "Comunitat Valenciana", z: "mediterraneo", lat: 39.46, lon: -0.32 },
  { n: "Sagunt", c: "Comunitat Valenciana", z: "mediterraneo", lat: 39.66, lon: -0.23 },
  { n: "Castelló de la Plana", c: "Comunitat Valenciana", z: "mediterraneo", lat: 39.97, lon: 0.02 },
  { n: "Orpesa", c: "Comunitat Valenciana", z: "mediterraneo", lat: 40.09, lon: 0.14 },
  { n: "Peníscola", c: "Comunitat Valenciana", z: "mediterraneo", lat: 40.36, lon: 0.41 },
  { n: "Vinaròs", c: "Comunitat Valenciana", z: "mediterraneo", lat: 40.47, lon: 0.48 },

  /* ---- Cataluña ---- */
  { n: "Sant Carles de la Ràpita", c: "Cataluña", z: "mediterraneo", lat: 40.62, lon: 0.59 },
  { n: "L'Ametlla de Mar", c: "Cataluña", z: "mediterraneo", lat: 40.88, lon: 0.80 },
  { n: "Cambrils", c: "Cataluña", z: "mediterraneo", lat: 41.07, lon: 1.06 },
  { n: "Tarragona", c: "Cataluña", z: "mediterraneo", lat: 41.11, lon: 1.25 },
  { n: "Sitges", c: "Cataluña", z: "mediterraneo", lat: 41.24, lon: 1.81 },
  { n: "Barcelona", c: "Cataluña", z: "mediterraneo", lat: 41.38, lon: 2.18 },
  { n: "Mataró", c: "Cataluña", z: "mediterraneo", lat: 41.54, lon: 2.45 },
  { n: "Blanes", c: "Cataluña", z: "mediterraneo", lat: 41.67, lon: 2.79 },
  { n: "Palamós", c: "Cataluña", z: "mediterraneo", lat: 41.85, lon: 3.13 },
  { n: "L'Escala", c: "Cataluña", z: "mediterraneo", lat: 42.12, lon: 3.13 },
  { n: "Roses", c: "Cataluña", z: "mediterraneo", lat: 42.26, lon: 3.18 },
  { n: "Cadaqués", c: "Cataluña", z: "mediterraneo", lat: 42.29, lon: 3.28 },
  { n: "Portbou", c: "Cataluña", z: "mediterraneo", lat: 42.43, lon: 3.16 },

  /* ---- Illes Balears ---- */
  { n: "Palma (Mallorca)", c: "Illes Balears", z: "baleares", lat: 39.57, lon: 2.65 },
  { n: "Andratx (Mallorca)", c: "Illes Balears", z: "baleares", lat: 39.54, lon: 2.39 },
  { n: "Port de Sóller (Mallorca)", c: "Illes Balears", z: "baleares", lat: 39.80, lon: 2.69 },
  { n: "Alcúdia (Mallorca)", c: "Illes Balears", z: "baleares", lat: 39.85, lon: 3.12 },
  { n: "Cala Rajada (Mallorca)", c: "Illes Balears", z: "baleares", lat: 39.71, lon: 3.46 },
  { n: "Colònia de Sant Jordi (Mallorca)", c: "Illes Balears", z: "baleares", lat: 39.32, lon: 2.99 },
  { n: "Maó (Menorca)", c: "Illes Balears", z: "baleares", lat: 39.89, lon: 4.27 },
  { n: "Ciutadella (Menorca)", c: "Illes Balears", z: "baleares", lat: 40.00, lon: 3.84 },
  { n: "Eivissa (Ibiza)", c: "Illes Balears", z: "baleares", lat: 38.91, lon: 1.43 },
  { n: "Sant Antoni (Ibiza)", c: "Illes Balears", z: "baleares", lat: 38.98, lon: 1.30 },
  { n: "La Savina (Formentera)", c: "Illes Balears", z: "baleares", lat: 38.73, lon: 1.42 },

  /* ---- Canarias ---- */
  { n: "Las Palmas (Gran Canaria)", c: "Canarias", z: "canarias", lat: 28.13, lon: -15.43 },
  { n: "Maspalomas (Gran Canaria)", c: "Canarias", z: "canarias", lat: 27.76, lon: -15.57 },
  { n: "Santa Cruz de Tenerife", c: "Canarias", z: "canarias", lat: 28.47, lon: -16.25 },
  { n: "Puerto de la Cruz (Tenerife)", c: "Canarias", z: "canarias", lat: 28.42, lon: -16.55 },
  { n: "Los Cristianos (Tenerife)", c: "Canarias", z: "canarias", lat: 28.05, lon: -16.72 },
  { n: "Arrecife (Lanzarote)", c: "Canarias", z: "canarias", lat: 28.96, lon: -13.55 },
  { n: "Playa Blanca (Lanzarote)", c: "Canarias", z: "canarias", lat: 28.86, lon: -13.83 },
  { n: "Corralejo (Fuerteventura)", c: "Canarias", z: "canarias", lat: 28.73, lon: -13.87 },
  { n: "Puerto del Rosario (Fuerteventura)", c: "Canarias", z: "canarias", lat: 28.50, lon: -13.86 },
  { n: "Morro Jable (Fuerteventura)", c: "Canarias", z: "canarias", lat: 28.05, lon: -14.35 },
  { n: "San Sebastián de La Gomera", c: "Canarias", z: "canarias", lat: 28.09, lon: -17.11 },
  { n: "Santa Cruz de La Palma", c: "Canarias", z: "canarias", lat: 28.68, lon: -17.76 },
  { n: "Tazacorte (La Palma)", c: "Canarias", z: "canarias", lat: 28.64, lon: -17.94 },
  { n: "Puerto de La Estaca (El Hierro)", c: "Canarias", z: "canarias", lat: 27.79, lon: -17.90 },
  { n: "La Restinga (El Hierro)", c: "Canarias", z: "canarias", lat: 27.64, lon: -17.98 },

  /* ---- Ceuta y Melilla ---- */
  { n: "Ceuta", c: "Ceuta", z: "mediterraneo", lat: 35.89, lon: -5.31 },
  { n: "Melilla", c: "Melilla", z: "mediterraneo", lat: 35.29, lon: -2.94 }
];
