import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function BioacusticaChart({ data }) {
  
  const processData = (rawData) => {
    if (!rawData || rawData.length === 0) return [];
    
    return rawData
      .map(item => {
        const timestamp = new Date(item.fecha);
        const value = typeof item.acustica === 'number' ? item.acustica : 0;
        
        return {
          name: timestamp.toLocaleString('es-CR', {
            timeZone: "UTC",
          }),
          timestamp,
          value,
        };
      })
      .sort((a, b) => a.timestamp - b.timestamp);
  };

  const chartData = processData(data);

  return (
      <ResponsiveContainer width="100%" height={320} className="mb-4">
        <AreaChart data={chartData} className="bg-gradient-to-b from-ia-card to-ia-background">
          <CartesianGrid strokeDasharray="3 3" stroke="var(--ia-border)" opacity={0.5} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: "var(--ia-text-secondary)", fontSize: 10 }} 
            label={{ value: 'Fecha/Hora', position: "insideBottom", offset: -5, fill: "var(--ia-text-secondary)", fontSize: 12 }}
            height={50}
          />
          <YAxis
            label={{ value: "Bioacústica (Hz)", angle: -90, position: "insideLeft", fill: "var(--ia-text-secondary)" }}
            tick={{ fill: "var(--ia-text-secondary)", fontSize: 10 }}
            width={40}
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
            labelStyle={{ color: 'var(--ia-text)', fontWeight: 'bold', marginBottom: '5px' }}
            cursor={{ strokeDasharray: '3 3' }}
          />
          <Legend 
            wrapperStyle={{ color: 'var(--ia-text-secondary)', paddingTop: '10px' }}
            iconType="circle"
          />
          <defs>
            <linearGradient id="colorAcustica" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--ia-error)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--ia-error)" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--ia-error)"
            fill="url(#colorAcustica)"
            fillOpacity={0.6}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, stroke: 'var(--ia-error)', strokeWidth: 2, fill: 'var(--ia-background)' }}
            name="Bioacústica (Hz)"
          />
        </AreaChart>
      </ResponsiveContainer>
  );
}