const { GoogleGenerativeAI } = require("@google/generative-ai");

class VEMATAssistant {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (!this.apiKey) {
      console.warn('⚠️ GEMINI_API_KEY no configurada. Usar modo demo.');
      this.demoMode = true;
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
      this.demoMode = false;
    }
  }

  /**
   * Procesa consulta del usuario con contexto de VEMAT
   */
  async procesarConsulta(prompt, datosContexto = {}) {
    console.log('🔍 VematAssistant - Procesando consulta:', { 
      prompt: prompt.substring(0, 50) + '...', 
      contexto_disponible: Object.keys(datosContexto).length > 0,
      datos_actuales: datosContexto.actual ? 'Sí' : 'No',
      modo: this.demoMode ? 'DEMO' : 'PRODUCTION'
    });

    if (this.demoMode) {
      return this.respuestDemo(prompt, datosContexto);
    }

    try {
      // Construir prompt enriquecido con contexto
      const promptCompleto = this.construirPromptContextual(prompt, datosContexto);
      
      console.log('📤 Enviando consulta a Gemini...');
      const result = await this.model.generateContent(promptCompleto);
      const response = await result.response;
      const texto = response.text();

      console.log('📥 Respuesta recibida de Gemini');
      
      return {
        success: true,
        respuesta: texto,
        tokens_usados: this.estimarTokens(promptCompleto + texto),
        timestamp: new Date().toISOString(),
        modelo: "gemini-1.5-flash"
      };

    } catch (error) {
      console.error('❌ Error en consulta Gemini:', error);
      
      // Fallback a respuesta básica
      return {
        success: false,
        respuesta: this.respuestaFallback(prompt, error),
        error: error.message,
        timestamp: new Date().toISOString(),
        modelo: "fallback"
      };
    }
  }

  /**
   * Construye prompt con contexto específico de VEMAT
   */
  construirPromptContextual(prompt, datos) {
    const contextoVEMAT = `
SISTEMA: Eres un asistente especializado en vigilancia epidemiológica de vectores (mosquitos) para el proyecto VEMAT en Cañas, Costa Rica.

CONTEXTO GEOGRÁFICO:
- Ubicación: Cañas, Guanacaste, Costa Rica (10.43°N, -85.08°W)
- Clima: Tropical seco, temperatura media 27°C
- Zona endémica: Dengue, Chikungunya, Zika
- Vector principal: Aedes aegypti

DATOS DEL SENSOR - NODO: ${datos.nodo?.id || 'N/A'}
${datos.nodo ? `- Zona: ${datos.nodo.tipo_zona}
- Coordenadas: ${datos.nodo.latitud}, ${datos.nodo.longitud}
- Estado: ${datos.nodo.activo ? 'Activo' : 'Inactivo'}` : ''}

LECTURA ACTUAL:
${datos.lectura_actual ? `
- Temperatura: ${datos.lectura_actual.temperatura}°C
- Humedad: ${datos.lectura_actual.humedad}%
- CO2: ${datos.lectura_actual.co2} ppm  
- Sonido: ${datos.lectura_actual.sonido} Hz
- Fecha/Hora: ${datos.lectura_actual.timestamp}
` : 'No hay datos actuales disponibles'}

ESTADÍSTICAS HISTÓRICAS:
${datos.estadisticas_generales ? `
- Total de lecturas: ${datos.estadisticas_generales.total_lecturas}
- Temperatura (Promedio/Min/Max): ${parseFloat(datos.estadisticas_generales.temp_promedio || 0).toFixed(1)}°C / ${datos.estadisticas_generales.temp_minima}°C / ${datos.estadisticas_generales.temp_maxima}°C
- Humedad (Promedio/Min/Max): ${parseFloat(datos.estadisticas_generales.humedad_promedio || 0).toFixed(1)}% / ${datos.estadisticas_generales.humedad_minima}% / ${datos.estadisticas_generales.humedad_maxima}%
- CO2 (Promedio/Min/Max): ${parseFloat(datos.estadisticas_generales.co2_promedio || 0).toFixed(1)} ppm / ${datos.estadisticas_generales.co2_minimo} ppm / ${datos.estadisticas_generales.co2_maximo} ppm
- Periodo de datos: desde ${datos.estadisticas_generales.primera_lectura} hasta ${datos.estadisticas_generales.ultima_lectura}
` : 'No hay estadísticas disponibles'}

DATOS DISPONIBLES:
${datos.metadatos ? `
- Lecturas históricas recientes: ${datos.metadatos.total_datos_disponibles.historico_reciente}
- Lecturas últimas 24 horas: ${datos.metadatos.total_datos_disponibles.ultimas_24h}
- Resumen semanal: ${datos.metadatos.total_datos_disponibles.resumen_semanal} días
` : ''}

TENDENCIAS SEMANALES:
${datos.resumen_semanal && datos.resumen_semanal.length > 0 ? 
  datos.resumen_semanal.slice(0, 7).map(dia => 
    `${dia.fecha}: Temp ${parseFloat(dia.temp_promedio_dia || 0).toFixed(1)}°C, Humedad ${parseFloat(dia.humedad_promedio_dia || 0).toFixed(1)}%, CO2 ${parseFloat(dia.co2_promedio_dia || 0).toFixed(0)} ppm (${dia.lecturas_del_dia} lecturas)`
  ).join('\n') 
  : 'No hay datos semanales disponibles'}

CONOCIMIENTO ESPECIALIZADO:
- Condiciones óptimas Aedes aegypti: Temp 25-30°C, Humedad >60%
- Periodo de reproducción: 7-10 días en condiciones ideales
- Horarios de mayor actividad: 6-10 AM y 4-8 PM
- Factores de riesgo: agua estancada, alta humedad, temperatura cálida
- Índices críticos: Temp >32°C o <20°C inhiben reproducción, Humedad <50% reduce actividad

INSTRUCCIONES:
1. Responde en español de Costa Rica (usa "mae", "pura vida")
2. Analiza TODAS las tendencias y patrones disponibles
3. Compara datos actuales con promedios históricos
4. Identifica cambios significativos en las últimas 24 horas
5. Incluye recomendaciones específicas basadas en los datos
6. Considera el contexto tropical seco de Guanacaste
7. Enfócate en prevención y salud pública
8. Usa los datos históricos para hacer predicciones

CONSULTA DEL USUARIO:
${prompt}

RESPUESTA (analiza todos los datos disponibles, máximo 800 palabras):`;

    return contextoVEMAT;
  }

  /**
   * Respuesta demo cuando no hay API key
   */
  respuestDemo(prompt, datosContexto = {}) {
    console.log('🤖 Modo Demo - Contexto disponible:', Object.keys(datosContexto));
    
    // Si hay datos reales, usarlos
    if (datosContexto.lectura_actual) {
      const { temperatura, humedad, co2, sonido, timestamp } = datosContexto.lectura_actual;
      const nodo = datosContexto.nodo?.id || 'N/A';
      const estadisticas = datosContexto.estadisticas_generales || {};
      const historico_count = datosContexto.metadatos?.total_datos_disponibles?.historico_reciente || 0;
      
      return {
        success: true,
        respuesta: `🤖 [MODO DEMO] Análisis completo con datos reales:

📊 **Estado Actual - Nodo ${nodo}:**
• Temperatura: ${temperatura || 'N/A'}°C
• Humedad: ${humedad || 'N/A'}%
• CO2: ${co2 || 'N/A'} ppm
• Sonido: ${sonido || 'N/A'} Hz
• Última lectura: ${new Date(timestamp).toLocaleString('es-CR')}

📈 **Estadísticas Históricas:**
• Total de lecturas: ${estadisticas.total_lecturas || 0}
• Temperatura promedio: ${parseFloat(estadisticas.temp_promedio || 0).toFixed(1)}°C
• Humedad promedio: ${parseFloat(estadisticas.humedad_promedio || 0).toFixed(1)}%
• Datos históricos disponibles: ${historico_count} lecturas recientes

🦟 **Análisis Vectorial:**
${this.analizarRiesgoDemo(temperatura, humedad)}

📊 **Comparación con Promedios:**
${this.compararConPromedios(temperatura, humedad, estadisticas)}

💡 **Recomendaciones:**
${this.obtenerRecomendacionesDemo(prompt, temperatura, humedad)}

⚠️ **Nota:** Esta es una respuesta simulada con datos reales. Configure GEMINI_API_KEY para análisis completo con IA.`,
        contexto_usado: datosContexto,
        modo: "demo",
        timestamp: new Date().toISOString()
      };
    }

    // Respuesta básica sin datos
    const respuestasDemo = {
      "riesgo": "Según las condiciones simuladas, el riesgo vectorial es MEDIO. La temperatura de 28°C y humedad del 65% están en rango favorable para Aedes aegypti. Se recomienda eliminar agua estancada y usar repelente durante las horas de mayor actividad (6-10 AM y 4-8 PM).",
      "tendencia": "Los datos muestran una tendencia ascendente en temperatura y humedad, lo que podría incrementar el riesgo vectorial en las próximas 24-48 horas. Recomiendo intensificar las medidas preventivas.",
      "recomendaciones": "Para las condiciones actuales en Cañas, recomiendo: 1) Eliminar recipientes con agua estancada, 2) Usar repelente con DEET, 3) Instalar mallas en puertas y ventanas, 4) Reportar síntomas febriles inmediatamente.",
      "default": "🤖 [MODO DEMO] No se detectaron datos de sensores en la consulta. Asegúrese de que los dispositivos ESP32 estén enviando datos. Para obtener análisis real con IA, configure la API key de Google Gemini."
    };

    const palabraClave = prompt.toLowerCase();
    let respuesta = respuestasDemo.default;

    if (palabraClave.includes('riesgo')) respuesta = respuestasDemo.riesgo;
    else if (palabraClave.includes('tendencia')) respuesta = respuestasDemo.tendencia;
    else if (palabraClave.includes('recomend')) respuesta = respuestasDemo.recomendaciones;

    return {
      success: true,
      respuesta: respuesta,
      tokens_usados: 0,
      timestamp: new Date().toISOString(),
      modelo: "demo-mode"
    };
  }

  /**
   * Analizar riesgo vectorial basado en temperatura y humedad
   */
  analizarRiesgoDemo(temperatura, humedad) {
    if (!temperatura || !humedad) {
      return "Sin datos suficientes para análisis de riesgo.";
    }

    let riesgo = "BAJO";
    let descripcion = "";

    // Análisis de temperatura (rango óptimo Aedes aegypti: 25-30°C)
    if (temperatura >= 25 && temperatura <= 30) {
      if (humedad >= 60) {
        riesgo = "ALTO";
        descripcion = "Condiciones ÓPTIMAS para reproducción de Aedes aegypti.";
      } else {
        riesgo = "MEDIO";
        descripcion = "Temperatura favorable, pero humedad baja limita reproducción.";
      }
    } else if (temperatura > 30) {
      riesgo = humedad >= 70 ? "MEDIO" : "BAJO";
      descripcion = "Temperatura alta puede reducir actividad vectorial.";
    } else {
      riesgo = "BAJO";
      descripcion = "Temperatura subóptima para desarrollo vectorial.";
    }

    return `• Nivel de riesgo: **${riesgo}**\n• ${descripcion}`;
  }

  /**
   * Obtener recomendaciones contextualizadas
   */
  obtenerRecomendacionesDemo(prompt, temperatura, humedad) {
    const recomendaciones = [];

    // Recomendaciones basadas en condiciones
    if (temperatura >= 25 && humedad >= 60) {
      recomendaciones.push("Eliminar URGENTEMENTE agua estancada");
      recomendaciones.push("Intensificar uso de repelente");
      recomendaciones.push("Inspeccionar contenedores semanalmente");
    }

    // Recomendaciones específicas por consulta
    if (prompt.toLowerCase().includes('co2')) {
      recomendaciones.push("Monitorear ventilación en espacios cerrados");
    }

    if (prompt.toLowerCase().includes('sonido')) {
      recomendaciones.push("Niveles de ruido pueden indicar actividad urbana que favorece criaderos");
    }

    return recomendaciones.length > 0 
      ? recomendaciones.map((r, i) => `${i + 1}. ${r}`).join('\n')
      : "Mantener medidas preventivas generales contra vectores.";
  }

  /**
   * Comparar valores actuales con promedios históricos
   */
  compararConPromedios(tempActual, humedadActual, estadisticas) {
    if (!estadisticas.temp_promedio || !estadisticas.humedad_promedio) {
      return "No hay suficientes datos históricos para comparación.";
    }

    const tempPromedio = parseFloat(estadisticas.temp_promedio);
    const humedadPromedio = parseFloat(estadisticas.humedad_promedio);
    
    let analisis = [];

    // Análisis de temperatura
    const difTemp = tempActual - tempPromedio;
    if (Math.abs(difTemp) > 2) {
      const tendencia = difTemp > 0 ? "superior" : "inferior";
      const diferencia = Math.abs(difTemp).toFixed(1);
      analisis.push(`• Temperatura ${diferencia}°C ${tendencia} al promedio histórico`);
    } else {
      analisis.push("• Temperatura dentro del rango normal");
    }

    // Análisis de humedad
    const difHumedad = humedadActual - humedadPromedio;
    if (Math.abs(difHumedad) > 10) {
      const tendencia = difHumedad > 0 ? "superior" : "inferior";
      const diferencia = Math.abs(difHumedad).toFixed(1);
      analisis.push(`• Humedad ${diferencia}% ${tendencia} al promedio histórico`);
    } else {
      analisis.push("• Humedad dentro del rango normal");
    }

    return analisis.join('\n');
  }

  /**
   * Respuesta cuando falla la API
   */
  respuestaFallback(prompt, error) {
    return `Lo siento, no pude procesar tu consulta en este momento debido a un error técnico. 

Error: ${error.message}

Mientras tanto, puedes:
- Revisar los datos actuales en el dashboard
- Consultar las alertas automáticas del sistema
- Contactar con el personal de salud pública local

Para consultas sobre riesgo vectorial en Cañas, considera factores como temperatura >25°C y humedad >60% como indicadores de condiciones favorables para mosquitos.`;
  }

  /**
   * Estimar tokens usados (aproximado)
   */
  estimarTokens(texto) {
    return Math.ceil(texto.length / 4); // Estimación básica
  }

  /**
   * Verificar estado del servicio
   */
  getStatus() {
    return {
      servicio: "VEMAT AI Assistant",
      estado: this.demoMode ? "DEMO" : "ACTIVO",
      modelo: this.demoMode ? "demo-mode" : "gemini-1.5-flash",
      api_configurada: !this.demoMode,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = VEMATAssistant;
