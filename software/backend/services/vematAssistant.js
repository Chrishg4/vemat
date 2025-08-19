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
   * Construye contexto de datos y pregunta natural para Gemini
   */
  construirAnalisisEpidemiologico(prompt, datos) {
    const contextoNatural = `
Eres un asistente inteligente para el sistema VEMAT (Vector Environmental Monitoring and Analysis Technology) en Cañas, Guanacaste, Costa Rica.

DATOS DISPONIBLES DEL SISTEMA:

Estación actual: ${datos.nodo_actual?.id || 'No especificada'}
${datos.nodo_actual ? `- Ubicación: ${datos.nodo_actual.tipo_zona}
- Coordenadas: ${datos.nodo_actual.latitud}, ${datos.nodo_actual.longitud}
- Estado: ${datos.nodo_actual.activo ? 'Activo' : 'Inactivo'}` : ''}

Lectura más reciente:
${datos.lectura_actual ? `- Temperatura: ${datos.lectura_actual.temperatura}°C
- Humedad: ${datos.lectura_actual.humedad}%
- CO2: ${datos.lectura_actual.co2} ppm
- Sonido: ${datos.lectura_actual.sonido} Hz
- Fecha: ${datos.lectura_actual.timestamp}` : 'Sin datos recientes'}

Red de estaciones:
${datos.todos_los_nodos && datos.todos_los_nodos.length > 0 ? 
  datos.todos_los_nodos.slice(0, 5).map(nodo => 
    `- ${nodo.id}: ${nodo.tipo_zona} (${nodo.total_lecturas || 0} registros)`
  ).join('\n') 
  : 'Red no disponible'}

Estadísticas generales:
${datos.estadisticas_generales ? `- Total de registros: ${datos.estadisticas_generales.total_lecturas}
- Temperatura promedio: ${parseFloat(datos.estadisticas_generales.temp_promedio || 0).toFixed(1)}°C
- Humedad promedio: ${parseFloat(datos.estadisticas_generales.humedad_promedio || 0).toFixed(1)}%
- CO2 promedio: ${parseFloat(datos.estadisticas_generales.co2_promedio || 0).toFixed(0)} ppm` : 'Sin estadísticas'}

Datos recientes disponibles:
- Últimas 24 horas: ${datos.ultimas_24_horas?.length || 0} registros
- Última semana: ${datos.resumen_semanal?.length || 0} registros
- Histórico: ${datos.historico_reciente?.length || 0} registros

PREGUNTA DEL USUARIO:
${prompt}

INSTRUCCIONES:
- Si piden datos específicos (como "últimos 10 registros de CO2"), proporciona una lista clara y directa
- Si piden análisis o interpretación, analiza los datos apropiadamente
- Si mencionan temas de salud/vectores/mosquitos, incluye contexto epidemiológico
- Responde en español, de forma clara y útil según el tipo de consulta
- Si no tienes los datos exactos solicitados, explica qué datos sí están disponibles
`;

    return contextoNatural;
  }

  /**
   * Simulación natural cuando no hay API key
   */
  simulacionAnalisisVectorial(prompt, datosContexto = {}) {
    console.log('🔬 Modo Simulación Natural:', prompt.substring(0, 50) + '...');
    
    // Si hay datos reales, responder según el tipo de pregunta
    if (datosContexto.lectura_actual || datosContexto.ultimas_24_horas?.length > 0) {
      
      // Detectar tipo de consulta
      const preguntaLower = prompt.toLowerCase();
      
      // Si pide registros específicos de cualquier sensor
      if (datosContexto.registros_especificos) {
        const { tipo_dato, registros_especificos, limite_solicitado, columna_principal } = datosContexto;
        const registros = [];
        
        registros_especificos.slice(0, limite_solicitado).forEach((registro, i) => {
          const valor = registro[columna_principal];
          const unidad = columna_principal === 'temperatura' ? '°C' : 
                        columna_principal === 'humedad' ? '%' :
                        columna_principal === 'co2' ? ' ppm' :
                        columna_principal === 'sonido' ? ' Hz' : '';
          
          registros.push(`${i + 1}. ${registro.timestamp} - ${valor}${unidad} (Nodo: ${registro.nodo_id})`);
        });
        
        return {
          success: true,
          respuesta: registros.length > 0 
            ? `📊 Últimos ${limite_solicitado} registros de ${tipo_dato}:\n\n${registros.join('\n')}\n\n💡 Datos obtenidos del sistema VEMAT en tiempo real.`
            : `❌ No hay registros de ${tipo_dato} disponibles en este momento.`,
          modo: "simulacion_datos_especificos",
          timestamp: new Date().toISOString()
        };
      }
      
      // Si pide datos simples
      if (preguntaLower.includes('temperatura') || preguntaLower.includes('humedad') || preguntaLower.includes('datos')) {
        const { temperatura, humedad, co2, sonido, timestamp } = datosContexto.lectura_actual || {};
        
        return {
          success: true,
          respuesta: `📊 Datos actuales del sistema VEMAT:

🌡️ **Temperatura:** ${temperatura || 'N/A'}°C
💧 **Humedad:** ${humedad || 'N/A'}%
🌀 **CO2:** ${co2 || 'N/A'} ppm
🔊 **Sonido:** ${sonido || 'N/A'} Hz
📅 **Última actualización:** ${timestamp ? new Date(timestamp).toLocaleString('es-CR') : 'N/A'}

� **Estadísticas de la red:**
- Total de registros: ${datosContexto.estadisticas_generales?.total_lecturas || 0}
- Registros últimas 24h: ${datosContexto.ultimas_24_horas?.length || 0}
- Estaciones activas: ${datosContexto.todos_los_nodos?.length || 0}`,
          modo: "simulacion_natural",
          timestamp: new Date().toISOString()
        };
      }
      
      // Si menciona mosquitos, vectores, salud - dar respuesta epidemiológica
      if (preguntaLower.includes('mosquito') || preguntaLower.includes('vector') || preguntaLower.includes('salud') || preguntaLower.includes('riesgo')) {
        const { temperatura, humedad } = datosContexto.lectura_actual || {};
        
        return {
          success: true,
          respuesta: `🦟 **Análisis epidemiológico vectorial:**

🌡️ **Condiciones actuales:**
- Temperatura: ${temperatura || 'N/A'}°C
- Humedad: ${humedad || 'N/A'}%

⚕️ **Evaluación de riesgo:**
${this.evaluarRiesgoEntomologico(temperatura, humedad)}

💡 **Recomendaciones:**
${this.generarRecomendacionesEpidemiologicas(prompt, temperatura, humedad)}`,
          modo: "simulacion_epidemiologica",
          timestamp: new Date().toISOString()
        };
      }
    }

    // Respuesta general si no detecta tipo específico
    return {
      success: true,
      respuesta: `🤖 Asistente VEMAT disponible. 

¿En qué puedo ayudarte?
- 📊 Consultar datos de sensores
- 📈 Ver registros históricos  
- 🦟 Análisis epidemiológico
- ❓ Información del sistema

💡 Para análisis completo con IA, configura GEMINI_API_KEY.`,
      modo: "simulacion_natural",
      timestamp: new Date().toISOString()
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
