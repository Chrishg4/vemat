const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

/**
 * @swagger
 * /api/diagnostico:
 *   get:
 *     summary: Diagnóstico de base de datos y datos disponibles
 *     tags: [Diagnóstico]
 *     responses:
 *       200:
 *         description: Información de diagnóstico
 */

// Endpoint para diagnosticar datos en la base de datos
router.get('/', async (req, res) => {
  try {
    console.log('🔍 Iniciando diagnóstico de base de datos...');
    
    const diagnostico = {
      timestamp: new Date().toISOString(),
      tablas: {},
      consultas: {},
      errores: []
    };

    // 1. Verificar tabla nodos
    await new Promise((resolve) => {
      pool.query('SELECT COUNT(*) as count FROM nodos', (err, result) => {
        if (err) {
          diagnostico.errores.push(`Error en tabla nodos: ${err.message}`);
          diagnostico.tablas.nodos = { error: err.message };
        } else {
          diagnostico.tablas.nodos = { count: result[0].count };
          console.log('📊 Nodos encontrados:', result[0].count);
        }
        resolve();
      });
    });

    // 1.1 Verificar datos específicos de nodos
    await new Promise((resolve) => {
      pool.query('SELECT * FROM nodos LIMIT 3', (err, result) => {
        if (err) {
          diagnostico.errores.push(`Error consultando nodos: ${err.message}`);
          diagnostico.tablas.nodos_datos = { error: err.message };
        } else {
          diagnostico.tablas.nodos_datos = result;
          console.log('📊 Datos nodos:', result);
        }
        resolve();
      });
    });

    // 2. Verificar tabla lecturas
    await new Promise((resolve) => {
      pool.query('SELECT COUNT(*) as count FROM lecturas', (err, result) => {
        if (err) {
          diagnostico.errores.push(`Error en tabla lecturas: ${err.message}`);
          diagnostico.tablas.lecturas = { error: err.message };
        } else {
          diagnostico.tablas.lecturas = { count: result[0].count };
          console.log('📊 Lecturas encontradas:', result[0].count);
        }
        resolve();
      });
    });

    // 3. Verificar últimas lecturas
    await new Promise((resolve) => {
      const query = `
        SELECT 
          n.id as nodo_id, 
          COALESCE(n.tipo_zona, 'Zona no especificada') as tipo_zona, 
          n.latitud, n.longitud,
          l.temperatura, l.humedad, l.co2, l.sonido, 
          l.timestamp,
          DATE_FORMAT(l.timestamp, '%Y-%m-%d %H:%i:%s') as timestamp_formatted
        FROM nodos n 
        LEFT JOIN lecturas l ON n.id = l.nodo_id
        WHERE l.timestamp IS NOT NULL
        ORDER BY l.timestamp DESC
        LIMIT 5
      `;

      pool.query(query, (err, result) => {
        if (err) {
          diagnostico.errores.push(`Error en consulta unificada: ${err.message}`);
          diagnostico.consultas.ultimas_lecturas = { error: err.message };
        } else {
          diagnostico.consultas.ultimas_lecturas = {
            count: result.length,
            datos: result
          };
          console.log('📊 Últimas lecturas:', result.length);
        }
        resolve();
      });
    });

    // 4. Verificar estructura de tablas
    await new Promise((resolve) => {
      pool.query('DESCRIBE nodos', (err, result) => {
        if (err) {
          diagnostico.tablas.nodos_estructura = { error: err.message };
        } else {
          diagnostico.tablas.nodos_estructura = result;
        }
        resolve();
      });
    });

    await new Promise((resolve) => {
      pool.query('DESCRIBE lecturas', (err, result) => {
        if (err) {
          diagnostico.tablas.lecturas_estructura = { error: err.message };
        } else {
          diagnostico.tablas.lecturas_estructura = result;
        }
        resolve();
      });
    });

    // 5. Probar consulta específica que usa la IA
    await new Promise((resolve) => {
      const queryIA = `
        SELECT 
          n.id as nodo_id, 
          COALESCE(n.tipo_zona, 'Zona no especificada') as tipo_zona, 
          n.latitud, n.longitud,
          l.temperatura, l.humedad, l.co2, l.sonido, l.timestamp
        FROM nodos n 
        LEFT JOIN lecturas l ON n.id = l.nodo_id
        WHERE l.timestamp IS NOT NULL
        ORDER BY l.timestamp DESC
        LIMIT 1
      `;

      pool.query(queryIA, (err, result) => {
        if (err) {
          diagnostico.errores.push(`Error en consulta IA: ${err.message}`);
          diagnostico.consultas.consulta_ia = { error: err.message };
        } else {
          diagnostico.consultas.consulta_ia = {
            count: result.length,
            datos: result[0] || null
          };
          console.log('🤖 Consulta IA resultado:', result.length > 0 ? 'DATOS ENCONTRADOS' : 'NO HAY DATOS');
        }
        resolve();
      });
    });

    res.json({
      success: true,
      diagnostico
    });

  } catch (error) {
    console.error('❌ Error en diagnóstico:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Endpoint para insertar datos de prueba
router.post('/datos-prueba', async (req, res) => {
  try {
    console.log('🧪 Insertando datos de prueba...');

    // Insertar nodo de prueba si no existe
    await new Promise((resolve, reject) => {
      const queryNodo = `
        INSERT IGNORE INTO nodos (id, tipo_zona, latitud, longitud, activo) 
        VALUES ('test-node-01', 'Zona de Prueba', 9.9281, -84.0907, 1)
      `;
      pool.query(queryNodo, (err, result) => {
        if (err) return reject(err);
        console.log('✅ Nodo de prueba creado/actualizado');
        resolve();
      });
    });

    // Insertar lectura de prueba
    await new Promise((resolve, reject) => {
      const queryLectura = `
        INSERT INTO lecturas (nodo_id, temperatura, humedad, co2, sonido, timestamp) 
        VALUES ('test-node-01', 26.5, 65.2, 420, 45.3, NOW())
      `;
      pool.query(queryLectura, (err, result) => {
        if (err) return reject(err);
        console.log('✅ Lectura de prueba insertada');
        resolve();
      });
    });

    res.json({
      success: true,
      message: 'Datos de prueba insertados correctamente'
    });

  } catch (error) {
    console.error('❌ Error insertando datos de prueba:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
