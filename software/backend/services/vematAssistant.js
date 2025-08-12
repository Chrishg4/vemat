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
    if (this.demoMode) {
      return this.respuestDemo(prompt);
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

DATOS ACTUALES DEL SENSOR:
${datos.actual ? `
- Temperatura: ${datos.actual.temperatura}°C
- Humedad: ${datos.actual.humedad}%
- CO2: ${datos.actual.co2} ppm  
- Sonido: ${datos.actual.sonido} Hz
- Fecha: ${datos.actual.fecha}
` : 'No hay datos actuales disponibles'}

DATOS HISTÓRICOS:
${datos.historico ? `Últimas ${datos.historico.length} lecturas disponibles` : 'No hay histórico disponible'}

CONOCIMIENTO ESPECIALIZADO:
- Condiciones óptimas Aedes aegypti: Temp 25-30°C, Humedad >60%
- Periodo de reproducción: 7-10 días en condiciones ideales
- Horarios de mayor actividad: 6-10 AM y 4-8 PM
- Factores de riesgo: agua estancada, alta humedad, temperatura cálida

INSTRUCCIONES:
1. Responde en español de Costa Rica
2. Sé específico y técnico pero comprensible
3. Incluye recomendaciones prácticas cuando sea relevante
4. Considera el contexto tropical seco de Guanacaste
5. Enfócate en prevención y salud pública

CONSULTA DEL USUARIO:
${prompt}

RESPUESTA (máximo 500 palabras):`;

    return contextoVEMAT;
  }

  /**
   * Respuesta demo cuando no hay API key
   */
  respuestDemo(prompt) {
    const respuestasDemo = {
      "riesgo": "Según las condiciones simuladas, el riesgo vectorial es MEDIO. La temperatura de 28°C y humedad del 65% están en rango favorable para Aedes aegypti. Se recomienda eliminar agua estancada y usar repelente durante las horas de mayor actividad (6-10 AM y 4-8 PM).",
      "tendencia": "Los datos muestran una tendencia ascendente en temperatura y humedad, lo que podría incrementar el riesgo vectorial en las próximas 24-48 horas. Recomiendo intensificar las medidas preventivas.",
      "recomendaciones": "Para las condiciones actuales en Cañas, recomiendo: 1) Eliminar recipientes con agua estancada, 2) Usar repelente con DEET, 3) Instalar mallas en puertas y ventanas, 4) Reportar síntomas febriles inmediatamente.",
      "default": "Esta es una respuesta demo del asistente VEMAT. Para obtener análisis real con IA, configure la API key de Google Gemini en las variables de entorno."
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
