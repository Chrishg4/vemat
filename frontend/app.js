function generarDatos() {
  return {
    temperatura: (20 + Math.random() * 10).toFixed(1),
    humedad: (50 + Math.random() * 30).toFixed(1),
    co2: (300 + Math.random() * 200).toFixed(0)
  };
}

function mostrarDatos() {
  const datos = generarDatos();
  document.getElementById("sensorData").innerHTML = `
    <li>🌡️ Temperatura: ${datos.temperatura} °C</li>
    <li>💧 Humedad: ${datos.humedad} %</li>
    <li>🫁 CO₂: ${datos.co2} ppm</li>
  `;
  actualizarGrafico(+datos.temperatura, +datos.humedad);
}

setInterval(mostrarDatos, 3000);

const ctx = document.getElementById("graficoSensor").getContext("2d");
let grafico = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Temperatura (°C)",
        borderColor: "red",
        data: [],
        fill: false,
      },
      {
        label: "Humedad (%)",
        borderColor: "blue",
        data: [],
        fill: false,
      }
    ]
  },
  options: {
    animation: false,
    responsive: true,
    scales: {
      x: { display: false },
      y: { min: 0, max: 100 }
    }
  }
});

function actualizarGrafico(temp, hum) {
  const tiempo = new Date().toLocaleTimeString();
  grafico.data.labels.push(tiempo);
  grafico.data.datasets[0].data.push(temp);
  grafico.data.datasets[1].data.push(hum);

  if (grafico.data.labels.length > 10) {
    grafico.data.labels.shift();
    grafico.data.datasets[0].data.shift();
    grafico.data.datasets[1].data.shift();
  }

  grafico.update();
}
