const { GoogleGenerativeAI } = require("@google/generative-ai");

class VEMATAssistant {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (!this.apiKey) {
      console.warn('⚠️ GEMINI_API_KEY no configurada. Activando modo simulación epidemiológica.');
      this.modoSimulacion = true;
    } else {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 2048,
        }
      });
      this.modoSimulacion = false;
    }
  }

  /**
   * Procesa análisis epidemiológico vectorial con contexto técnico especializado
   */
  async procesarConsulta(prompt, datosContexto = {}) {
    console.log('� VematAssistant - Procesando análisis epidemiológico:', { 
      consulta: prompt.substring(0, 50) + '...', 
      contexto_disponible: Object.keys(datosContexto).length > 0,
      datos_telemetricos: datosContexto.lectura_actual ? 'Sí' : 'No',
      modo: this.modoSimulacion ? 'SIMULACION' : 'OPERATIVO'
    });

    if (this.modoSimulacion) {
      return this.simulacionAnalisisVectorial(prompt, datosContexto);
    }

    try {
      // Construir análisis epidemiológico con contexto técnico especializado
      const promptTecnico = this.construirAnalisisEpidemiologico(prompt, datosContexto);
      
      console.log('� Transmitiendo consulta al motor de inteligencia artificial...');
      const result = await this.model.generateContent(promptTecnico);
      const response = await result.response;
      const analisisGenerado = response.text();

      console.log('🧬 Análisis epidemiológico completado');
      
      return {
        success: true,
        respuesta: analisisGenerado,
        tokens_procesados: this.calcularComplejidadComputacional(promptTecnico + analisisGenerado),
        timestamp: new Date().toISOString(),
        motor_analitico: "gemini-1.5-flash"
      };

    } catch (error) {
      console.error('⚠️ Error en análisis epidemiológico:', error);
      
      // Protocolo de contingencia para análisis básico
      return {
        success: false,
        respuesta: this.protocoloContingencia(prompt, error),
        error_tecnico: error.message,
        timestamp: new Date().toISOString(),
        motor_analitico: "contingencia"
      };
    }
  }

  /**
   * Construye análisis epidemiológico vectorial con contexto técnico especializado
   */
  construirAnalisisEpidemiologico(prompt, datos) {
    const contextoTecnico = `
SISTEMA DE INTELIGENCIA ARTIFICIAL: Especialista en Vigilancia Epidemiológica Vectorial y Análisis Entomológico para el Proyecto VEMAT (Vector Environmental Monitoring and Analysis Technology).

MARCO GEOGRÁFICO EPIDEMIOLÓGICO:
- Coordenadas: Cañas, Guanacaste, Costa Rica (10.43°N, -85.08°W)
- Zona Climática: Bosque Tropical Seco (Clasificación Köppen: Aw)
- Temperatura Media Anual: 27°C ± 3°C
- Precipitación: Estacional bimodal (Mayo-Noviembre)
- Zona Endémica: Arbovirosis (Dengue, Chikungunya, Zika, Mayaro)
- Vector Objetivo: Aedes aegypti (Linnaeus, 1762)

PARÁMETROS TELEMÉTRICOS ACTUALES - ESTACIÓN: ${datos.nodo_actual?.id || 'INDEFINIDA'}
${datos.nodo_actual ? `- Clasificación Ecosistémica: ${datos.nodo_actual.tipo_zona}
- Coordenadas Geodésicas: ${datos.nodo_actual.latitud}°N, ${datos.nodo_actual.longitud}°W
- Estado Operacional: ${datos.nodo_actual.activo ? 'OPERATIVO' : 'INACTIVO'}` : ''}

RED DE ESTACIONES TELEMÉTRICA:
${datos.todos_los_nodos && datos.todos_los_nodos.length > 0 ? 
  datos.todos_los_nodos.map(nodo => 
    `- Estación ${nodo.id}: ${nodo.tipo_zona} (${nodo.latitud}, ${nodo.longitud}) - ${nodo.activo ? 'ACTIVA' : 'INACTIVA'} - ${nodo.total_lecturas_nodo || 0} registros`
  ).join('\n') 
  : 'Red de sensores no disponible'}

TELEMETRÍA AMBIENTAL ACTUAL:
${datos.lectura_actual ? `
- Temperatura Superficial: ${datos.lectura_actual.temperatura}°C
- Humedad Relativa: ${datos.lectura_actual.humedad}% HR
- Concentración CO₂: ${datos.lectura_actual.co2} ppm  
- Frecuencia Acústica: ${datos.lectura_actual.sonido} Hz
- Timestamp UTC: ${datos.lectura_actual.timestamp}
` : 'Telemetría no disponible - Posible falla en sensores'}

MÉTRICAS ESTADÍSTICAS LONGITUDINALES (TODA LA RED):
${datos.estadisticas_generales ? `
- Dataset Total Global: ${datos.estadisticas_generales.total_lecturas} registros telemétricos
- Red de Sensores: ${datos.estadisticas_generales.total_nodos} estaciones operativas
- Temperatura Global (μ/min/max): ${parseFloat(datos.estadisticas_generales.temp_promedio || 0).toFixed(2)}°C / ${datos.estadisticas_generales.temp_minima}°C / ${datos.estadisticas_generales.temp_maxima}°C
- Humedad Relativa Global (μ/min/max): ${parseFloat(datos.estadisticas_generales.humedad_promedio || 0).toFixed(2)}% / ${datos.estadisticas_generales.humedad_minima}% / ${datos.estadisticas_generales.humedad_maxima}%
- CO₂ Atmosférico Global (μ/min/max): ${parseFloat(datos.estadisticas_generales.co2_promedio || 0).toFixed(1)} ppm / ${datos.estadisticas_generales.co2_minimo} ppm / ${datos.estadisticas_generales.co2_maximo} ppm
- Ventana Temporal Global: ${datos.estadisticas_generales.primera_lectura} → ${datos.estadisticas_generales.ultima_lectura}
` : 'Métricas estadísticas no computadas'}

VOLUMEN DE DATOS DISPONIBLES (RED COMPLETA):
${datos.metadatos ? `
- Registros Históricos Recientes: ${datos.metadatos.total_datos_disponibles.historico_reciente}
- Telemetría Últimas 24h (Todas las estaciones): ${datos.metadatos.total_datos_disponibles.ultimas_24h}
- Análisis Temporal Semanal: ${datos.metadatos.total_datos_disponibles.resumen_semanal} registros
- Estaciones Monitoreadas: ${datos.metadatos.total_datos_disponibles.todos_nodos} nodos
` : 'Metadatos no disponibles'}

TENDENCIAS EPIDEMIOLÓGICAS TEMPORALES (TODA LA RED):
${datos.resumen_semanal && datos.resumen_semanal.length > 0 ? 
  datos.resumen_semanal.slice(0, 15).map(dia => 
    `${dia.fecha} [Nodo ${dia.nodo_id}]: Temp ${parseFloat(dia.temp_promedio_dia || 0).toFixed(1)}°C (${dia.temp_min_dia}-${dia.temp_max_dia}°C), HR ${parseFloat(dia.humedad_promedio_dia || 0).toFixed(1)}% (${dia.humedad_min_dia}-${dia.humedad_max_dia}%), CO₂ ${parseFloat(dia.co2_promedio_dia || 0).toFixed(0)} ppm (${dia.lecturas_del_dia} registros)`
  ).join('\n') 
  : 'Análisis temporal no disponible'}

ACTIVIDAD RECIENTE RED COMPLETA (ÚLTIMAS 24H):
${datos.ultimas_24_horas && datos.ultimas_24_horas.length > 0 ? 
  `- Total registros últimas 24h: ${datos.ultimas_24_horas.length}
- Rango térmico observado: ${Math.min(...datos.ultimas_24_horas.map(r => r.temperatura || 999))}°C - ${Math.max(...datos.ultimas_24_horas.map(r => r.temperatura || -999))}°C
- Rango humedad observado: ${Math.min(...datos.ultimas_24_horas.map(r => r.humedad || 999))}% - ${Math.max(...datos.ultimas_24_horas.map(r => r.humedad || -999))}%
- Estaciones activas: ${[...new Set(datos.ultimas_24_horas.map(r => r.nodo_id))].join(', ')}`
  : 'Sin actividad reciente detectada'}

PARÁMETROS ENTOMOLÓGICOS CRÍTICOS:
- Rango Térmico Óptimo Aedes aegypti: 25-30°C
- Umbral Humedad Relativa: >60% HR para reproducción activa
- Ciclo Gonotrófico: 7-10 días bajo condiciones ideales
- Picos de Actividad Circadiana: 06:00-10:00h y 16:00-20:00h
- Factores de Riesgo: Recipientes artificiales, microhábitats urbanos
- Inhibidores Térmicos: >32°C o <20°C suprimen actividad reproductiva
- Umbral Crítico Humedad: <50% HR reduce significativamente actividad

PROTOCOLO DE ANÁLISIS:
1. Emplear terminología científica precisa (español técnico Costa Rica)
2. Analizar patrones multivariados y correlaciones temporales
3. Comparar parámetros actuales con referencias estadísticas históricas
4. Identificar desviaciones significativas en ventana temporal 24h
5. Generar recomendaciones epidemiológicas específicas basadas en evidencia
6. Considerar contexto ecogeográfico tropical seco guanacasteco
7. Priorizar enfoque de salud pública preventiva
8. Utilizar datos históricos para modelado predictivo

CONSULTA EPIDEMIOLÓGICA:
${prompt}

ANÁLISIS EPIDEMIOLÓGICO VECTORIAL (Máximo 800 palabras, terminología técnica especializada):`;

    return contextoTecnico;
  }

  /**
   * Simulación de análisis epidemiológico vectorial cuando no hay API key
   */
  simulacionAnalisisVectorial(prompt, datosContexto = {}) {
    console.log('🔬 Modo Simulación - Análisis epidemiológico con datos:', Object.keys(datosContexto));
    
    // Si hay datos reales, generar análisis técnico simulado
    if (datosContexto.lectura_actual) {
      const { temperatura, humedad, co2, sonido, timestamp } = datosContexto.lectura_actual;
      const nodo = datosContexto.nodo?.id || 'N/A';
      const estadisticas = datosContexto.estadisticas_generales || {};
      const historico_count = datosContexto.metadatos?.total_datos_disponibles?.historico_reciente || 0;
      
      return {
        success: true,
        respuesta: `🔬 [SIMULACIÓN EPIDEMIOLÓGICA] Análisis Vectorial Técnico:

📊 **PARÁMETROS TELEMÉTRICOS - ESTACIÓN ${nodo}:**
• Temperatura Superficial: ${temperatura || 'N/A'}°C
• Humedad Relativa: ${humedad || 'N/A'}% HR
• Concentración CO₂: ${co2 || 'N/A'} ppm
• Frecuencia Acústica: ${sonido || 'N/A'} Hz
• Timestamp de Registro: ${new Date(timestamp).toLocaleString('es-CR')}

📈 **MÉTRICAS ESTADÍSTICAS LONGITUDINALES:**
• Dataset Total: ${estadisticas.total_lecturas || 0} registros telemétricos
• Temperatura Media Histórica: ${parseFloat(estadisticas.temp_promedio || 0).toFixed(2)}°C
• Humedad Relativa Media: ${parseFloat(estadisticas.humedad_promedio || 0).toFixed(2)}% HR
• Volumen de Datos Históricos: ${historico_count} registros recientes

🦟 **EVALUACIÓN DE RIESGO ENTOMOLÓGICO:**
${this.evaluarRiesgoEntomologico(temperatura, humedad)}

📊 **ANÁLISIS COMPARATIVO ESTADÍSTICO:**
${this.analizarDesviacionesEstadisticas(temperatura, humedad, estadisticas)}

💡 **RECOMENDACIONES EPIDEMIOLÓGICAS:**
${this.generarRecomendacionesEpidemiologicas(prompt, temperatura, humedad)}

⚠️ **NOTA TÉCNICA:** Análisis generado por simulación con datos telemétricos reales. Para análisis completo con inteligencia artificial, configure GEMINI_API_KEY.`,
        contexto_usado: datosContexto,
        modo: "simulacion_epidemiologica",
        timestamp: new Date().toISOString()
      };
    }

    // Respuestas técnicas simuladas sin datos
    const analisisSimulados = {
      "riesgo": "EVALUACIÓN DE RIESGO ENTOMOLÓGICO: Bajo condiciones simuladas (Temp: 28°C, HR: 65%), el índice de favorabilidad vectorial es MODERADO-ALTO. Los parámetros térmicos e hídricos se encuentran dentro del rango óptimo para Aedes aegypti. Recomendaciones: Eliminación inmediata de criaderos artificiales y aplicación de medidas de control larvario durante picos de actividad circadiana (06:00-10:00h, 16:00-20:00h).",
      "tendencia": "MODELADO PREDICTIVO TEMPORAL: Los patrones telemétricos evidencian tendencia ascendente en temperatura y humedad relativa, sugiriendo incremento del riesgo entomológico en ventana temporal 24-48h. Protocolo recomendado: Intensificación de vigilancia entomológica activa y medidas preventivas comunitarias.",
      "recomendaciones": "PROTOCOLOS EPIDEMIOLÓGICOS PARA ZONA TROPICAL SECA - CAÑAS: 1) Eliminación sistemática de recipientes con agua estancada, 2) Aplicación de repelentes con N,N-dietil-meta-toluamida (DEET), 3) Instalación de barreras físicas (mallas metálicas), 4) Notificación inmediata de síndrome febril agudo al sistema de vigilancia epidemiológica.",
      "default": "🔬 [SIMULACIÓN EPIDEMIOLÓGICA] Datos telemétricos no detectados. Verificar conectividad de sensores ESP32 y transmisión de telemetría. Para análisis epidemiológico completo con inteligencia artificial, configure GEMINI_API_KEY en variables de entorno."
    };

    const palabraClave = prompt.toLowerCase();
    let respuesta = analisisSimulados.default;

    if (palabraClave.includes('riesgo')) respuesta = analisisSimulados.riesgo;
    else if (palabraClave.includes('tendencia')) respuesta = analisisSimulados.tendencia;
    else if (palabraClave.includes('recomend')) respuesta = analisisSimulados.recomendaciones;

    return {
      success: true,
      respuesta: respuesta,
      tokens_procesados: 0,
      timestamp: new Date().toISOString(),
      motor_analitico: "simulacion"
    };
  }

  /**
   * Evaluación técnica de riesgo entomológico
   */
  evaluarRiesgoEntomologico(temperatura, humedad) {
    if (!temperatura || !humedad) {
      return "Datos insuficientes para evaluación de riesgo entomológico.";
    }

    let indice_riesgo = "BAJO";
    let descripcion_tecnica = "";

    // Análisis térmico vectorial (rango óptimo Aedes aegypti: 25-30°C)
    if (temperatura >= 25 && temperatura <= 30) {
      if (humedad >= 60) {
        indice_riesgo = "ALTO";
        descripcion_tecnica = "Condiciones ÓPTIMAS para desarrollo y reproducción de Aedes aegypti. Actividad gonotrófica máxima.";
      } else {
        indice_riesgo = "MODERADO";
        descripcion_tecnica = "Rango térmico favorable, limitado por déficit hídrico atmosférico.";
      }
    } else if (temperatura > 30) {
      indice_riesgo = humedad >= 70 ? "MODERADO" : "BAJO";
      descripcion_tecnica = "Estrés térmico reduce eficiencia reproductiva vectorial.";
    } else {
      indice_riesgo = "BAJO";
      descripcion_tecnica = "Condiciones térmicas subóptimas para desarrollo ontogénico vectorial.";
    }

    return `• Índice de Riesgo Entomológico: **${indice_riesgo}**\n• Análisis Técnico: ${descripcion_tecnica}`;
  }

  /**
   * Recomendaciones epidemiológicas técnicas contextualizadas
   */
  generarRecomendacionesEpidemiologicas(prompt, temperatura, humedad) {
    const recomendaciones = [];

    // Protocolos basados en condiciones ambientales
    if (temperatura >= 25 && humedad >= 60) {
      recomendaciones.push("Eliminación URGENTE de criaderos artificiales (recipientes, neumáticos, contenedores)");
      recomendaciones.push("Aplicación intensiva de repelentes con DEET durante picos circadianos");
      recomendaciones.push("Inspección semanal sistemática de microhábitats urbanos");
    }

    // Recomendaciones específicas por parámetro
    if (prompt.toLowerCase().includes('co2')) {
      recomendaciones.push("Monitoreo de ventilación en espacios confinados - correlación con atracción vectorial");
    }

    if (prompt.toLowerCase().includes('sonido')) {
      recomendaciones.push("Análisis de contaminación acústica como indicador de actividad urbana facilitadora de criaderos");
    }

    return recomendaciones.length > 0 
      ? recomendaciones.map((r, i) => `${i + 1}. ${r}`).join('\n')
      : "Mantener protocolos epidemiológicos preventivos estándar contra vectores artrópodos.";
  }

  /**
   * Análisis estadístico de desviaciones respecto a promedios históricos
   */
  analizarDesviacionesEstadisticas(tempActual, humedadActual, estadisticas) {
    if (!estadisticas.temp_promedio || !estadisticas.humedad_promedio) {
      return "Datos estadísticos históricos insuficientes para análisis comparativo.";
    }

    const tempPromedio = parseFloat(estadisticas.temp_promedio);
    const humedadPromedio = parseFloat(estadisticas.humedad_promedio);
    
    let analisis = [];

    // Análisis de desviación térmica
    const desviacionTermica = tempActual - tempPromedio;
    if (Math.abs(desviacionTermica) > 2) {
      const direccion = desviacionTermica > 0 ? "superior" : "inferior";
      const magnitud = Math.abs(desviacionTermica).toFixed(1);
      analisis.push(`• Desviación Térmica: ${magnitud}°C ${direccion} al promedio histórico (significativa)`);
    } else {
      analisis.push("• Temperatura dentro del rango de variabilidad normal (±2°C)");
    }

    // Análisis de desviación hídrica
    const desviacionHidrica = humedadActual - humedadPromedio;
    if (Math.abs(desviacionHidrica) > 10) {
      const direccion = desviacionHidrica > 0 ? "superior" : "inferior";
      const magnitud = Math.abs(desviacionHidrica).toFixed(1);
      analisis.push(`• Desviación de Humedad Relativa: ${magnitud}% ${direccion} al promedio histórico`);
    } else {
      analisis.push("• Humedad relativa dentro de variabilidad normal (±10%)");
    }

    return analisis.join('\n');
  }

  /**
   * Protocolo de contingencia para errores técnicos
   */
  protocoloContingencia(prompt, error) {
    return `PROTOCOLO DE CONTINGENCIA EPIDEMIOLÓGICA - Error en sistema de análisis vectorial.

Error Técnico: ${error.message}

ACCIONES INMEDIATAS RECOMENDADAS:
- Revisar telemetría en dashboard de monitoreo ambiental
- Consultar sistema automatizado de alertas epidemiológicas
- Contactar con personal de salud pública local para evaluación manual
- Verificar conectividad de sensores ESP32 en red telemétrica

PARÁMETROS DE REFERENCIA PARA EVALUACIÓN MANUAL:
- Riesgo vectorial elevado: Temperatura >25°C + Humedad >60%
- Condiciones favorables Aedes aegypti: Rango térmico 25-30°C
- Picos de actividad: Horarios 06:00-10:00h y 16:00-20:00h

CONTACTO DE EMERGENCIA: Sistema de Vigilancia Epidemiológica - Ministerio de Salud Costa Rica`;
  }

  /**
   * Calcular complejidad computacional (estimación de tokens)
   */
  calcularComplejidadComputacional(texto) {
    return Math.ceil(texto.length / 4); // Estimación básica tokens
  }

  /**
   * Verificar estado operacional del servicio
   */
  getEstadoOperacional() {
    return {
      servicio: "VEMAT AI Assistant - Vigilancia Epidemiológica Vectorial",
      estado: this.modoSimulacion ? "SIMULACION" : "OPERATIVO",
      motor_analitico: this.modoSimulacion ? "simulacion-tecnica" : "gemini-1.5-flash",
      api_configurada: !this.modoSimulacion,
      timestamp: new Date().toISOString(),
      version: "2.0-epidemiologica"
    };
  }
}

module.exports = VEMATAssistant;
