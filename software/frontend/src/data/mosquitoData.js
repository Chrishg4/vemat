export const mosquitoData = [
  {
    id: 1,
    species: "Aedes aegypti",
    description: "Principal transmisor del dengue, zika y chikungunya. Activo durante el día.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Aedes_aegypti.jpg/1200px-Aedes_aegypti.jpg",
    captureDate: "2025-09-05",
    lifeCycle: "El ciclo de huevo a adulto puede completarse en 7-10 días. Los adultos viven de 2 a 4 semanas.",
    commonSeason: "Predomina en la estación lluviosa (mayo a noviembre) debido a la abundancia de criaderos.",
    provinces: [
      "Puntarenas",
      "Limón",
      "San José",
      "Alajuela"
    ],
    controlMethods: [
      "Eliminación y neutralización de criaderos (latas, botellas, neumáticos, macetas, etc.)",
      "Control químico (larvicidas en cuerpos de agua, adulticidas como fumigación en brotes)",
      "Control biológico (peces larvívoros, Bacillus thuringiensis israelensis (BTI))",
      "Técnica del Insecto Estéril (TIE)",
      "Protección personal (repelentes, ropa protectora)",
      "Vigilancia entomológica y epidemiológica"
    ],
    diseases: [
      {
        name: "Dengue",
        treatmentCost: "Consulta: ₡39.700 - ₡45.120 (2013). Hospitalización: >₡435.000 (2013). Costos cubiertos por CCSS para asegurados. Cifras de 2013, pueden no reflejar precios actuales."
      },
      {
        name: "Zika",
        treatmentCost: "No hay tratamiento específico; manejo sintomático. Cubierto por CCSS para asegurados."
      },
      {
        name: "Chikungunya",
        treatmentCost: "No hay tratamiento específico; manejo sintomático. Cubierto por CCSS para asegurados."
      },
      {
        name: "Fiebre Amarilla",
        treatmentCost: "No hay tratamiento específico; manejo de síntomas. Vacuna: ₡60.000 - ₡84.000 (sector privado). CCSS puede cubrir vacuna para viajeros."
      }
    ]
  },
  {
    id: 2,
    species: "Anopheles albimanus",
    description: "Vector primario de la malaria en la región. Actividad de picadura principalmente nocturna.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Anopheles_albimanus_mosquito.jpg",
    captureDate: "2025-09-04",
    lifeCycle: "Su ciclo de vida dura entre 10 y 14 días. Prefiere aguas limpias y con vegetación para la cría.",
    commonSeason: "Activo todo el año, con picos en la estación lluviosa en zonas rurales y costeras.",
    provinces: [
      "Alajuela",
      "Cartago",
      "Guanacaste",
      "Heredia",
      "Limón",
      "Puntarenas",
      "San José"
    ],
    controlMethods: [
      "Rociamiento de Interiores con Insecticidas (IRS)",
      "Rociamiento Selectivo (en sitios de reposo)",
      "Larvicidas (químicos o biológicos)",
      "Destrucción de criaderos (eliminar recipientes con agua)",
      "Vigilancia entomológica y epidemiológica"
    ],
    diseases: [
      {
        name: "Malaria (Paludismo)",
        treatmentCost: "Tratamiento con cloroquina y primaquina. Generalmente provisto sin costo o a muy bajo costo a través del sistema de salud pública (CCSS)."
      }
    ]
  },
  {
    id: 3,
    species: "Culex quinquefasciatus",
    description: "Conocido como el mosquito doméstico del sur, pica de noche y se cría en aguas contaminadas.",
    imageUrl: "https://www.cdc.gov/mosquitoes/media/images/Culex-quinquefasciatus-female-mosquito-16-9.jpg",
    captureDate: "2025-09-03",
    lifeCycle: "Completa su ciclo de vida en 8 a 12 días. Las larvas prosperan en aguas ricas en materia orgánica.",
    commonSeason: "Presente todo el año en zonas urbanas y suburbanas, con mayor proliferación en épocas de lluvia.",
    provinces: [
      "Limón",
      "Guanacaste",
      "Puntarenas",
      "San José"
    ],
    controlMethods: [
      "Control Mecánico (eliminación de criaderos, limpieza de charcos, tapar cajas de agua)",
      "Control Biológico (predadores, biolarvicidas como Bti y Bs, control genético)",
      "Control Químico (insecticidas para adultos, larvicidas)",
      "Barreras físicas (mallas en ventanas)",
      "Repelentes",
      "Educación comunitaria"
    ],
    diseases: [
      {
        name: "Virus del Nilo Occidental",
        treatmentCost: "No hay tratamiento antiviral específico; manejo sintomático. Cubierto por CCSS para asegurados."
      },
      {
        name: "Filariasis linfática",
        treatmentCost: "Históricamente provisto sin costo por salud pública. Tratamientos actuales (DEC, doxiciclina) probablemente gratuitos o subsidiados. Prevalencia muy baja en CR."
      }
    ]
  },
  {
    id: 4,
    species: "Aedes albopictus",
    description: "Conocido como mosquito tigre asiático, también transmite dengue y chikungunya.",
    imageUrl: "https://higieneambiental.com/sites/default/files/styles/noticia_post/public/noticies_imatges/mosquito-tigre.jpg?itok=h06Kd8IZ",
    captureDate: "2025-09-02",
    lifeCycle: "Similar al Aedes aegypti, su ciclo de huevo a adulto toma de 7 a 10 días.",
    commonSeason: "Estación lluviosa, adaptado tanto a entornos urbanos como rurales.",
    provinces: [
      "Limón",
      "Alajuela",
      "Puntarenas",
      "San José",
      "Heredia",
      "Guanacaste"
    ],
    controlMethods: [
      "Eliminación de agua estancada (vaciar y limpiar recipientes, renovar agua de bebederos, limpieza de tanques)",
      "Control Químico (larvicidas, adulticidas)",
      "Control Biológico (peces larvívoros, bacterias como Bti y Wolbachia, hongos entomopatógenos)",
      "Control Físico y Trampas (mosquiteras, trampas específicas)",
      "Protección Personal (repelentes, vestimenta)",
      "Técnicas Innovadoras (mosquitos modificados genéticamente, TIE, autodifusión de insecticidas)",
      "Participación Comunitaria y Vigilancia"
    ],
    diseases: [
      {
        name: "Dengue",
        treatmentCost: "Consulta: ₡39.700 - ₡45.120 (2013). Hospitalización: >₡435.000 (2013). Costos cubiertos por CCSS para asegurados. Cifras de 2013, pueden no reflejar precios actuales."
      },
      {
        name: "Chikungunya",
        treatmentCost: "No hay tratamiento específico; manejo sintomático. Cubierto por CCSS para asegurados."
      },
      {
        name: "Zika",
        treatmentCost: "No hay tratamiento específico; manejo sintomático. Cubierto por CCSS para asegurados."
      }
    ]
  }
];

// Sugerencia de columnas exportables (top-level keys). Útil para componentes de exportación.
export const mosquitoColumns = [
  'id',
  'species',
  'description',
  'captureDate',
  'lifeCycle',
  'commonSeason',
  'provinces',
  'controlMethods',
  'diseases'
];