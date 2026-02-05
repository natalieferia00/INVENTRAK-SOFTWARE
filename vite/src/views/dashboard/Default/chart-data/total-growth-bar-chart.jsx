// ==============================|| DASHBOARD - TOTAL GROWTH BAR CHART ||============================== //

const chartData = (productos = []) => {
  // Procesamos los datos del software (LocalStorage)
  const categoriasMap = productos.reduce((acc, prod) => {
    const cat = prod.categoria || 'General';
    if (!acc[cat]) acc[cat] = 0;
    acc[cat] += Number(prod.stock || 0);
    return acc;
  }, {});

  const labels = Object.keys(categoriasMap);
  const data = Object.values(categoriasMap);

  return {
    height: 480,
    type: 'bar',
    options: {
      chart: {
        id: 'bar-chart',
        stacked: true,
        toolbar: { show: true },
        zoom: { enabled: true }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%'
        }
      },
      xaxis: {
        type: 'category',
        categories: labels.length > 0 ? labels : ['Sin Datos']
      },
      legend: {
        show: true,
        position: 'bottom',
        fontFamily: 'inherit',
        labels: { useSeriesColors: false }
      },
      dataLabels: { enabled: false },
      grid: { show: true },
      tooltip: {
        theme: 'light',
        y: {
          formatter: (val) => `${val} unidades`
        }
      }
    },
    series: [
      {
        name: 'Stock por Categoría',
        data: data.length > 0 ? data : [0]
      }
    ]
  };
};

export default chartData;