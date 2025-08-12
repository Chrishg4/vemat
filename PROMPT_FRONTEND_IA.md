# 🤖 PROMPT PARA IMPLEMENTACIÓN FRONTEND - ASISTENTE IA VEMAT

## 📋 CONTEXTO DEL PROYECTO

Eres un desarrollador frontend trabajando en **VEMAT** (Vigilancia Ecológica de Mosquitos con Asistencia Tecnológica), un sistema IoT para monitoreo epidemiológico de vectores en Cañas, Costa Rica. 

Tu tarea es implementar una **interfaz completa para el asistente de IA** que permita a los usuarios consultar sobre datos ambientales y riesgo vectorial usando Google Gemini AI.

## 🎯 OBJETIVO

Crear un componente React completo que permita:
- Consultar al asistente IA sobre datos vectoriales
- Usar prompts predefinidos para análisis rápidos
- Mostrar respuestas contextualizadas y bien formateadas
- Integración fluida con el sistema VEMAT existente

## 🔧 ESPECIFICACIONES TÉCNICAS

### **Backend APIs Disponibles:**

```javascript
// 1. Estado del servicio
GET /api/status
Response: {
  success: boolean,
  disponible: boolean,
  modo: "demo" | "production", 
  timestamp: string
}

// 2. Prompts predefinidos
GET /api/prompts
Response: {
  success: boolean,
  prompts: Array<{
    id: string,
    titulo: string, 
    prompt: string,
    categoria: string
  }>,
  por_categoria: Object,
  total: number
}

// 3. Consulta principal al asistente
POST /api/consulta
Body: {
  prompt: string,                 // REQUERIDO
  incluir_contexto?: boolean,    // default: true
  nodo_id?: string              // opcional
}
Response: {
  success: boolean,
  respuesta: string,            // Respuesta del asistente IA
  contexto_usado?: Object,      // Datos ambientales incluidos
  timestamp: string
}
```

### **Categorías de Prompts Disponibles:**
- 🦟 **Análisis**: Evaluación de riesgo actual, análisis acústico
- 📈 **Predicción**: Tendencias y predicciones 
- 💡 **Recomendaciones**: Medidas de control sugeridas
- 🌡️ **Evaluación**: Condiciones ambientales óptimas
- ⚠️ **Alertas**: Sistema de alertas tempranas
- 📊 **Histórico**: Comparaciones temporales
- 💨 **Correlación**: Relaciones entre variables

## 📱 COMPONENTES A IMPLEMENTAR

### 1. **IAAssistant.jsx** - Componente Principal
```javascript
// Estructura sugerida:
const IAAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [consulta, setConsulta] = useState('');
  const [respuesta, setRespuesta] = useState(null);
  const [historialConsultas, setHistorialConsultas] = useState([]);
  const [promptsSugeridos, setPromptsSugeridos] = useState([]);
  const [statusIA, setStatusIA] = useState(null);

  // Funciones principales que debes implementar:
  // - fetchStatusIA()
  // - fetchPromptsSugeridos() 
  // - enviarConsulta(prompt)
  // - usarPromptSugerido(promptObj)
  // - limpiarHistorial()
};
```

### 2. **PromptSelector.jsx** - Selector de Prompts
- Grid/lista organizada por categorías
- Botones con íconos para cada prompt
- Preview del prompt antes de enviarlo

### 3. **ChatInterface.jsx** - Interfaz de Chat
- Input para consultas personalizadas
- Historial de consultas con respuestas
- Indicadores de carga y estado
- Formato bonito para respuestas IA

### 4. **IAStatusIndicator.jsx** - Indicador de Estado
- Mostrar si IA está disponible
- Modo demo vs producción
- Indicador visual de conexión

## 🎨 UX/UI REQUERIMIENTOS

### **Diseño Visual:**
- Usar iconos de mosquitos (🦟), análisis (📊), alertas (⚠️)
- Colores: Verde para disponible, amarillo para demo, rojo para error
- Diseño responsive y accesible
- Animaciones sutiles para feedback de carga

### **Experiencia de Usuario:**
- **Flujo de Bienvenida**: Explicar qué puede hacer el asistente
- **Prompts Rápidos**: Acceso fácil a consultas comunes
- **Consultas Personalizadas**: Input libre para preguntas específicas
- **Historial**: Conservar consultas recientes en sesión
- **Feedback Visual**: Loading states, errores, confirmaciones

### **Estados de la Aplicación:**
```javascript
// Estados que debes manejar:
const ESTADOS_IA = {
  CARGANDO: 'Conectando con asistente...',
  DISPONIBLE: 'Asistente IA listo 🤖',
  DEMO: 'Modo demo activo (respuestas simuladas)',
  ERROR: 'Asistente no disponible',
  PROCESANDO: 'Analizando datos ambientales...'
};
```

## 💻 CÓDIGO DE EJEMPLO

### **Hook personalizado sugerido:**
```javascript
// useIAService.js
const useIAService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const consultarIA = async (prompt, incluirContexto = true) => {
    setLoading(true);
    try {
      const response = await fetch('/api/consulta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          incluir_contexto: incluirContexto 
        })
      });
      
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const obtenerPromptsSugeridos = async () => {
    const response = await fetch('/api/prompts');
    return response.json();
  };

  const verificarStatus = async () => {
    const response = await fetch('/api/status');
    return response.json();
  };

  return { consultarIA, obtenerPromptsSugeridos, verificarStatus, loading, error };
};
```

### **Estructura de Respuesta IA para mostrar:**
```javascript
const RespuestaIA = ({ respuesta, timestamp, contexto }) => (
  <div className="bg-green-50 border-l-4 border-green-400 p-4 my-4">
    <div className="flex">
      <div className="flex-shrink-0">
        <span className="text-2xl">🤖</span>
      </div>
      <div className="ml-3">
        <div className="text-sm text-green-700 whitespace-pre-wrap">
          {respuesta}
        </div>
        {contexto && (
          <div className="mt-2 text-xs text-green-600">
            Basado en datos de: {contexto.actual?.nodo_id} - {timestamp}
          </div>
        )}
      </div>
    </div>
  </div>
);
```

## 🚀 FLUJO DE IMPLEMENTACIÓN SUGERIDO

### **Fase 1: Componente Base**
1. Crear `IAAssistant.jsx` con estado básico
2. Implementar verificación de status IA
3. Mostrar indicador de disponibilidad

### **Fase 2: Prompts Predefinidos**
1. Fetch y mostrar prompts sugeridos
2. Organizar por categorías
3. Implementar selección de prompts

### **Fase 3: Sistema de Consultas**
1. Input para consultas personalizadas  
2. Envío a API y manejo de respuestas
3. Mostrar respuestas formateadas

### **Fase 4: UX Mejorada**
1. Historial de consultas en sesión
2. Loading states y animaciones
3. Manejo de errores elegante
4. Responsive design

## 📊 CASOS DE USO TÍPICOS

### **Usuario Epidemiológico:**
- "¿Cuál es el riesgo actual de dengue?"
- "¿Deberían activarse alertas sanitarias?"
- "¿Cómo evolucionarán las condiciones mañana?"

### **Usuario Técnico:**
- "¿Qué significan estos niveles de CO2?"
- "¿Por qué el sensor de sonido marca 450 Hz?"
- "¿Hay correlación entre temperatura y actividad vectorial?"

### **Usuario Preventivo:**
- "¿Qué medidas preventivas recomiendas?"
- "¿Es buen momento para fumigación?"
- "¿Cómo educar a la comunidad sobre estos datos?"

## ⚡ CONSIDERACIONES ESPECIALES

### **Rendimiento:**
- Debounce en input de consultas (500ms)
- Cache de prompts sugeridos (localStorage)
- Lazy loading para historial extenso

### **Seguridad:**
- Validar inputs antes de enviar
- Sanitizar respuestas IA para mostrar
- Rate limiting del lado del cliente

### **Accesibilidad:**
- ARIA labels para lectores de pantalla
- Navegación por teclado
- Alto contraste para indicadores

### **Responsive:**
- Mobile-first design
- Optimizado para tablets de campo
- Botones touch-friendly

## 🎨 RECURSOS DE DISEÑO

### **Paleta de Colores Sugerida:**
```css
:root {
  --ia-primary: #10B981;     /* Verde para disponible */
  --ia-warning: #F59E0B;     /* Amarillo para demo */
  --ia-danger: #EF4444;      /* Rojo para errores */
  --ia-info: #3B82F6;        /* Azul para información */
  --ia-background: #F0FDF4;  /* Verde claro para fondo */
  --ia-text: #065F46;        /* Verde oscuro para texto */
}
```

### **Iconografía:**
- 🤖 Asistente IA
- 🦟 Análisis vectorial  
- 📊 Datos y tendencias
- ⚠️ Alertas y riesgos
- 💡 Recomendaciones
- 🌡️ Condiciones ambientales

## ✅ CRITERIOS DE ÉXITO

Tu implementación será exitosa si:

1. **✅ Funcionalidad Core**: Los usuarios pueden hacer consultas y recibir respuestas
2. **✅ UX Intuitiva**: Fácil de usar para personal no técnico
3. **✅ Diseño Responsive**: Funciona bien en móviles y tablets
4. **✅ Manejo de Errores**: Degrada graciosamente cuando hay problemas
5. **✅ Performance**: Respuesta rápida y smooth interactions
6. **✅ Integración**: Se ve nativo dentro del sistema VEMAT existente

## 🚨 NOTAS IMPORTANTES

- **El asistente funciona en modo DEMO** hasta configurar API key de Google Gemini
- **Todas las APIs están documentadas en Swagger**: `/api-docs`
- **El backend maneja contexto automático** de datos ambientales recientes
- **Las respuestas están optimizadas para Costa Rica** y epidemiología tropical

---

**¡Tienes todo lo necesario para implementar una interfaz IA excepcional! 🚀🦟**

Si necesitas aclaraciones sobre algún endpoint o funcionalidad específica, consulta la documentación Swagger en `/api-docs` o revisa el código del backend en `software/backend/routes/` (archivos: consulta.js, status.js, prompts.js)
