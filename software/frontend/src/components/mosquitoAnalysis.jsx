import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function MosquitoAnalysis({ title = 'Análisis de Mosquitos' }) {
  // Datos de ejemplo para distribución de especies
  const speciesData = [
    { name: 'Aedes aegypti', value: 45, color: 'var(--ia-error)' },
    { name: 'Culex', value: 30, color: 'var(--ia-warning)' },
    { name: 'Anopheles', value: 15, color: 'var(--ia-info)' },
    { name: 'Otros', value: 10, color: 'var(--ia-success)' },
  ];

  // Datos de ejemplo para actividad por hora
  const activityData = [
    { name: '00:00', value: 15, color: 'var(--ia-info)' },
    { name: '04:00', value: 10, color: 'var(--ia-info)' },
    { name: '08:00', value: 25, color: 'var(--ia-info)' },
    { name: '12:00', value: 35, color: 'var(--ia-info)' },
    { name: '16:00', value: 45, color: 'var(--ia-info)' },
    { name: '20:00', value: 30, color: 'var(--ia-info)' },
  ];

  // Datos de ejemplo para riesgo por zona
  const riskData = [
    { name: 'Zona A', value: 80, color: 'var(--ia-error)' },
    { name: 'Zona B', value: 45, color: 'var(--ia-warning)' },
    { name: 'Zona C', value: 30, color: 'var(--ia-info)' },
    { name: 'Zona D', value: 15, color: 'var(--ia-success)' },
  ];

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

  return (
    <div className="chart-container bg-ia-card p-4 rounded-xl shadow-lg border border-ia-border transition-colors duration-500">
      <h2 className="text-ia-text text-xl font-semibold mb-4">{title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Distribución de especies */}
        <div>
          <h3 className="text-ia-text text-lg font-medium mb-3">Distribución de Especies</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <defs>
                {speciesData.map((entry, index) => (
                  <linearGradient key={`gradient-${index}`} id={`colorSpecies${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={entry.color} stopOpacity={0.9}/>
                    <stop offset="100%" stopColor={entry.color} stopOpacity={0.6}/>
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={speciesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {speciesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#colorSpecies${index})`} />
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
        
        {/* Actividad por hora */}
        <div>
          <h3 className="text-ia-text text-lg font-medium mb-3">Actividad por Hora</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={activityData} className="bg-gradient-to-b from-ia-card to-ia-background">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--ia-border)" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'var(--ia-text-secondary)', fontSize: 10 }}
                axisLine={{ stroke: 'var(--ia-border)' }}
                tickLine={{ stroke: 'var(--ia-border)' }}
              />
              <YAxis 
                tick={{ fill: 'var(--ia-text-secondary)', fontSize: 10 }}
                axisLine={{ stroke: 'var(--ia-border)' }}
                tickLine={{ stroke: 'var(--ia-border)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--ia-card)',
                  borderColor: 'var(--ia-border)',
                  color: 'var(--ia-text)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  padding: '10px'
                }}
                cursor={{ fill: 'rgba(var(--ia-accent-rgb), 0.1)' }}
              />
              <defs>
                <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--ia-info)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--ia-info)" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <Bar 
                dataKey="value" 
                name="Actividad" 
                fill="url(#colorActivity)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Riesgo por zona */}
      <div className="mb-6">
        <h3 className="text-ia-text text-lg font-medium mb-3">Índice de Riesgo por Zona</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart 
            data={riskData} 
            layout="vertical"
            className="bg-gradient-to-b from-ia-card to-ia-background"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--ia-border)" opacity={0.5} horizontal={false} />
            <XAxis 
              type="number"
              tick={{ fill: 'var(--ia-text-secondary)', fontSize: 10 }}
              axisLine={{ stroke: 'var(--ia-border)' }}
              tickLine={{ stroke: 'var(--ia-border)' }}
            />
            <YAxis 
              dataKey="name" 
              type="category"
              tick={{ fill: 'var(--ia-text-secondary)', fontSize: 10 }}
              axisLine={{ stroke: 'var(--ia-border)' }}
              tickLine={{ stroke: 'var(--ia-border)' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--ia-card)',
                borderColor: 'var(--ia-border)',
                color: 'var(--ia-text)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                padding: '10px'
              }}
              cursor={{ fill: 'rgba(var(--ia-accent-rgb), 0.1)' }}
            />
            <Legend />
            <Bar 
              dataKey="value" 
              name="Índice de Riesgo" 
              radius={[0, 4, 4, 0]}
            >
              {riskData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Resumen de análisis */}
      <div className="p-4 bg-ia-background rounded-lg border border-ia-border">
        <h3 className="text-ia-text text-lg font-medium mb-2">Resumen de Análisis</h3>
        <p className="text-ia-text-secondary text-sm">
          El análisis muestra una predominancia de <span className="font-semibold text-ia-error">Aedes aegypti</span> (45%), 
          con mayor actividad durante las <span className="font-semibold">16:00 horas</span>. 
          La <span className="font-semibold text-ia-error">Zona A</span> presenta el mayor índice de riesgo (80%). 
          Se recomienda intensificar las medidas de control en estas áreas y horarios específicos.
        </p>
      </div>
    </div>
  );
}