// Ruta sugerida: src/views/dashboard/Default/chart-data/bajaj-area-chart.js

const getBajajChartData = (productos) => {
    // Extraemos los datos de MongoDB: Stock para los puntos y Nombres para las etiquetas
    const stocks = productos.map((p) => p.stock);
    const nombres = productos.map((p) => p.nombre);

    return {
        type: 'area',
        height: 95,
        options: {
            chart: {
                id: 'support-chart',
                sparkline: {
                    enabled: true
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth',
                width: 1
            },
            tooltip: {
                fixed: {
                    enabled: false
                },
                x: {
                    show: true // Mostramos el nombre del producto al pasar el mouse
                },
                y: {
                    title: 'Stock: '
                },
                marker: {
                    show: false
                }
            },
            labels: nombres, // Sincronización con los nombres de la DB
            colors: ['#5e35b1'] // Color morado característico de Berry
        },
        series: [
            {
                name: 'Existencias',
                data: stocks.length > 0 ? stocks : [0] // Evita error si no hay productos
            }
        ]
    };
};

export default getBajajChartData;