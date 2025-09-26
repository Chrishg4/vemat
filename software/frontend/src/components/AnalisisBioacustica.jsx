import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function AnalisisBioacustica() {
  // Datos de ejemplo para el análisis de especies (en un caso real, estos datos vendrían del backend)
  const especiesData = [
    { name: 'Aedes aegypti', value: 45, color: 'var(--ia-error)' },
    { name: 'Culex', value: 30, color: 'var(--ia-warning)' },
    { name: 'Anopheles', value: 15, color: 'var(--ia-info)' },
    { name: 'Otros', value: 10, color: 'var(--ia-success)' },
  ];

  // Datos de ejemplo para actividad por período
  const actividadData = [
    { name: 'Mañana', value: 35, color: '#8884d8' },
    { name: 'Tarde', value: 25, color: '#82ca9d' },
    { name: 'Noche', value: 40, color: '#ffc658' },
  ];

  return (
    <div className="mt-6">
      <h3 className="text-ia-text text-lg font-semibold mb-3">Análisis de Bioacústica</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-ia-text text-md font-medium mb-2">Distribución de Especies</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={especiesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {especiesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--ia-card)',
                  borderColor: 'var(--ia-border)',
                  color: 'var(--ia-text)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  padding: '10px'
                }}
                formatter={(value) => [`${value}%`, 'Porcentaje']}
              />
              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                wrapperStyle={{ paddingLeft: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div>
          <h4 className="text-ia-text text-md font-medium mb-2">Actividad por Período</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={actividadData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {actividadData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--ia-card)',
                  borderColor: 'var(--ia-border)',
                  color: 'var(--ia-text)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  padding: '10px'
                }}
                formatter={(value) => [`${value}%`, 'Porcentaje']}
              />
              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                wrapperStyle={{ paddingLeft: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mt-4 bg-ia-card rounded-xl shadow-lg border border-ia-border p-4">
        <h4 className="text-ia-text text-md font-medium mb-2">Resumen de Análisis</h4>
        <p className="text-ia-text-secondary text-sm">
          El análisis de bioacústica indica una predominancia de <span className="font-semibold text-ia-error">Aedes aegypti</span> (45%), 
          con mayor actividad durante la <span className="font-semibold">noche</span> (40%). 
          Se recomienda intensificar las medidas de control en estas condiciones.
        </p>
      </div>
    </div>
  );
}
