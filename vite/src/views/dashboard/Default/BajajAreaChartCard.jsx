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

// ===========================|| DASHBOARD DEFAULT - BAJAJ AREA CHART CARD ||=========================== //

// Agregamos { productos } para recibir los datos de MongoDB
export default function BajajAreaChartCard({ productos = [], isLoading }) {
  const theme = useTheme();
  const { state: { fontFamily } } = useConfig();
  const secondary800 = theme.palette.secondary[800];

  const [chartOptions, setChartOptions] = useState(bajajChartOptions);
  const [series, setSeries] = useState([{ data: [] }]);
  
  // LOGICA DE SINCRONIZACIÓN: Calculamos stock en base a los 2 productos que ya tienes
  const stockTotal = productos.reduce((sum, p) => sum + Number(p.stock), 0);
  const totalRegistrados = productos.length;

  useEffect(() => {
    // Mapeamos los nombres y cantidades para la gráfica
    const nombres = productos.map((p) => p.nombre);
    const valores = productos.map((p) => Number(p.stock));

    setSeries([{ 
      name: 'Existencias',
      data: valores.length > 0 ? valores : [0, 0, 0, 0] 
    }]);

    setChartOptions({
      ...bajajChartOptions,
      chart: { 
        ...bajajChartOptions.chart, 
        fontFamily: fontFamily 
      },
      colors: [secondary800],
      labels: nombres.length > 0 ? nombres : ['Sin datos'],
      tooltip: {
        fixed: { enabled: false },
        x: { show: true },
        y: { title: { formatter: () => 'Stock: ' } }
      }
    });
  }, [fontFamily, secondary800, productos]);

  return (
    <Card sx={{ bgcolor: 'secondary.light', mt: -1 }}>
      <Grid container sx={{ p: 2, pb: 0, color: '#fff' }}>
        <Grid item xs={12}>
          <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Grid item>
              <Typography variant="subtitle1" sx={{ color: 'secondary.dark' }}>
                Resumen de Existencias
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4" sx={{ color: 'grey.800' }}>
                {/* Mostramos el stock real sincronizado */}
                {isLoading ? '...' : `${stockTotal} Unds.`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ color: 'grey.800' }}>
            {/* Mostramos el conteo real de productos */}
            {totalRegistrados} productos registrados en sistema
          </Typography>
        </Grid>
      </Grid>
      <Chart options={chartOptions} series={series} type="area" height={95} />
    </Card>
  );
}