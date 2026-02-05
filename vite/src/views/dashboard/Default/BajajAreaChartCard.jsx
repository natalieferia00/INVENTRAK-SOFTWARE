import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// third party
import Chart from 'react-apexcharts';

// project imports
import bajajChartOptions from './chart-data/bajaj-area-chart';
import useConfig from 'hooks/useConfig';

export default function BajajAreaChartCard({ productos = [], isLoading }) {
  const theme = useTheme();
  const { state: { fontFamily } } = useConfig();
  
  // Colores del tema para la sincronización visual
  const secondary800 = theme.palette.secondary[800];
  const secondaryDark = theme.palette.secondary.dark;

  const [chartOptions, setChartOptions] = useState(bajajChartOptions);
  const [series, setSeries] = useState([{ name: 'Existencias', data: [] }]);
  
  // --- MÉTRICAS SINCRONIZADAS CON MONGO ---
  const stockTotal = productos.reduce((sum, p) => sum + Number(p.stock || 0), 0);
  const totalRegistrados = productos.length;

  useEffect(() => {
    // 1. Mapeo de datos del backend (Modelo Producto: nombre, stock)
    const nombres = productos.length > 0 ? productos.map((p) => p.nombre) : ['Sin productos'];
    const valores = productos.length > 0 ? productos.map((p) => Number(p.stock)) : [0];

    // 2. Actualización de la serie (Datos reales de MongoDB)
    setSeries([{ 
      name: 'Existencias',
      data: valores 
    }]);

    // 3. Clonación y personalización de opciones de ApexCharts
    const nuevasOpciones = {
      ...bajajChartOptions,
      chart: { 
        ...bajajChartOptions.chart, 
        fontFamily: fontFamily,
        sparkline: { enabled: true } // Mantiene la gráfica limpia en el widget
      },
      colors: [secondaryDark],
      labels: nombres,
      tooltip: {
        fixed: { enabled: false },
        x: { show: true },
        y: {
          title: {
            formatter: () => 'Stock Actual: '
          }
        },
        marker: { show: false }
      }
    };

    setChartOptions(nuevasOpciones);

  }, [fontFamily, secondaryDark, productos]);

  return (
    <Card sx={{ bgcolor: 'secondary.light', position: 'relative' }}>
      <Grid container sx={{ p: 2, pb: 0, color: '#fff' }}>
        <Grid item xs={12}>
          <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Grid item>
              <Typography variant="subtitle1" sx={{ color: 'secondary.dark', fontWeight: 600 }}>
                Inventario Total
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4" sx={{ color: 'grey.800' }}>
                {isLoading ? '---' : `${stockTotal} Unds.`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ mb: 1.5 }}>
          <Typography variant="subtitle2" sx={{ color: 'grey.800', opacity: 0.8 }}>
            {totalRegistrados} Referencias activas
          </Typography>
        </Grid>
      </Grid>
      
      {/* Visualización de la data sincronizada */}
      <div style={{ marginTop: '10px' }}>
         <Chart 
            options={chartOptions} 
            series={series} 
            type="area" 
            height={95} 
         />
      </div>
    </Card>
  );
}